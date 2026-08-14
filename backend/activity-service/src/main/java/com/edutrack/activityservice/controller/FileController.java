package com.edutrack.activityservice.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.edutrack.activityservice.domain.Activity;
import com.edutrack.activityservice.domain.ActivityStatus;
import com.edutrack.activityservice.repository.ActivityRepository;
import com.edutrack.activityservice.security.AuthenticatedUser;
import com.edutrack.activityservice.service.FileService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/files")
@Tag(name = "Files", description = "Certificate and file upload/download")
public class FileController {

    private final FileService fileService;
    private final ActivityRepository activityRepository;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    private static final List<String> ALLOWED_MIME_TYPES = List.of(
            MediaType.APPLICATION_PDF_VALUE,
            MediaType.IMAGE_JPEG_VALUE,
            MediaType.IMAGE_PNG_VALUE
    );

    public FileController(FileService fileService, ActivityRepository activityRepository) {
        this.fileService = fileService;
        this.activityRepository = activityRepository;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Upload a file and get its ID")
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file,
                                         @AuthenticationPrincipal AuthenticatedUser user) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body("File exceeds 5MB limit");
        }
        
        // Extension check
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || (!originalFilename.toLowerCase().endsWith(".pdf") && !originalFilename.toLowerCase().endsWith(".jpg") && !originalFilename.toLowerCase().endsWith(".jpeg") && !originalFilename.toLowerCase().endsWith(".png"))) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body("Invalid file extension. Only PDF, JPEG, and PNG are allowed.");
        }

        // Magic Byte check via Tika
        try {
            org.apache.tika.Tika tika = new org.apache.tika.Tika();
            String detectedType = tika.detect(file.getInputStream());
            if (!ALLOWED_MIME_TYPES.contains(detectedType)) {
                return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body("Invalid file content. Only PDF, JPEG, and PNG are allowed");
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to verify file content");
        }
        
        try {
            String fileId = fileService.storeFile(file, user.id());
            return ResponseEntity.status(HttpStatus.CREATED).body(fileId);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Download a file by ID")
    public ResponseEntity<Resource> download(@PathVariable String id,
                                             @AuthenticationPrincipal AuthenticatedUser user) {
        Resource resource = fileService.getFile(id);
        if (resource == null) {
            return ResponseEntity.notFound().build();
        }

        // Authorization Check
        boolean authorized = false;
        String role = user.role();
        
        if ("ADMIN".equals(role)) {
            authorized = true;
        } else {
            List<Activity> activities = activityRepository.findByCertificateReference(id);
            if ("STUDENT".equals(role)) {
                if (activities.stream().anyMatch(a -> user.id().equals(a.getStudentId()))) {
                    authorized = true;
                }
            } else if ("FACULTY".equals(role)) {
                // Faculty can access files for activities they need to verify (which is any pending activity, or activities they have already verified)
                if (!activities.isEmpty()) {
                    authorized = true; 
                }
            } else if ("EMPLOYER".equals(role)) {
                boolean isVerified = activities.stream().anyMatch(a -> a.getStatus() == ActivityStatus.VERIFIED);
                if (isVerified) {
                    authorized = true;
                }
            }
        }

        if (!authorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            String contentType = Files.probeContentType(resource.getFile().toPath());
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

