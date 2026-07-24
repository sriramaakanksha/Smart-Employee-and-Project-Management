package com.semp.service.impl;

import com.semp.dto.ProjectResponseDto;
import com.semp.dto.TaskResponseDto;
import com.semp.model.TaskStatus;
import com.semp.repository.TaskRepository;
import com.semp.service.ProjectService;
import com.semp.service.ReportService;
import com.semp.service.TaskService;
import com.semp.util.ExcelReportGenerator;
import com.semp.util.PdfReportGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private TaskService taskService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private TaskRepository taskRepository;

    @Override
    public List<TaskResponseDto> getEmployeeTaskReport(Long employeeId) {
        if (employeeId != null) {
            return taskService.getTasksByEmployee(employeeId);
        }
        return taskService.getAllTasksList();
    }

    @Override
    public List<ProjectResponseDto> getProjectProgressReport() {
        return projectService.getAllProjectsList();
    }

    @Override
    public List<TaskResponseDto> getPendingTaskReport() {
        return taskService.getAllTasksList().stream()
                .filter(t -> t.getStatus() != TaskStatus.DONE)
                .collect(Collectors.toList());
    }

    @Override
    public ByteArrayInputStream exportTasksToExcel(List<TaskResponseDto> tasks, String title) throws IOException {
        return ExcelReportGenerator.generateTaskReportExcel(tasks, title);
    }

    @Override
    public ByteArrayInputStream exportTasksToPdf(List<TaskResponseDto> tasks, String title) {
        return PdfReportGenerator.generateTaskReportPdf(tasks, title);
    }

    @Override
    public ByteArrayInputStream exportProjectsToExcel(List<ProjectResponseDto> projects) throws IOException {
        return ExcelReportGenerator.generateProjectReportExcel(projects);
    }

    @Override
    public ByteArrayInputStream exportProjectsToPdf(List<ProjectResponseDto> projects) {
        return PdfReportGenerator.generateProjectReportPdf(projects);
    }
}
