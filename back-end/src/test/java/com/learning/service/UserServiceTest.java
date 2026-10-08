package com.learning.service;

import com.learning.domain.User;
import com.learning.domain.enums.UserRole;
import com.learning.domain.enums.UserStatus;
import com.learning.dto.UserCreateRequest;
import com.learning.dto.UserResponse;
import com.learning.dto.UserUpdateRequest;
import com.learning.exception.DuplicateEmailException;
import com.learning.exception.ResourceNotFoundException;
import com.learning.repository.UserRepository;
import com.learning.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User(
                "user-123",
                "Alice Wonderland",
                "alice@example.com",
                UserRole.USER,
                UserStatus.ACTIVE,
                Instant.now(),
                Instant.now()
        );
    }

    @Test
    @DisplayName("Should create user successfully when email is unique")
    void shouldCreateUser() {
        UserCreateRequest request = new UserCreateRequest("Alice Wonderland", "alice@example.com", UserRole.USER);

        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        UserResponse response = userService.createUser(request);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo("user-123");
        assertThat(response.email()).isEqualTo("alice@example.com");
        assertThat(response.role()).isEqualTo(UserRole.USER);
        assertThat(response.status()).isEqualTo(UserStatus.ACTIVE);

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw DuplicateEmailException when email already exists")
    void shouldThrowWhenEmailDuplicate() {
        UserCreateRequest request = new UserCreateRequest("Alice", "alice@example.com", UserRole.USER);

        when(userRepository.existsByEmail("alice@example.com")).thenReturn(true);

        assertThatThrownBy(() -> userService.createUser(request))
                .isInstanceOf(DuplicateEmailException.class)
                .hasMessageContaining("alice@example.com");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should get all users")
    void shouldGetAllUsers() {
        when(userRepository.findAll()).thenReturn(List.of(sampleUser));

        List<UserResponse> list = userService.getAllUsers();

        assertThat(list).hasSize(1);
        assertThat(list.get(0).name()).isEqualTo("Alice Wonderland");
    }

    @Test
    @DisplayName("Should get user by ID")
    void shouldGetUserById() {
        when(userRepository.findById("user-123")).thenReturn(Optional.of(sampleUser));

        UserResponse response = userService.getUserById("user-123");

        assertThat(response.id()).isEqualTo("user-123");
        assertThat(response.name()).isEqualTo("Alice Wonderland");
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when user ID not found")
    void shouldThrowWhenUserNotFound() {
        when(userRepository.findById("non-existent")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserById("non-existent"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("non-existent");
    }

    @Test
    @DisplayName("Should update user successfully")
    void shouldUpdateUser() {
        UserUpdateRequest updateRequest = new UserUpdateRequest("Alice Updated", UserRole.ADMIN, UserStatus.SUSPENDED);

        when(userRepository.findById("user-123")).thenReturn(Optional.of(sampleUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse response = userService.updateUser("user-123", updateRequest);

        assertThat(response.name()).isEqualTo("Alice Updated");
        assertThat(response.role()).isEqualTo(UserRole.ADMIN);
        assertThat(response.status()).isEqualTo(UserStatus.SUSPENDED);
    }

    @Test
    @DisplayName("Should delete user when ID exists")
    void shouldDeleteUser() {
        when(userRepository.existsById("user-123")).thenReturn(true);
        doNothing().when(userRepository).deleteById("user-123");

        userService.deleteUser("user-123");

        verify(userRepository, times(1)).deleteById("user-123");
    }
}
