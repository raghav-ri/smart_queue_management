package com.queue.service;

import com.queue.dto.CounterRequest;
import com.queue.entity.ServiceCounter;
import com.queue.exception.ResourceNotFoundException;
import com.queue.repository.CounterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CounterService {

    private final CounterRepository counterRepository;

    public CounterService(CounterRepository counterRepository) {
        this.counterRepository = counterRepository;
    }

    @Transactional
    public ServiceCounter createCounter(CounterRequest request) {
        ServiceCounter counter = ServiceCounter.builder()
                .name(request.getName())
                .department(request.getDepartment())
                .status("INACTIVE") // Default status is Closed/Inactive
                .build();
        return counterRepository.save(counter);
    }

    public List<ServiceCounter> getCounters() {
        return counterRepository.findAll();
    }

    public ServiceCounter getCounterById(Long id) {
        return counterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service counter not found"));
    }

    @Transactional
    public ServiceCounter updateCounterStatus(Long id, String status) {
        ServiceCounter counter = getCounterById(id);
        String upperStatus = status.toUpperCase();
        if (upperStatus.equals("ACTIVE") || upperStatus.equals("INACTIVE") || upperStatus.equals("PAUSED")) {
            counter.setStatus(upperStatus);
            return counterRepository.save(counter);
        } else {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
    }
}
