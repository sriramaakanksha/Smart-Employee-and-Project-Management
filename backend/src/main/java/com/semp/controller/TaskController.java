package com.semp.controller;

import com.semp.dto.*;
import com.semp.model.TaskPriority;
import com.semp.model.TaskStatus;
import com.semp.security.UserPrincipal;
import com.semp.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping({"/admin/tasks", "/common/tasks", "/employee/tasks"})
    public ResponseEntity<PageResponseDto<TaskResponseDto>> searchTasks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long assignedEmployeeId,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        return ResponseEntity.ok(taskService.searchTasks(keyword, projectId, assignedEmployeeId, departmentId, status, priority, page, size, sortBy, sortDir));
    }

    @GetMapping({"/admin/tasks/all", "/common/tasks/all"})
    public ResponseEntity<List<TaskResponseDto>> getAllTasksList() {
        return ResponseEntity.ok(taskService.getAllTasksList());
    }

    @GetMapping({"/admin/tasks/{id}", "/common/tasks/{id}", "/employee/tasks/{id}"})
    public ResponseEntity<TaskResponseDto> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PostMapping("/admin/tasks")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TaskResponseDto> createTask(@Valid @RequestBody TaskRequestDto requestDto) {
        return new ResponseEntity<>(taskService.createTask(requestDto), HttpStatus.CREATED);
    }

    @PutMapping("/admin/tasks/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TaskResponseDto> updateTask(@PathVariable Long id, @Valid @RequestBody TaskRequestDto requestDto) {
        return ResponseEntity.ok(taskService.updateTask(id, requestDto));
    }

    @PatchMapping({"/admin/tasks/{id}/status", "/employee/tasks/{id}/status"})
    public ResponseEntity<TaskResponseDto> updateTaskStatus(
            @PathVariable Long id,
            @Valid @RequestBody TaskStatusUpdateDto updateDto,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        Long userId = currentUser != null ? currentUser.getId() : 1L;
        return ResponseEntity.ok(taskService.updateTaskStatusAndProgress(id, updateDto, userId));
    }

    @PostMapping({"/admin/tasks/{id}/remarks", "/employee/tasks/{id}/remarks"})
    public ResponseEntity<RemarkResponseDto> addRemarkToTask(
            @PathVariable Long id,
            @Valid @RequestBody RemarkRequestDto remarkDto,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        Long userId = currentUser != null ? currentUser.getId() : 1L;
        return ResponseEntity.ok(taskService.addRemarkToTask(id, remarkDto, userId));
    }

    @DeleteMapping("/admin/tasks/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.deleteTask(id));
    }
}
