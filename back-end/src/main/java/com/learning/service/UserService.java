package com.learning.service;

import com.learning.dto.UserCreateRequest;
import com.learning.dto.UserResponse;
import com.learning.dto.UserUpdateRequest;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserCreateRequest request);
    List<UserResponse> getAllUsers();
    UserResponse getUserById(String id);
    UserResponse updateUser(String id, UserUpdateRequest request);
    void deleteUser(String id);
}
