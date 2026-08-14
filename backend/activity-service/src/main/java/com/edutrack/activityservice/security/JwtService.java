package com.edutrack.activityservice.security;

import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

/**
 * Verifies access tokens issued by user-service. This is a read-only
 * counterpart of user-service's JwtService: same claim names
 * (subject/email/role/fullName), same signing algorithm, but no token
 * issuance, since activity-service is never the one handing out tokens —
 * per the architecture decision that every microservice independently
 * validates JWT signatures rather than trusting the gateway alone.
 */
@Service
public class JwtService {

    private static final String CLAIM_EMAIL = "email";
    private static final String CLAIM_ROLE = "role";
    private static final String CLAIM_FULL_NAME = "fullName";

    private final SecretKey signingKey;

    public JwtService(JwtProperties jwtProperties) {
        this.signingKey = Keys.hmacShaKeyFor(jwtProperties.secret().getBytes(StandardCharsets.UTF_8));
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
