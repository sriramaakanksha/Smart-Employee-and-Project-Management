package com.semp.service.impl;

import com.semp.dto.DashboardStatsDto;
import com.semp.dto.ProjectResponseDto;
import com.semp.dto.TaskResponseDto;
import com.semp.exception.ResourceNotFoundException;
import com.semp.model.*;
import com.semp.repository.*;
import com.semp.service.DashboardService;
import com.semp.service.ProjectService;
import com.semp.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private TaskService taskService;

    @Override
    public DashboardStatsDto getAdminDashboardStats() {
        long totalEmployees = employeeRepository.count();
        long totalProjects = projectRepository.count();
        long totalTasks = taskRepository.count();

        long completedTasks = taskRepository.countByStatus(TaskStatus.DONE);
        long inProgressTasks = taskRepository.countByStatus(TaskStatus.IN_PROGRESS);
        long pendingTasks = taskRepository.countByStatus(TaskStatus.TODO) + taskRepository.countByStatus(TaskStatus.IN_REVIEW);
        long overdueTasks = taskRepository.findOverdueTasks().size();

        long activeProjects = projectRepository.countByStatus(ProjectStatus.IN_PROGRESS);
        long completedProjects = projectRepository.countByStatus(ProjectStatus.COMPLETED);

        // Status Map
        Map<String, Long> tasksByStatus = new HashMap<>();
        for (TaskStatus status : TaskStatus.values()) {
            tasksByStatus.put(status.name(), taskRepository.countByStatus(status));
        }

        // Priority Map
        Map<String, Long> tasksByPriority = new HashMap<>();
        for (TaskPriority priority : TaskPriority.values()) {
            long count = taskRepository.findAll().stream().filter(t -> t.getPriority() == priority).count();
            tasksByPriority.put(priority.name(), count);
        }

        // Department breakdown
        Map<String, Long> employeesByDept = new HashMap<>();
        for (Department dept : departmentRepository.findAll()) {
            employeesByDept.put(dept.getName(), employeeRepository.countByDepartmentId(dept.getId()));
        }

        return DashboardStatsDto.builder()
                .totalEmployees(totalEmployees)
                .totalProjects(totalProjects)
                .totalTasks(totalTasks)
                .pendingTasks(pendingTasks)
                .completedTasks(completedTasks)
                .inProgressTasks(inProgressTasks)
                .overdueTasks(overdueTasks)
                .activeProjects(activeProjects)
                .completedProjects(completedProjects)
                .tasksByStatus(tasksByStatus)
                .tasksByPriority(tasksByPriority)
                .employeesByDepartment(employeesByDept)
                .build();
    }

    @Override
    public DashboardStatsDto getEmployeeDashboardStats(Long currentUserId) {
        Optional<Employee> empOpt = employeeRepository.findByUserId(currentUserId);
        if (empOpt.isEmpty()) {
            // Return empty stats if no employee record linked yet
            return DashboardStatsDto.builder().build();
        }

        Employee employee = empOpt.get();
        Long empId = employee.getId();

        List<TaskResponseDto> myTasks = taskService.getTasksByEmployee(empId);
        List<ProjectResponseDto> myProjects = projectService.getProjectsByEmployee(empId);

        long myTotalTasks = myTasks.size();
        long myCompletedTasks = myTasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count();
        long myPendingTasks = myTotalTasks - myCompletedTasks;

        LocalDate nextWeek = LocalDate.now().plusDays(7);
        List<TaskResponseDto> upcomingDeadlines = taskRepository.findUpcomingTasksForEmployee(empId, nextWeek)
                .stream()
                .map(t -> taskService.getTaskById(t.getId()))
                .collect(Collectors.toList());

        return DashboardStatsDto.builder()
                .totalTasks(myTotalTasks)
                .completedTasks(myCompletedTasks)
                .pendingTasks(myPendingTasks)
                .myAssignedTasks(myTasks)
                .myUpcomingDeadlines(upcomingDeadlines)
                .myAssignedProjects(myProjects)
                .build();
    }
}
