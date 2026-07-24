package com.semp.dto;

import com.semp.model.TaskStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TaskStatusUpdateDto {

    @NotNull(message = "Status is required")
    private TaskStatus status;

    @Min(value = 0, message = "Progress cannot be less than 0")
    @Max(value = 100, message = "Progress cannot be greater than 100")
    private Integer progressPercentage;

    private String remarkContent;
}
