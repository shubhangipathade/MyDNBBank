package com.banking.banking_backend.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    @GetMapping
    public List<Map<String, String>> getNotifications() {

        return List.of(
                Map.of(
                        "title",
                        "Welcome to MyBank",
                        "message",
                        "Your account is ready."
                ),
                Map.of(
                        "title",
                        "Security Alert",
                        "message",
                        "Your banking session is secure."
                )
        );
    }
}