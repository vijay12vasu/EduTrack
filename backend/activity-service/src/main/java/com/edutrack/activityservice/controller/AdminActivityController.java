package com.edutrack.activityservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.edutrack.activityservice.domain.ActivityStatus;
import com.edutrack.activityservice.dto.response.ActivityResponse;
import com.edutrack.activityservice.dto.response.ActivitySummaryResponse;
import com.edutrack.activityservice.dto.response.PublicActivityResponse;
import com.edutrack.activityservice.service.ActivityService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.edutrack.activityservice.security.AuthenticatedUser;

@RestController
@RequestMapping("/api/activities/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYER', 'FACULTY')")
@Tag(name = "Admin Activities", description = "Org-wide view over every activity record")
public class AdminActivityController {

    private final ActivityService activityService;

    public AdminActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    @Operation(summary = "List all activity records, optionally filtered by status/category/studentId")
    public ResponseEntity<?> findAll(@RequestParam(required = false) ActivityStatus status,
                                           @RequestParam(required = false) String category,
                                           @RequestParam(required = false) String studentId,
                                           @AuthenticationPrincipal AuthenticatedUser user) {
        if ("EMPLOYER".equals(user.role())) {
            status = ActivityStatus.VERIFIED;
            List<PublicActivityResponse> res = activityService.findAll(status, category, studentId).stream()
                .map(PublicActivityResponse::from).toList();
            return ResponseEntity.ok(res);
        }
        
        List<ActivityResponse> res = activityService.findAll(status, category, studentId).stream()
            .map(ActivityResponse::from).toList();
        return ResponseEntity.ok(res);
    }

    @GetMapping("/summary")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Org-wide status counts (total/pending/verified/rejected)")
    public ActivitySummaryResponse summary() {
        return activityService.summarizeAll();
    }
}
