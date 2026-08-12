package com.edutrack.activityservice.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edutrack.activityservice.dto.request.RejectActivityRequest;
import com.edutrack.activityservice.dto.response.ActivityResponse;
import com.edutrack.activityservice.security.AuthenticatedUser;
import com.edutrack.activityservice.service.ActivityService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/activities/verification")
@PreAuthorize("hasAuthority('ROLE_FACULTY')")
@Tag(name = "Verification", description = "Faculty review queue: approve or reject pending student activities")
public class VerificationController {

    private final ActivityService activityService;

    public VerificationController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping("/pending")
    @Operation(summary = "List all PENDING activities awaiting review")
    public List<ActivityResponse> findPending() {
        return activityService.findPending().stream().map(ActivityResponse::from).toList();
    }

    @GetMapping("/verified-by-me")
    @Operation(summary = "List all activities this faculty member has approved or rejected")
    public List<ActivityResponse> findReviewedByMe(@AuthenticationPrincipal AuthenticatedUser faculty) {
        return activityService.findReviewedByFaculty(faculty).stream().map(ActivityResponse::from).toList();
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "Approve a PENDING activity")
    public ActivityResponse approve(@PathVariable String id, @AuthenticationPrincipal AuthenticatedUser faculty) {
        return ActivityResponse.from(activityService.approve(id, faculty));
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "Reject a PENDING activity, optionally with remarks")
    public ActivityResponse reject(@PathVariable String id,
                                    @Valid @RequestBody RejectActivityRequest request,
                                    @AuthenticationPrincipal AuthenticatedUser faculty) {
        return ActivityResponse.from(activityService.reject(id, request, faculty));
    }
}
