package com.semp.dto;

import com.semp.model.TaskPriority;
import com.semp.model.TaskStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TaskResponseDto {
    private Long id;
    private String taskCode;
    private String title;
    private String description;
    private Long projectId;
    private String projectName;
    private String projectCode;
    private Long assignedEmployeeId;
    private String assignedEmployeeName;
    private String assignedEmployeeCode;
    private String departmentName;
    private TaskStatus status;
    private TaskPriority priority;
    private Integer progressPercentage;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private List<RemarkResponseDto> remarks;
}
