package com.edutrack.userservice.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.edutrack.userservice.domain.Role;
import com.edutrack.userservice.domain.User;
import com.edutrack.userservice.dto.request.LoginRequest;
import com.edutrack.userservice.dto.request.RegisterRequest;
import com.edutrack.userservice.dto.response.AuthResponse;
import com.edutrack.userservice.dto.response.UserResponse;
import com.edutrack.userservice.exception.EmailAlreadyExistsException;
import com.edutrack.userservice.exception.InvalidCredentialsException;
import com.edutrack.userservice.repository.UserRepository;
import com.edutrack.userservice.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {

        String normalizedEmail = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new EmailAlreadyExistsException(normalizedEmail);
        }

        User user = User.builder()
                .fullName(request.fullName().trim())
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(Role.STUDENT)
                .build();

        User saved = userRepository.save(user);

        return issueAuthResponse(saved);
    }

    public AuthResponse login(LoginRequest request) {

        String normalizedEmail = request.email().trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(
                request.password(),
                user.getPasswordHash())) {

            throw new InvalidCredentialsException();
        }

        return issueAuthResponse(user);
    }

    private AuthResponse issueAuthResponse(User user) {

        String token = jwtService.generateAccessToken(user);

        return AuthResponse.of(
                token,
                jwtService.getAccessTokenExpirationSeconds(),
                UserResponse.from(user)
        );
    }
}