package com.edutrack.activityservice.dto.request;

import jakarta.validation.constraints.Size;

public record RejectActivityRequest(

        @Size(max = 500, message = "Remarks must be at most 500 characters")
        String remarks
) {
}
