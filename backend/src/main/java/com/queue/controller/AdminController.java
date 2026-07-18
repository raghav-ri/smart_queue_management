package com.queue.controller;

import com.queue.dto.CounterRequest;
import com.queue.dto.QueueResponse;
import com.queue.dto.ReportDto;
import com.queue.entity.ServiceCounter;
import com.queue.service.CounterService;
import com.queue.service.QueueService;
import com.queue.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final CounterService counterService;
    private final QueueService queueService;
    private final ReportService reportService;

    public AdminController(CounterService counterService,
                           QueueService queueService,
                           ReportService reportService) {
        this.counterService = counterService;
        this.queueService = queueService;
        this.reportService = reportService;
    }

    // Counter Endpoints
    @PostMapping("/counter")
    public ResponseEntity<ServiceCounter> createCounter(@Valid @RequestBody CounterRequest request) {
        ServiceCounter counter = counterService.createCounter(request);
        return new ResponseEntity<>(counter, HttpStatus.CREATED);
    }

    @GetMapping("/counters")
    public ResponseEntity<List<ServiceCounter>> getCounters() {
        List<ServiceCounter> counters = counterService.getCounters();
        return ResponseEntity.ok(counters);
    }

    @PutMapping("/counter/{id}/status")
    public ResponseEntity<ServiceCounter> updateCounterStatus(@PathVariable Long id, @RequestParam String status) {
        ServiceCounter counter = counterService.updateCounterStatus(id, status);
        return ResponseEntity.ok(counter);
    }

    // Queue Admin Operations
    @GetMapping("/queues")
    public ResponseEntity<List<QueueResponse>> getQueues(
            @RequestParam(required = false) Long counterId,
            @RequestParam(required = false) String status) {
        List<QueueResponse> queues = queueService.getAdminQueues(counterId, status);
        return ResponseEntity.ok(queues);
    }

    @PutMapping("/call-next")
    public ResponseEntity<QueueResponse> callNext(@RequestParam Long counterId, Authentication authentication) {
        QueueResponse response = queueService.callNext(counterId, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/skip")
    public ResponseEntity<Map<String, String>> skipCustomer(@RequestParam Long queueId, Authentication authentication) {
        queueService.skipCustomer(queueId, authentication.getName());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Customer skipped and queue ticket cancelled");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/complete")
    public ResponseEntity<Map<String, String>> completeCustomer(@RequestParam Long queueId, Authentication authentication) {
        queueService.completeCustomer(queueId, authentication.getName());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Customer service marked completed");
        return ResponseEntity.ok(response);
    }

    // Reports Endpoint
    @GetMapping("/report")
    public ResponseEntity<ReportDto> getReport() {
        ReportDto report = reportService.getDailyReport();
        return ResponseEntity.ok(report);
    }
}
