package com.edutrack.userservice.dto.response;

import com.edutrack.userservice.domain.Role;
import com.edutrack.userservice.domain.User;

public record UserResponse(
        String id,
        String fullName,
        String email,
        Role role
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }
}