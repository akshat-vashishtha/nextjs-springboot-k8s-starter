package com.learning.service.impl;

import com.learning.domain.User;
import com.learning.domain.enums.UserStatus;
import com.learning.dto.UserCreateRequest;
import com.learning.dto.UserResponse;
import com.learning.dto.UserUpdateRequest;
import com.learning.exception.DuplicateEmailException;
import com.learning.exception.ResourceNotFoundException;
import com.learning.repository.UserRepository;
import com.learning.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserResponse createUser(UserCreateRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateEmailException("User with email '" + normalizedEmail + "' already exists");
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(normalizedEmail);
        user.setRole(request.role());
        user.setStatus(UserStatus.ACTIVE);

        User savedUser = userRepository.save(user);
        return UserResponse.fromEntity(savedUser);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::fromEntity)
                .toList();
    }

    @Override
    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserResponse.fromEntity(user);
    }

    @Override
    public UserResponse updateUser(String id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setName(request.name().trim());
        user.setRole(request.role());
        user.setStatus(request.status());

        User updatedUser = userRepository.save(user);
        return UserResponse.fromEntity(updatedUser);
    }

    @Override
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}
