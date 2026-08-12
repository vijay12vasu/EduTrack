package com.edutrack.activityservice.domain;

/**
 * Lifecycle of a student activity submission.
 * <p>
 * PENDING -&gt; VERIFIED (faculty approves) or PENDING -&gt; REJECTED (faculty
 * rejects, optionally with remarks). Once VERIFIED or REJECTED, a record is
 * final — it cannot be edited by the student or re-reviewed by faculty.
 */
public enum ActivityStatus {
    PENDING,
    VERIFIED,
    REJECTED
}
