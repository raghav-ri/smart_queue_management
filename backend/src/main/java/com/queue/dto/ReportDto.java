package com.queue.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportDto {
    private long totalCustomers;
    private long completed;
    private long cancelled;
    private double averageWaitTimeMinutes;
    private List<PeakHourDto> peakHours;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PeakHourDto {
        private int hour;
        private long count;
    }
}
