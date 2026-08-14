package com.edutrack.activityservice.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;

@Service
public class FileService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    private Path fileStorageLocation;

    @PostConstruct
    public void init() {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file, String userId) throws IOException {
        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null && originalName.lastIndexOf('.') > 0) {
            extension = originalName.substring(originalName.lastIndexOf('.'));
        }
        
        String fileName = UUID.randomUUID().toString() + extension;
        Path targetLocation = this.fileStorageLocation.resolve(fileName);
        
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        return fileName;
    }

    public Resource getFile(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                return null;
            }
        } catch (Exception ex) {
            return null;
        }
    }
}
