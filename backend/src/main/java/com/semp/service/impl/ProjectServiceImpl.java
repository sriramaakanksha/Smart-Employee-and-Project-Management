package com.semp.service.impl;

import com.semp.dto.EmployeeResponseDto;
import com.semp.dto.MessageResponse;
import com.semp.dto.PageResponseDto;
import com.semp.dto.ProjectRequestDto;
import com.semp.dto.ProjectResponseDto;
import com.semp.exception.BadRequestException;
import com.semp.exception.ResourceNotFoundException;
import com.semp.model.*;
import com.semp.repository.EmployeeRepository;
import com.semp.repository.ProjectRepository;
import com.semp.repository.TaskRepository;
import com.semp.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Override
    public PageResponseDto<ProjectResponseDto> searchProjects(
            String keyword, ProjectStatus status, ProjectPriority priority, Long employeeId,
            int page, int size, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Project> projectPage = projectRepository.searchProjects(keyword, status, priority, employeeId, pageable);

        List<ProjectResponseDto> content = projectPage.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return PageResponseDto.<ProjectResponseDto>builder()
                .content(content)
                .pageNo(projectPage.getNumber())
                .pageSize(projectPage.getSize())
                .totalElements(projectPage.getTotalElements())
                .totalPages(projectPage.getTotalPages())
                .last(projectPage.isLast())
                .build();
    }

    @Override
    public List<ProjectResponseDto> getAllProjectsList() {
        return projectRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectResponseDto getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        return mapToDto(project);
    }

    @Override
    @Transactional
    public ProjectResponseDto createProject(ProjectRequestDto requestDto) {
        if (projectRepository.existsByProjectCode(requestDto.getProjectCode())) {
            throw new BadRequestException("Project code '" + requestDto.getProjectCode() + "' already exists");
        }

        Set<Employee> assignedEmployees = new HashSet<>();
        if (requestDto.getAssignedEmployeeIds() != null && !requestDto.getAssignedEmployeeIds().isEmpty()) {
            assignedEmployees = new HashSet<>(employeeRepository.findAllById(requestDto.getAssignedEmployeeIds()));
        }

        Project project = Project.builder()
                .projectCode(requestDto.getProjectCode())
                .name(requestDto.getName())
                .description(requestDto.getDescription())
                .startDate(requestDto.getStartDate())
                .endDate(requestDto.getEndDate())
                .status(requestDto.getStatus() != null ? requestDto.getStatus() : ProjectStatus.NOT_STARTED)
                .priority(requestDto.getPriority() != null ? requestDto.getPriority() : ProjectPriority.MEDIUM)
                .budget(requestDto.getBudget())
                .assignedEmployees(assignedEmployees)
                .build();

        Project saved = projectRepository.save(project);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public ProjectResponseDto updateProject(Long id, ProjectRequestDto requestDto) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        project.setName(requestDto.getName());
        project.setDescription(requestDto.getDescription());
        project.setStartDate(requestDto.getStartDate());
        project.setEndDate(requestDto.getEndDate());
        project.setStatus(requestDto.getStatus());
        project.setPriority(requestDto.getPriority());
        project.setBudget(requestDto.getBudget());

        if (requestDto.getAssignedEmployeeIds() != null) {
            Set<Employee> assignedEmployees = new HashSet<>(employeeRepository.findAllById(requestDto.getAssignedEmployeeIds()));
            project.setAssignedEmployees(assignedEmployees);
        }

        Project updated = projectRepository.save(project);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public ProjectResponseDto assignEmployeesToProject(Long projectId, Set<Long> employeeIds) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        Set<Employee> employees = new HashSet<>(employeeRepository.findAllById(employeeIds));
        project.setAssignedEmployees(employees);

        Project updated = projectRepository.save(project);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public MessageResponse deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        projectRepository.delete(project);
        return new MessageResponse("Project deleted successfully");
    }

    @Override
    public List<ProjectResponseDto> getProjectsByEmployee(Long employeeId) {
        return projectRepository.findByAssignedEmployeesId(employeeId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ProjectResponseDto mapToDto(Project project) {
        List<EmployeeResponseDto> assignedEmployees = project.getAssignedEmployees().stream()
                .map(emp -> EmployeeResponseDto.builder()
                        .id(emp.getId())
                        .employeeCode(emp.getEmployeeCode())
                        .firstName(emp.getFirstName())
                        .lastName(emp.getLastName())
                        .fullName(emp.getFirstName() + " " + emp.getLastName())
                        .email(emp.getEmail())
                        .designation(emp.getDesignation())
                        .departmentName(emp.getDepartment() != null ? emp.getDepartment().getName() : null)
                        .build())
                .collect(Collectors.toList());

        List<Task> tasks = taskRepository.findByProjectId(project.getId());
        int totalTasks = tasks.size();
        int completedTasks = (int) tasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();
        double progressPercentage = totalTasks > 0 ? (double) completedTasks * 100.0 / totalTasks : 0.0;

        return ProjectResponseDto.builder()
                .id(project.getId())
                .projectCode(project.getProjectCode())
                .name(project.getName())
                .description(project.getDescription())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .status(project.getStatus())
                .priority(project.getPriority())
                .budget(project.getBudget())
                .assignedEmployees(assignedEmployees)
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .progressPercentage(Math.round(progressPercentage * 10.0) / 10.0)
                .build();
    }
}
