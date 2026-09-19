package com.banking.banking_backend.controller;

import com.banking.banking_backend.entity.User;
import com.banking.banking_backend.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public User createUser(
            @RequestBody CreateUserRequest request) {

        return userService.createUser(
                request.username,
                request.password,
                request.fullName,
                request.email
        );
    }

    public static class CreateUserRequest {

        public String username;
        public String password;
        public String fullName;
        public String email;
    }
}