package com.semp.service;

import com.semp.dto.*;
import com.semp.model.TaskPriority;
import com.semp.model.TaskStatus;

import java.util.List;

public interface TaskService {
    PageResponseDto<TaskResponseDto> searchTasks(
            String keyword, Long projectId, Long assignedEmployeeId, Long departmentId,
            TaskStatus status, TaskPriority priority, int page, int size, String sortBy, String sortDir);

    List<TaskResponseDto> getAllTasksList();
    TaskResponseDto getTaskById(Long id);
    TaskResponseDto createTask(TaskRequestDto requestDto);
    TaskResponseDto updateTask(Long id, TaskRequestDto requestDto);
    TaskResponseDto updateTaskStatusAndProgress(Long id, TaskStatusUpdateDto updateDto, Long currentUserId);
    RemarkResponseDto addRemarkToTask(Long taskId, RemarkRequestDto remarkDto, Long currentUserId);
    MessageResponse deleteTask(Long id);
    List<TaskResponseDto> getTasksByEmployee(Long employeeId);
    List<TaskResponseDto> getTasksByProject(Long projectId);
}
