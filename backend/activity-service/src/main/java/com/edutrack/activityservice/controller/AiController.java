package com.edutrack.activityservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edutrack.activityservice.security.AuthenticatedUser;
import com.edutrack.activityservice.service.AiService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/activities/ai")
@Tag(name = "AI", description = "AI scoring and analysis")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/score")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @Operation(summary = "Generate AI score and insights for the current student")
    public ResponseEntity<AiService.AiScoreResponse> getScore(@AuthenticationPrincipal AuthenticatedUser student) {
        return ResponseEntity.ok(aiService.generateScore(student));
    }

    @GetMapping("/score/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'EMPLOYER')")
    @Operation(summary = "Generate AI score and insights for a specific student")
    public ResponseEntity<AiService.AiScoreResponse> getScoreForStudent(@org.springframework.web.bind.annotation.PathVariable String studentId) {
        return ResponseEntity.ok(aiService.generateScoreForStudent(studentId));
    }
}
