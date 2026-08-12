package com.edutrack.userservice.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * {@code secret} MUST match activity-service's app.jwt.secret exactly —
 * this service issues the tokens that activity-service only verifies.
 */
@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(
        String secret,
        long accessTokenExpirationMs
) {
}
