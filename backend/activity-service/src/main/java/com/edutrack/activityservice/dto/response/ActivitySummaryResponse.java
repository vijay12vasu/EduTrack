package com.edutrack.activityservice.dto.response;

public record ActivitySummaryResponse(
        long total,
        long pending,
        long verified,
        long rejected
) {
}
