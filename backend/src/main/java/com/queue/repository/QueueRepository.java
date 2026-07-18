package com.queue.repository;

import com.queue.entity.Queue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface QueueRepository extends JpaRepository<Queue, Long> {

    List<Queue> findByUserIdOrderByJoinedTimeDesc(Long userId);

    @Query("SELECT q FROM Queue q WHERE q.user.id = :userId AND q.status IN ('WAITING', 'CALLED', 'SERVING')")
    Optional<Queue> findActiveQueueByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(MAX(q.tokenNumber), 0) FROM Queue q WHERE q.serviceCounter.id = :counterId AND q.joinedTime >= :startOfDay")
    Integer findMaxTokenNumberToday(@Param("counterId") Long counterId, @Param("startOfDay") LocalDateTime startOfDay);

    @Query("SELECT COUNT(q) FROM Queue q WHERE q.serviceCounter.id = :counterId AND q.status = 'WAITING' AND q.joinedTime < :joinedTime")
    Long countWaitingAhead(@Param("counterId") Long counterId, @Param("joinedTime") LocalDateTime joinedTime);

    List<Queue> findByServiceCounterIdAndStatusOrderByJoinedTimeAsc(Long counterId, String status);

    List<Queue> findByServiceCounterIdAndStatusInOrderByJoinedTimeAsc(Long counterId, List<String> statuses);

    List<Queue> findByJoinedTimeGreaterThanEqualOrderByJoinedTimeDesc(LocalDateTime startOfDay);

    // Reports / Statistics Queries
    @Query("SELECT COUNT(q) FROM Queue q WHERE q.joinedTime >= :startOfDay")
    long countTodayTotal(@Param("startOfDay") LocalDateTime startOfDay);

    @Query("SELECT COUNT(q) FROM Queue q WHERE q.status = :status AND q.joinedTime >= :startOfDay")
    long countTodayByStatus(@Param("status") String status, @Param("startOfDay") LocalDateTime startOfDay);

    // Average waiting time in seconds (Time from joined to called)
    @Query(value = "SELECT COALESCE(AVG(TIMESTAMPDIFF(SECOND, joined_time, called_time)), 0) FROM queues " +
            "WHERE called_time IS NOT NULL AND joined_time >= :startOfDay", nativeQuery = true)
    double getAverageWaitingTimeToday(@Param("startOfDay") LocalDateTime startOfDay);

    // Peak hours analysis: returns hour of day and count of visitors
    @Query(value = "SELECT HOUR(joined_time) as hr, COUNT(*) as cnt FROM queues " +
            "WHERE joined_time >= :startOfDay GROUP BY HOUR(joined_time) ORDER BY hr ASC", nativeQuery = true)
    List<Object[]> getPeakHoursToday(@Param("startOfDay") LocalDateTime startOfDay);
}
