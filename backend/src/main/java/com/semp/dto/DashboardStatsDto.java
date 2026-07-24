package com.semp.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardStatsDto {
    // General metrics
    private long totalEmployees;
    private long totalProjects;
    private long totalTasks;
    private long pendingTasks;
    private long completedTasks;
    private long inProgressTasks;
    private long overdueTasks;

    // Admin metrics
    private long activeProjects;
    private long completedProjects;
    private Map<String, Long> tasksByStatus;
    private Map<String, Long> tasksByPriority;
    private Map<String, Long> employeesByDepartment;

    // Employee specific metrics
    private List<TaskResponseDto> myAssignedTasks;
    private List<TaskResponseDto> myUpcomingDeadlines;
    private List<ProjectResponseDto> myAssignedProjects;
}
