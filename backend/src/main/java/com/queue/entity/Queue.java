package com.queue.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "queues")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Queue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "token_number", nullable = false)
    private Integer tokenNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "counter_id", nullable = false)
    private ServiceCounter serviceCounter;

    @Column(nullable = false)
    private String status; // WAITING, CALLED, SERVING, COMPLETED, CANCELLED

    @Column(name = "joined_time", nullable = false)
    private LocalDateTime joinedTime;

    @Column(name = "called_time")
    private LocalDateTime calledTime;

    @Column(name = "completed_time")
    private LocalDateTime completedTime;

    @PrePersist
    protected void onCreate() {
        this.joinedTime = LocalDateTime.now();
    }
}
