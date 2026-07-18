package com.queue.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class JoinQueueRequest {
    @NotNull(message = "Counter ID is required")
    private Long counterId;
}
