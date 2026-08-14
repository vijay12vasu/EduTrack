package com.edutrack.activityservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.edutrack.activityservice.domain.Activity;
import com.edutrack.activityservice.domain.ActivityStatus;
import com.edutrack.activityservice.dto.request.CreateActivityRequest;
import com.edutrack.activityservice.dto.request.UpdateActivityRequest;
import com.edutrack.activityservice.dto.response.ActivityResponse;
import com.edutrack.activityservice.dto.response.ActivitySummaryResponse;
import com.edutrack.activityservice.exception.ForbiddenActivityActionException;
import com.edutrack.activityservice.security.AuthenticatedUser;
import com.edutrack.activityservice.service.ActivityService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/activities")
@Tag(name = "Activities", description = "Student submission and self-management of activity records")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @Operation(summary = "Submit a new activity for faculty verification")
    public ResponseEntity<ActivityResponse> create(@Valid @RequestBody CreateActivityRequest request,
                                                     @AuthenticationPrincipal AuthenticatedUser student) {
        Activity created = activityService.create(request, student);
        return ResponseEntity.status(HttpStatus.CREATED).body(ActivityResponse.from(created));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @Operation(summary = "List the current student's own activity records, optionally filtered by status")
    public List<ActivityResponse> findMine(@RequestParam(required = false) ActivityStatus status,
                                            @AuthenticationPrincipal AuthenticatedUser student) {
        return activityService.findMine(student, status).stream().map(ActivityResponse::from).toList();
    }

    @GetMapping("/me/summary")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @Operation(summary = "Status counts (total/pending/verified/rejected) for the current student")
    public ActivitySummaryResponse summarizeMine(@AuthenticationPrincipal AuthenticatedUser student) {
        return activityService.summarizeMine(student);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get a single activity record (owner, or any FACULTY/ADMIN)")
    public ActivityResponse findById(@PathVariable String id, @AuthenticationPrincipal AuthenticatedUser user) {
        Activity activity = activityService.findById(id);

        boolean isOwner = activity.getStudentId().equals(user.id());
        boolean isReviewerRole = "FACULTY".equals(user.role()) || "ADMIN".equals(user.role());
        if (!isOwner && !isReviewerRole) {
            throw new ForbiddenActivityActionException("You do not have access to this activity record");
        }

        return ActivityResponse.from(activity);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @Operation(summary = "Edit an activity the current student submitted, while it is still PENDING")
    public ActivityResponse update(@PathVariable String id,
                                    @Valid @RequestBody UpdateActivityRequest request,
                                    @AuthenticationPrincipal AuthenticatedUser student) {
        return ActivityResponse.from(activityService.updateOwn(id, request, student));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @Operation(summary = "Withdraw an activity the current student submitted, while it is still PENDING")
    public ResponseEntity<Void> withdraw(@PathVariable String id, @AuthenticationPrincipal AuthenticatedUser student) {
        activityService.withdrawOwn(id, student);
        return ResponseEntity.noContent().build();
    }
}
