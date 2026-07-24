package com.semp.dto;

import com.semp.model.ProjectPriority;
import com.semp.model.ProjectStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class ProjectResponseDto {
    private Long id;
    private String projectCode;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private ProjectStatus status;
    private ProjectPriority priority;
    private BigDecimal budget;
    private List<EmployeeResponseDto> assignedEmployees;
    private int totalTasks;
    private int completedTasks;
    private double progressPercentage;
}
