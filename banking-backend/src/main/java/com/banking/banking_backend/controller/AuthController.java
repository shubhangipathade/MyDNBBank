package com.banking.banking_backend.controller;
import com.banking.banking_backend.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(
                request.username,
                request.password
        );
    }

    // ==============================
    // Login Request
    // ==============================

    public static class LoginRequest {

        public String username;
        public String password;
    }

    // ==============================
    // Login Response
    // ==============================

    public static class LoginResponse {

        public boolean success;
        public String message;
        public Long userId;
        public String username;
        public String fullName;

        public LoginResponse(
                boolean success,
                String message,
                Long userId,
                String username,
                String fullName) {

            this.success = success;
            this.message = message;
            this.userId = userId;
            this.username = username;
            this.fullName = fullName;
        }
    }
}