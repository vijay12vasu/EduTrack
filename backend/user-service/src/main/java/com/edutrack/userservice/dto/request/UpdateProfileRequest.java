package com.edutrack.userservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank(message = "Full name is required")
        @Size(min = 2, max = 50, message = "Full name must be between 2 and 50 characters")
        String fullName,
        String department,
        String year,
        String mobile,
        String registerNumber,
        String facultyId,
        String company
) {
}
