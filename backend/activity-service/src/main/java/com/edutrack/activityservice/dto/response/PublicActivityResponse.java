package com.edutrack.activityservice.dto.response;

import java.time.LocalDate;

import com.edutrack.activityservice.domain.Activity;
import com.edutrack.activityservice.domain.ActivityStatus;

public record PublicActivityResponse(
        String id,
        String studentName,
        String title,
        String category,
        LocalDate activityDate,
        String description,
        String certificateReference,
        ActivityStatus status
) {
    public static PublicActivityResponse from(Activity activity) {
        return new PublicActivityResponse(
                activity.getId(),
                activity.getStudentName(),
                activity.getTitle(),
                activity.getCategory(),
                activity.getActivityDate(),
                activity.getDescription(),
                activity.getCertificateReference(),
                activity.getStatus()
        );
    }
}
