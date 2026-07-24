package com.semp.service;

import com.semp.dto.MessageResponse;
import com.semp.dto.PageResponseDto;
import com.semp.dto.ProjectRequestDto;
import com.semp.dto.ProjectResponseDto;
import com.semp.model.ProjectPriority;
import com.semp.model.ProjectStatus;

import java.util.List;
import java.util.Set;

public interface ProjectService {
    PageResponseDto<ProjectResponseDto> searchProjects(String keyword, ProjectStatus status, ProjectPriority priority, Long employeeId, int page, int size, String sortBy, String sortDir);
    List<ProjectResponseDto> getAllProjectsList();
    ProjectResponseDto getProjectById(Long id);
    ProjectResponseDto createProject(ProjectRequestDto requestDto);
    ProjectResponseDto updateProject(Long id, ProjectRequestDto requestDto);
    ProjectResponseDto assignEmployeesToProject(Long projectId, Set<Long> employeeIds);
    MessageResponse deleteProject(Long id);
    List<ProjectResponseDto> getProjectsByEmployee(Long employeeId);
}
