package com.edutrack.activityservice.dto.response;

import java.time.Instant;
import java.time.LocalDate;

import com.edutrack.activityservice.domain.Activity;
import com.edutrack.activityservice.domain.ActivityStatus;

public record ActivityResponse(
        String id,
        String studentId,
        String studentName,
        String studentEmail,
        String title,
        String category,
        LocalDate activityDate,
        String description,
        String certificateReference,
        ActivityStatus status,
        String verifierId,
        String verifierName,
        String remarks,
        Instant createdAt,
        Instant updatedAt,
        java.util.List<com.edutrack.activityservice.domain.ActivityEvent> history
) {
    public static ActivityResponse from(Activity activity) {
        return new ActivityResponse(
                activity.getId(),
                activity.getStudentId(),
                activity.getStudentName(),
                activity.getStudentEmail(),
                activity.getTitle(),
                activity.getCategory(),
                activity.getActivityDate(),
                activity.getDescription(),
                activity.getCertificateReference(),
                activity.getStatus(),
                activity.getVerifierId(),
                activity.getVerifierName(),
                activity.getRemarks(),
                activity.getCreatedAt(),
                activity.getUpdatedAt(),
                activity.getHistory()
        );
    }
}
