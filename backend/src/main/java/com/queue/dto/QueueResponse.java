package com.queue.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueueResponse {
    private Long id;
    private Integer tokenNumber;
    private Long userId;
    private String username;
    private String userEmail;
    private Long counterId;
    private String counterName;
    private String counterDepartment;
    private String status;
    private LocalDateTime joinedTime;
    private LocalDateTime calledTime;
    private LocalDateTime completedTime;
    
    // Dynamic fields
    private Long position;
    private Long estimatedWaitTime; // in minutes
}
