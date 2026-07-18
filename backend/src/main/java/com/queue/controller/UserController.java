package com.queue.controller;

import com.queue.dto.ChangePasswordRequest;
import com.queue.dto.QueueResponse;
import com.queue.dto.UserProfileDto;
import com.queue.service.QueueService;
import com.queue.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final QueueService queueService;

    public UserController(UserService userService, QueueService queueService) {
        this.userService = userService;
        this.queueService = queueService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getProfile(Authentication authentication) {
        UserProfileDto profile = userService.getProfile(authentication.getName());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateProfile(@Valid @RequestBody UserProfileDto dto, Authentication authentication) {
        UserProfileDto updatedProfile = userService.updateProfile(authentication.getName(), dto);
        return ResponseEntity.ok(updatedProfile);
    }

    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordRequest request, Authentication authentication) {
        userService.changePassword(authentication.getName(), request);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password changed successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<QueueResponse>> getHistory(Authentication authentication) {
        List<QueueResponse> history = queueService.getMyHistory(authentication.getName());
        return ResponseEntity.ok(history);
    }
}
