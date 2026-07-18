package com.queue.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "queue_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueueHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "queue_id", nullable = false)
    private Queue queue;

    @Column(nullable = false)
    private String action; // JOINED, CALLED, SKIPPED, COMPLETED, CANCELLED

    @Column(nullable = false)
    private LocalDateTime time;

    @Column(name = "performed_by")
    private String performedBy;

    @PrePersist
    protected void onCreate() {
        this.time = LocalDateTime.now();
    }
}
