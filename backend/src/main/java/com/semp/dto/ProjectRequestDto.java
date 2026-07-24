package com.semp.dto;

import com.semp.model.ProjectPriority;
import com.semp.model.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Data
public class ProjectRequestDto {

    @NotBlank(message = "Project code is required")
    private String projectCode;

    @NotBlank(message = "Project name is required")
    private String name;

    private String description;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;

    private ProjectStatus status = ProjectStatus.NOT_STARTED;
    private ProjectPriority priority = ProjectPriority.MEDIUM;

    private BigDecimal budget;

    private Set<Long> assignedEmployeeIds;
}
