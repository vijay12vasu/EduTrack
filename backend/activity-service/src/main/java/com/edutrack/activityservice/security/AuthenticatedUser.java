package com.edutrack.activityservice.security;

/**
 * The caller identity extracted from a validated access token, carried as
 * the {@code Authentication} principal for the lifetime of the request.
 * <p>
 * {@code email} and {@code fullName} are only present because user-service
 * puts them in the JWT claims; that lets this service denormalize a
 * student's/faculty's display name onto an {@code Activity} record at
 * write time without a cross-service lookup. Don't rely on these being
 * fresh — they reflect the state of the user at token-issue time, not now.
 */
public record AuthenticatedUser(
        String id,
        String email,
        String fullName,
        String role
) {
}
