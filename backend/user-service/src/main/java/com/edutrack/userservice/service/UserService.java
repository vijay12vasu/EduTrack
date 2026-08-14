package com.edutrack.userservice.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.edutrack.userservice.domain.User;
import com.edutrack.userservice.dto.response.UserResponse;
import com.edutrack.userservice.exception.UserNotFoundException;
import com.edutrack.userservice.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        return UserResponse.from(user);
    }

    @Transactional
    public UserResponse updateProfile(String userId, com.edutrack.userservice.dto.request.UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        
        user.setFullName(request.fullName().trim());
        if (request.department() != null) user.setDepartment(request.department().trim());
        if (request.year() != null) user.setYear(request.year().trim());
        if (request.mobile() != null) user.setMobile(request.mobile().trim());
        if (request.registerNumber() != null) user.setRegisterNumber(request.registerNumber().trim());
        if (request.facultyId() != null) user.setFacultyId(request.facultyId().trim());
        if (request.company() != null) user.setCompany(request.company().trim());
        
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public java.util.List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public java.util.List<UserResponse> getUsersByRole(com.edutrack.userservice.domain.Role role) {
        return userRepository.findByRole(role).stream()
                .map(UserResponse::from)
                .toList();
    }

    @Transactional
    public UserResponse createUser(com.edutrack.userservice.dto.request.AdminCreateUserRequest request, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        String normalizedEmail = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new com.edutrack.userservice.exception.EmailAlreadyExistsException(normalizedEmail);
        }
        User user = User.builder()
                .fullName(request.fullName().trim())
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(request.role())
                .build();
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public UserResponse createStudent(com.edutrack.userservice.dto.request.AdminCreateStudentRequest request, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        String normalizedEmail = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new com.edutrack.userservice.exception.EmailAlreadyExistsException(normalizedEmail);
        }
        User user = User.builder()
                .fullName(request.fullName().trim())
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(com.edutrack.userservice.domain.Role.STUDENT)
                .registerNumber(request.registerNumber().trim())
                .department(request.department().trim())
                .year(request.year().trim())
                .mobile(request.mobile() != null ? request.mobile().trim() : null)
                .build();
        return UserResponse.from(userRepository.save(user));
    }
}