package com.banking.banking_backend.service;

import com.banking.banking_backend.entity.User;
import com.banking.banking_backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(
            String username,
            String password,
            String fullName,
            String email) {

        // Check if username already exists
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException(
                    "Username already exists"
            );
        }

        // Create new user
        User user = new User();

        user.setUsername(username);

        // IMPORTANT:
        // Never store plain password
        user.setPassword(
                passwordEncoder.encode(password)
        );

        user.setFullName(fullName);
        user.setEmail(email);
        user.setActive(true);

        return userRepository.save(user);
    }
}