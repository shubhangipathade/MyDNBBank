package com.banking.banking_backend.service;
import com.banking.banking_backend.controller.AuthController;
import com.banking.banking_backend.entity.User;
import com.banking.banking_backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthController.LoginResponse login(
            String username,
            String password) {

        // Find user by username
        User user = userRepository
                .findByUsername(username)
                .orElse(null);

        // Username doesn't exist
        if (user == null) {

            return new AuthController.LoginResponse(
                    false,
                    "Invalid username or password",
                    null,
                    null,
                    null
            );
        }

        // Check if user is active
        if (!user.isActive()) {

            return new AuthController.LoginResponse(
                    false,
                    "User account is inactive",
                    null,
                    null,
                    null
            );
        }

        // Check password
        boolean passwordMatches =
                passwordEncoder.matches(
                        password,
                        user.getPassword()
                );

        // Password doesn't match
        if (!passwordMatches) {

            return new AuthController.LoginResponse(
                    false,
                    "Invalid username or password",
                    null,
                    null,
                    null
            );
        }

        // Login successful
        return new AuthController.LoginResponse(
                true,
                "Login successful",
                user.getUserId(),
                user.getUsername(),
                user.getFullName()
        );
    }
}