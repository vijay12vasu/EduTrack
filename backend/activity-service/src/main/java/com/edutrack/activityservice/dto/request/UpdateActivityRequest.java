package com.edutrack.activityservice.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

/**
 * Payload for a student editing an activity they submitted. Only permitted
 * while the record is still PENDING — see
 * {@link com.edutrack.activityservice.service.ActivityService#updateOwn}.
 */
public record UpdateActivityRequest(

        @NotBlank(message = "Activity title is required")
        @Size(max = 150, message = "Title must be at most 150 characters")
        String title,

        @NotBlank(message = "Category is required")
        @Size(max = 60, message = "Category must be at most 60 characters")
        String category,

        @NotNull(message = "Activity date is required")
        @PastOrPresent(message = "Activity date cannot be in the future")
        LocalDate activityDate,

        @Size(max = 2000, message = "Description must be at most 2000 characters")
        String description,

        @NotBlank(message = "Certificate/proof reference is required")
        String certificateReference
) {
}
