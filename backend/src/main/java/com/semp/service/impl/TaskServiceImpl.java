package com.semp.service.impl;

import com.semp.dto.*;
import com.semp.exception.BadRequestException;
import com.semp.exception.ResourceNotFoundException;
import com.semp.model.*;
import com.semp.repository.*;
import com.semp.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RemarkRepository remarkRepository;


    @Override
    public PageResponseDto<TaskResponseDto> searchTasks(
            String keyword, Long projectId, Long assignedEmployeeId, Long departmentId,
            TaskStatus status, TaskPriority priority, int page, int size, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Task> taskPage = taskRepository.searchTasks(keyword, projectId, assignedEmployeeId, departmentId, status, priority, pageable);

        List<TaskResponseDto> content = taskPage.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return PageResponseDto.<TaskResponseDto>builder()
                .content(content)
                .pageNo(taskPage.getNumber())
                .pageSize(taskPage.getSize())
                .totalElements(taskPage.getTotalElements())
                .totalPages(taskPage.getTotalPages())
                .last(taskPage.isLast())
                .build();
    }

    @Override
    public List<TaskResponseDto> getAllTasksList() {
        return taskRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public TaskResponseDto getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        return mapToDto(task);
    }

    @Override
    @Transactional
    public TaskResponseDto createTask(TaskRequestDto requestDto) {
        if (taskRepository.findByTaskCode(requestDto.getTaskCode()).isPresent()) {
            throw new BadRequestException("Task code '" + requestDto.getTaskCode() + "' already exists");
        }

        Project project = projectRepository.findById(requestDto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", requestDto.getProjectId()));

        Employee assignedEmployee = null;
        if (requestDto.getAssignedEmployeeId() != null) {
            assignedEmployee = employeeRepository.findById(requestDto.getAssignedEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", requestDto.getAssignedEmployeeId()));
        }

        Task task = Task.builder()
                .taskCode(requestDto.getTaskCode())
                .title(requestDto.getTitle())
                .description(requestDto.getDescription())
                .project(project)
                .assignedEmployee(assignedEmployee)
                .status(requestDto.getStatus() != null ? requestDto.getStatus() : TaskStatus.TODO)
                .priority(requestDto.getPriority() != null ? requestDto.getPriority() : TaskPriority.MEDIUM)
                .progressPercentage(requestDto.getProgressPercentage() != null ? requestDto.getProgressPercentage() : 0)
                .dueDate(requestDto.getDueDate())
                .build();

        Task saved = taskRepository.save(task);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public TaskResponseDto updateTask(Long id, TaskRequestDto requestDto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        Project project = projectRepository.findById(requestDto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", requestDto.getProjectId()));

        Employee assignedEmployee = null;
        if (requestDto.getAssignedEmployeeId() != null) {
            assignedEmployee = employeeRepository.findById(requestDto.getAssignedEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", requestDto.getAssignedEmployeeId()));
        }

        task.setTitle(requestDto.getTitle());
        task.setDescription(requestDto.getDescription());
        task.setProject(project);
        task.setAssignedEmployee(assignedEmployee);
        task.setStatus(requestDto.getStatus());
        task.setPriority(requestDto.getPriority());
        if (requestDto.getProgressPercentage() != null) {
            task.setProgressPercentage(requestDto.getProgressPercentage());
        }
        task.setDueDate(requestDto.getDueDate());

        Task updated = taskRepository.save(task);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public TaskResponseDto updateTaskStatusAndProgress(Long id, TaskStatusUpdateDto updateDto, Long currentUserId) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        task.setStatus(updateDto.getStatus());
        if (updateDto.getProgressPercentage() != null) {
            task.setProgressPercentage(updateDto.getProgressPercentage());
        } else if (updateDto.getStatus() == TaskStatus.DONE) {
            task.setProgressPercentage(100);
        }

        if (updateDto.getRemarkContent() != null && !updateDto.getRemarkContent().trim().isEmpty()) {
            User user = userRepository.findById(currentUserId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

            Remark remark = Remark.builder()
                    .task(task)
                    .user(user)
                    .content(updateDto.getRemarkContent())
                    .build();
            remarkRepository.save(remark);
        }

        Task updated = taskRepository.save(task);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public RemarkResponseDto addRemarkToTask(Long taskId, RemarkRequestDto remarkDto, Long currentUserId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        Remark remark = Remark.builder()
                .task(task)
                .user(user)
                .content(remarkDto.getContent())
                .build();

        Remark saved = remarkRepository.save(remark);

        return RemarkResponseDto.builder()
                .id(saved.getId())
                .taskId(task.getId())
                .userId(user.getId())
                .authorName(user.getUsername())
                .authorRole(user.getRole().name())
                .content(saved.getContent())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    @Transactional
    public MessageResponse deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        taskRepository.delete(task);
        return new MessageResponse("Task deleted successfully");
    }

    @Override
    public List<TaskResponseDto> getTasksByEmployee(Long employeeId) {
        return taskRepository.findByAssignedEmployeeId(employeeId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponseDto> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private TaskResponseDto mapToDto(Task task) {
        List<RemarkResponseDto> remarks = remarkRepository.findByTaskIdOrderByCreatedAtDesc(task.getId())
                .stream()
                .map(r -> RemarkResponseDto.builder()
                        .id(r.getId())
                        .taskId(task.getId())
                        .userId(r.getUser().getId())
                        .authorName(r.getUser().getUsername())
                        .authorRole(r.getUser().getRole().name())
                        .content(r.getContent())
                        .createdAt(r.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return TaskResponseDto.builder()
                .id(task.getId())
                .taskCode(task.getTaskCode())
                .title(task.getTitle())
                .description(task.getDescription())
                .projectId(task.getProject() != null ? task.getProject().getId() : null)
                .projectName(task.getProject() != null ? task.getProject().getName() : null)
                .projectCode(task.getProject() != null ? task.getProject().getProjectCode() : null)
                .assignedEmployeeId(task.getAssignedEmployee() != null ? task.getAssignedEmployee().getId() : null)
                .assignedEmployeeName(task.getAssignedEmployee() != null ? task.getAssignedEmployee().getFirstName() + " " + task.getAssignedEmployee().getLastName() : null)
                .assignedEmployeeCode(task.getAssignedEmployee() != null ? task.getAssignedEmployee().getEmployeeCode() : null)
                .departmentName(task.getAssignedEmployee() != null && task.getAssignedEmployee().getDepartment() != null ? task.getAssignedEmployee().getDepartment().getName() : null)
                .status(task.getStatus())
                .priority(task.getPriority())
                .progressPercentage(task.getProgressPercentage())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .remarks(remarks)
                .build();
    }
}
