package com.edutrack.userservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edutrack.userservice.domain.Role;
import com.edutrack.userservice.dto.request.AdminCreateUserRequest;
import com.edutrack.userservice.dto.response.UserResponse;
import com.edutrack.userservice.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AdminUserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/students")
    public ResponseEntity<List<UserResponse>> getStudents() {
        return ResponseEntity.ok(userService.getUsersByRole(Role.STUDENT));
    }

    @GetMapping("/faculty")
    public ResponseEntity<List<UserResponse>> getFaculty() {
        return ResponseEntity.ok(userService.getUsersByRole(Role.FACULTY));
    }

    @GetMapping("/employers")
    public ResponseEntity<List<UserResponse>> getEmployers() {
        return ResponseEntity.ok(userService.getUsersByRole(Role.EMPLOYER));
    }

    @GetMapping("/admins")
    public ResponseEntity<List<UserResponse>> getAdmins() {
        return ResponseEntity.ok(userService.getUsersByRole(Role.ADMIN));
    }

    @PostMapping("/create")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody AdminCreateUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(request, passwordEncoder));
    }

    @PostMapping("/students")
    public ResponseEntity<UserResponse> createStudent(@Valid @RequestBody com.edutrack.userservice.dto.request.AdminCreateStudentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createStudent(request, passwordEncoder));
    }
}
