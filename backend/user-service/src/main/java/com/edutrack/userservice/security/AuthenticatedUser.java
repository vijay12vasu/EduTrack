package com.edutrack.userservice.security;

public record AuthenticatedUser(
        String id,
        String email,
        String fullName,
        String role
) {
}