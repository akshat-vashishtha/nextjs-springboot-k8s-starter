package com.learning.dto;

import com.learning.domain.User;
import com.learning.domain.enums.UserRole;
import com.learning.domain.enums.UserStatus;

import java.time.Instant;

public record UserResponse(
        String id,
        String name,
        String email,
        UserRole role,
        UserStatus status,
        Instant createdAt,
        Instant updatedAt
) {
    public static UserResponse fromEntity(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
