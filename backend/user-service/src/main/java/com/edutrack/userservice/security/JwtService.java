package com.edutrack.userservice.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import com.edutrack.userservice.domain.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

/**
 * Issues and validates access tokens. Claim names and signing scheme here
 * are a contract shared with activity-service's read-only JwtService:
 * HS256, and exactly the claims subject/email/role/fullName. Don't rename
 * or remove any of these without updating activity-service too.
 */
@Service
public class JwtService {

    private static final String CLAIM_EMAIL = "email";
    private static final String CLAIM_ROLE = "role";
    private static final String CLAIM_FULL_NAME = "fullName";

    private final SecretKey signingKey;
    private final long accessTokenExpirationMs;

    public JwtService(JwtProperties jwtProperties) {
        this.signingKey = Keys.hmacShaKeyFor(jwtProperties.secret().getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpirationMs = jwtProperties.accessTokenExpirationMs();
    }

    public String generateAccessToken(User user) {
        Instant now = Instant.now();
        Instant expiry = now.plusMillis(accessTokenExpirationMs);

        return Jwts.builder()
                .subject(String.valueOf(user.getId()))
                .claim(CLAIM_EMAIL, user.getEmail())
                .claim(CLAIM_FULL_NAME, user.getFullName())
                .claim(CLAIM_ROLE, user.getRole().name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(signingKey)
                .compact();
    }

    public long getAccessTokenExpirationSeconds() {
        return accessTokenExpirationMs / 1000;
    }

    /**
     * @throws JwtException if the token is malformed, expired, or the signature doesn't match
     */
    public Claims parseAndValidate(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public AuthenticatedUser toAuthenticatedUser(Claims claims) {
        return new AuthenticatedUser(
                claims.getSubject(),
                claims.get(CLAIM_EMAIL, String.class),
                claims.get(CLAIM_FULL_NAME, String.class),
                claims.get(CLAIM_ROLE, String.class)
        );
    }
}