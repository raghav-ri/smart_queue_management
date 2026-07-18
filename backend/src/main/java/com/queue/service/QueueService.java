package com.queue.service;

import com.queue.dto.QueueResponse;
import com.queue.entity.*;
import com.queue.exception.BadRequestException;
import com.queue.exception.ResourceNotFoundException;
import com.queue.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QueueService {

    private final QueueRepository queueRepository;
    private final QueueHistoryRepository queueHistoryRepository;
    private final UserRepository userRepository;
    private final CounterRepository counterRepository;

    public QueueService(QueueRepository queueRepository,
                        QueueHistoryRepository queueHistoryRepository,
                        UserRepository userRepository,
                        CounterRepository counterRepository) {
        this.queueRepository = queueRepository;
        this.queueHistoryRepository = queueHistoryRepository;
        this.userRepository = userRepository;
        this.counterRepository = counterRepository;
    }

    @Transactional
    public QueueResponse joinQueue(String email, Long counterId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if user already has an active queue ticket
        Optional<Queue> activeQueue = queueRepository.findActiveQueueByUserId(user.getId());
        if (activeQueue.isPresent()) {
            throw new BadRequestException("You already have an active queue ticket (Token " 
                    + activeQueue.get().getTokenNumber() + ")");
        }

        ServiceCounter counter = counterRepository.findById(counterId)
                .orElseThrow(() -> new ResourceNotFoundException("Service counter not found"));

        if (!"ACTIVE".equals(counter.getStatus())) {
            throw new BadRequestException("This service counter is currently closed or paused.");
        }

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        Integer maxToken = queueRepository.findMaxTokenNumberToday(counterId, startOfDay);
        int nextToken = maxToken + 1;

        Queue queue = Queue.builder()
                .tokenNumber(nextToken)
                .user(user)
                .serviceCounter(counter)
                .status("WAITING")
                .build();

        queue = queueRepository.save(queue);

        // Record history
        QueueHistory history = QueueHistory.builder()
                .queue(queue)
                .action("JOINED")
                .performedBy(user.getName())
                .build();
        queueHistoryRepository.save(history);

        return mapToResponse(queue);
    }

    @Transactional
    public void cancelQueue(Long id, String email) {
        Queue queue = queueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Queue ticket not found"));

        // Check user ownership or role (admins can cancel too, but they use complete/skip)
        if (!queue.getUser().getEmail().equalsIgnoreCase(email)) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            if (!"ROLE_ADMIN".equals(user.getRole())) {
                throw new BadRequestException("You do not own this queue ticket");
            }
        }

        if (!Arrays.asList("WAITING", "CALLED", "SERVING").contains(queue.getStatus())) {
            throw new BadRequestException("Queue ticket is already " + queue.getStatus());
        }

        queue.setStatus("CANCELLED");
        queue.setCompletedTime(LocalDateTime.now());
        queueRepository.save(queue);

        QueueHistory history = QueueHistory.builder()
                .queue(queue)
                .action("CANCELLED")
                .performedBy(queue.getUser().getName())
                .build();
        queueHistoryRepository.save(history);
    }

    public QueueResponse getMyQueue(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return queueRepository.findActiveQueueByUserId(user.getId())
                .map(this::mapToResponse)
                .orElse(null);
    }

    public List<QueueResponse> getMyHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return queueRepository.findByUserIdOrderByJoinedTimeDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<QueueResponse> getAdminQueues(Long counterId, String status) {
        List<Queue> queues;
        if (counterId != null) {
            if (status != null && !status.isEmpty()) {
                queues = queueRepository.findByServiceCounterIdAndStatusOrderByJoinedTimeAsc(counterId, status.toUpperCase());
            } else {
                queues = queueRepository.findByServiceCounterIdAndStatusInOrderByJoinedTimeAsc(
                        counterId, Arrays.asList("WAITING", "CALLED", "SERVING"));
            }
        } else {
            LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
            queues = queueRepository.findByJoinedTimeGreaterThanEqualOrderByJoinedTimeDesc(startOfDay);
        }

        return queues.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public QueueResponse callNext(Long counterId, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        // Complete any current active tickets at this counter first
        List<Queue> activeTickets = queueRepository.findByServiceCounterIdAndStatusInOrderByJoinedTimeAsc(
                counterId, Arrays.asList("CALLED", "SERVING"));
        for (Queue active : activeTickets) {
            active.setStatus("COMPLETED");
            active.setCompletedTime(LocalDateTime.now());
            queueRepository.save(active);

            QueueHistory hist = QueueHistory.builder()
                    .queue(active)
                    .action("COMPLETED")
                    .performedBy("SYSTEM (Auto-call)")
                    .build();
            queueHistoryRepository.save(hist);
        }

        // Fetch next waiting customer
        List<Queue> waitingList = queueRepository.findByServiceCounterIdAndStatusOrderByJoinedTimeAsc(counterId, "WAITING");
        if (waitingList.isEmpty()) {
            throw new BadRequestException("No customers waiting in queue for this counter");
        }

        Queue nextQueue = waitingList.get(0);
        nextQueue.setStatus("CALLED");
        nextQueue.setCalledTime(LocalDateTime.now());
        nextQueue = queueRepository.save(nextQueue);

        QueueHistory history = QueueHistory.builder()
                .queue(nextQueue)
                .action("CALLED")
                .performedBy(admin.getName())
                .build();
        queueHistoryRepository.save(history);

        return mapToResponse(nextQueue);
    }

    @Transactional
    public void skipCustomer(Long queueId, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        Queue queue = queueRepository.findById(queueId)
                .orElseThrow(() -> new ResourceNotFoundException("Queue ticket not found"));

        if (!Arrays.asList("WAITING", "CALLED", "SERVING").contains(queue.getStatus())) {
            throw new BadRequestException("Cannot skip ticket with status " + queue.getStatus());
        }

        queue.setStatus("CANCELLED");
        queue.setCompletedTime(LocalDateTime.now());
        queueRepository.save(queue);

        QueueHistory history = QueueHistory.builder()
                .queue(queue)
                .action("SKIPPED")
                .performedBy(admin.getName())
                .build();
        queueHistoryRepository.save(history);
    }

    @Transactional
    public void completeCustomer(Long queueId, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        Queue queue = queueRepository.findById(queueId)
                .orElseThrow(() -> new ResourceNotFoundException("Queue ticket not found"));

        if (!Arrays.asList("CALLED", "SERVING").contains(queue.getStatus())) {
            throw new BadRequestException("Only called or serving customers can be marked completed");
        }

        queue.setStatus("COMPLETED");
        queue.setCompletedTime(LocalDateTime.now());
        queueRepository.save(queue);

        QueueHistory history = QueueHistory.builder()
                .queue(queue)
                .action("COMPLETED")
                .performedBy(admin.getName())
                .build();
        queueHistoryRepository.save(history);
    }

    @Transactional
    public QueueResponse updateQueueStatus(Long queueId, String status, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        Queue queue = queueRepository.findById(queueId)
                .orElseThrow(() -> new ResourceNotFoundException("Queue ticket not found"));

        String upperStatus = status.toUpperCase();
        if (!Arrays.asList("WAITING", "CALLED", "SERVING", "COMPLETED", "CANCELLED").contains(upperStatus)) {
            throw new BadRequestException("Invalid status: " + status);
        }

        queue.setStatus(upperStatus);
        if (upperStatus.equals("CALLED")) {
            queue.setCalledTime(LocalDateTime.now());
        } else if (upperStatus.equals("COMPLETED") || upperStatus.equals("CANCELLED")) {
            queue.setCompletedTime(LocalDateTime.now());
        }

        queue = queueRepository.save(queue);

        QueueHistory history = QueueHistory.builder()
                .queue(queue)
                .action(upperStatus)
                .performedBy(admin.getName())
                .build();
        queueHistoryRepository.save(history);

        return mapToResponse(queue);
    }

    public QueueResponse mapToResponse(Queue queue) {
        if (queue == null) return null;

        Long position = -1L;
        Long estWaitTime = 0L;

        if ("WAITING".equals(queue.getStatus())) {
            position = queueRepository.countWaitingAhead(queue.getServiceCounter().getId(), queue.getJoinedTime());
            long avgServiceTimeMinutes = getAverageServiceTimeMinutes(queue.getServiceCounter().getId());
            estWaitTime = (position + 1) * avgServiceTimeMinutes;
        } else if (Arrays.asList("CALLED", "SERVING").contains(queue.getStatus())) {
            position = 0L;
            estWaitTime = 0L; // They are being served or called
        }

        return QueueResponse.builder()
                .id(queue.getId())
                .tokenNumber(queue.getTokenNumber())
                .userId(queue.getUser().getId())
                .username(queue.getUser().getName())
                .userEmail(queue.getUser().getEmail())
                .counterId(queue.getServiceCounter().getId())
                .counterName(queue.getServiceCounter().getName())
                .counterDepartment(queue.getServiceCounter().getDepartment())
                .status(queue.getStatus())
                .joinedTime(queue.getJoinedTime())
                .calledTime(queue.getCalledTime())
                .completedTime(queue.getCompletedTime())
                .position(position)
                .estimatedWaitTime(estWaitTime)
                .build();
    }

    private long getAverageServiceTimeMinutes(Long counterId) {
        // Query completed tickets for this counter today
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        List<Queue> completedToday = queueRepository.findByServiceCounterIdAndStatusOrderByJoinedTimeAsc(counterId, "COMPLETED")
                .stream()
                .filter(q -> q.getCompletedTime() != null && q.getCalledTime() != null && q.getJoinedTime().isAfter(startOfDay))
                .toList();

        if (completedToday.isEmpty()) {
            return 5L; // Default to 5 minutes
        }

        double totalMinutes = 0;
        for (Queue q : completedToday) {
            Duration duration = Duration.between(q.getCalledTime(), q.getCompletedTime());
            totalMinutes += duration.toMinutes();
        }

        double avg = totalMinutes / completedToday.size();
        return Math.max(1L, Math.round(avg));
    }
}
