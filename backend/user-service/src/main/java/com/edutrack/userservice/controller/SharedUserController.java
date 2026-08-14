package com.edutrack.userservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edutrack.userservice.domain.Role;
import com.edutrack.userservice.dto.response.UserResponse;
import com.edutrack.userservice.service.UserService;

@RestController
@RequestMapping("/api/users/shared")
@PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'EMPLOYER')")
public class SharedUserController {

    private final UserService userService;

    public SharedUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/students")
    public ResponseEntity<List<UserResponse>> getStudents() {
        return ResponseEntity.ok(userService.getUsersByRole(Role.STUDENT));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable String id, @org.springframework.security.core.annotation.AuthenticationPrincipal com.edutrack.userservice.security.AuthenticatedUser auth) {
        UserResponse target = userService.getCurrentUser(id);
        if ("EMPLOYER".equals(auth.role()) && target.role() != Role.STUDENT) {
            return org.springframework.http.ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(target);
    }
}
