package com.queue.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CounterRequest {

    @NotBlank(message = "Counter name is required")
    private String name;

    @NotBlank(message = "Department is required")
    private String department;
}
