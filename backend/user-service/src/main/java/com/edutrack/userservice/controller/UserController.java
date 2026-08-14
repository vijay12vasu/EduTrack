package com.edutrack.userservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edutrack.userservice.dto.response.UserResponse;
import com.edutrack.userservice.security.AuthenticatedUser;
import com.edutrack.userservice.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal AuthenticatedUser principal) {
        return ResponseEntity.ok(userService.getCurrentUser(principal.id()));
    }

    @org.springframework.web.bind.annotation.PutMapping("/me")
    public ResponseEntity<UserResponse> updateMe(@AuthenticationPrincipal AuthenticatedUser principal,
                                                 @jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody com.edutrack.userservice.dto.request.UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(principal.id(), request));
    }
}