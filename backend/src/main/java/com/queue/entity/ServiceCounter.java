package com.queue.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "service_counters")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceCounter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String status; // ACTIVE, INACTIVE, PAUSED
}
