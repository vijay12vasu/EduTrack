package com.edutrack.userservice.service;

import org.springframework.stereotype.Service;

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

    public UserResponse getCurrentUser(String userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        return UserResponse.from(user);
    }
}