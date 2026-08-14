package com.edutrack.userservice.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.edutrack.userservice.domain.Role;
import com.edutrack.userservice.domain.User;
import com.edutrack.userservice.repository.UserRepository;

@Component
public class TestAccountInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public TestAccountInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        createOrUpdateUser("Test Student", "student@test.com", "test@123", Role.STUDENT);
        createOrUpdateUser("Test Faculty", "faculty@test.com", "test@123", Role.FACULTY);
        createOrUpdateUser("Test Admin", "admin@test.com", "test@123", Role.ADMIN);
        createOrUpdateUser("Test Employer", "employer@test.com", "test@123", Role.EMPLOYER);
    }

    private void createOrUpdateUser(String fullName, String email, String password, Role role) {
        userRepository.findByEmail(email).ifPresentOrElse(
                user -> {
                    user.setFullName(fullName);
                    user.setPasswordHash(passwordEncoder.encode(password));
                    user.setRole(role);
                    userRepository.save(user);
                    System.out.println("Updated existing test user: " + email);
                },
                () -> {
                    User user = User.builder()
                            .fullName(fullName)
                            .email(email)
                            .passwordHash(passwordEncoder.encode(password))
                            .role(role)
                            .build();
                    userRepository.save(user);
                    System.out.println("Created new test user: " + email);
                }
        );
    }
}
