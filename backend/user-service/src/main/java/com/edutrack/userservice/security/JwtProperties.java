package com.edutrack.userservice.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * {@code secret} MUST match activity-service's app.jwt.secret exactly —
 * this service issues the tokens that activity-service only verifies.
 */
@Validated
@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(
        @NotBlank(message = "JWT_SECRET environment variable is missing!")
        @Size(min = 32, message = "JWT_SECRET must be at least 32 characters long")
        String secret,
        long accessTokenExpirationMs
) {
}
