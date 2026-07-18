package com.queue.controller;

import com.queue.dto.JoinQueueRequest;
import com.queue.dto.QueueResponse;
import com.queue.entity.ServiceCounter;
import com.queue.service.CounterService;
import com.queue.service.QueueService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/queue")
public class QueueController {

    private final QueueService queueService;
    private final CounterService counterService;

    public QueueController(QueueService queueService, CounterService counterService) {
        this.queueService = queueService;
        this.counterService = counterService;
    }

    @PostMapping("/join")
    public ResponseEntity<QueueResponse> joinQueue(@Valid @RequestBody JoinQueueRequest request, Authentication authentication) {
        QueueResponse response = queueService.joinQueue(authentication.getName(), request.getCounterId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<QueueResponse> getMyQueue(Authentication authentication) {
        QueueResponse response = queueService.getMyQueue(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/cancel/{id}")
    public ResponseEntity<Map<String, String>> cancelQueue(@PathVariable Long id, Authentication authentication) {
        queueService.cancelQueue(id, authentication.getName());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Queue ticket cancelled successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<List<ServiceCounter>> getStatus() {
        // List counters so users know which counters are open/paused/closed
        List<ServiceCounter> counters = counterService.getCounters();
        return ResponseEntity.ok(counters);
    }
}
