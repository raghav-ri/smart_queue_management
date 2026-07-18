package com.queue.repository;

import com.queue.entity.QueueHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QueueHistoryRepository extends JpaRepository<QueueHistory, Long> {
    List<QueueHistory> findByQueueIdOrderByTimeAsc(Long queueId);
}
