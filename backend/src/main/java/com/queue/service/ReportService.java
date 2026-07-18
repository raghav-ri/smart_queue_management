package com.queue.service;

import com.queue.dto.ReportDto;
import com.queue.repository.QueueRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReportService {

    private final QueueRepository queueRepository;

    public ReportService(QueueRepository queueRepository) {
        this.queueRepository = queueRepository;
    }

    public ReportDto getDailyReport() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();

        long totalCustomers = queueRepository.countTodayTotal(startOfDay);
        long completed = queueRepository.countTodayByStatus("COMPLETED", startOfDay);
        long cancelled = queueRepository.countTodayByStatus("CANCELLED", startOfDay);
        double averageWaitTimeSeconds = queueRepository.getAverageWaitingTimeToday(startOfDay);
        double averageWaitTimeMinutes = Math.round((averageWaitTimeSeconds / 60.0) * 10.0) / 10.0; // round to 1 decimal

        List<Object[]> rawPeakHours = queueRepository.getPeakHoursToday(startOfDay);
        List<ReportDto.PeakHourDto> peakHours = new ArrayList<>();
        for (Object[] row : rawPeakHours) {
            if (row[0] != null) {
                int hour = ((Number) row[0]).intValue();
                long count = ((Number) row[1]).longValue();
                peakHours.add(new ReportDto.PeakHourDto(hour, count));
            }
        }

        return ReportDto.builder()
                .totalCustomers(totalCustomers)
                .completed(completed)
                .cancelled(cancelled)
                .averageWaitTimeMinutes(averageWaitTimeMinutes)
                .peakHours(peakHours)
                .build();
    }
}
