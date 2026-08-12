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
        Long id;
        try {
            id = Long.valueOf(userId);
        } catch (NumberFormatException ex) {
            throw new UserNotFoundException(userId);
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(userId));

        return UserResponse.from(user);
    }
}