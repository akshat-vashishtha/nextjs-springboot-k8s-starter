package com.learning.dto;

import com.learning.domain.enums.UserRole;
import com.learning.domain.enums.UserStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(
        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
        String name,

        @NotNull(message = "Role is required")
        UserRole role,

        @NotNull(message = "Status is required")
        UserStatus status
) {
}
