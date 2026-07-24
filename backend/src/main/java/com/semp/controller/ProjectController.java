package com.semp.controller;

import com.semp.dto.MessageResponse;
import com.semp.dto.PageResponseDto;
import com.semp.dto.ProjectRequestDto;
import com.semp.dto.ProjectResponseDto;
import com.semp.model.ProjectPriority;
import com.semp.model.ProjectStatus;
import com.semp.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping({"/admin/projects", "/common/projects", "/employee/projects"})
    public ResponseEntity<PageResponseDto<ProjectResponseDto>> searchProjects(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false) ProjectPriority priority,
            @RequestParam(required = false) Long employeeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        return ResponseEntity.ok(projectService.searchProjects(keyword, status, priority, employeeId, page, size, sortBy, sortDir));
    }

    @GetMapping({"/admin/projects/all", "/common/projects/all"})
    public ResponseEntity<List<ProjectResponseDto>> getAllProjectsList() {
        return ResponseEntity.ok(projectService.getAllProjectsList());
    }

    @GetMapping({"/admin/projects/{id}", "/common/projects/{id}", "/employee/projects/{id}"})
    public ResponseEntity<ProjectResponseDto> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping("/admin/projects")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProjectResponseDto> createProject(@Valid @RequestBody ProjectRequestDto requestDto) {
        return new ResponseEntity<>(projectService.createProject(requestDto), HttpStatus.CREATED);
    }

    @PutMapping("/admin/projects/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProjectResponseDto> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectRequestDto requestDto) {
        return ResponseEntity.ok(projectService.updateProject(id, requestDto));
    }

    @PutMapping("/admin/projects/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProjectResponseDto> assignEmployees(@PathVariable Long id, @RequestBody Set<Long> employeeIds) {
        return ResponseEntity.ok(projectService.assignEmployeesToProject(id, employeeIds));
    }

    @DeleteMapping("/admin/projects/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.deleteProject(id));
    }
}
