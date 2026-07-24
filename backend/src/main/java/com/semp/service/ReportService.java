package com.semp.service;

import com.semp.dto.ProjectResponseDto;
import com.semp.dto.TaskResponseDto;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

public interface ReportService {
    List<TaskResponseDto> getEmployeeTaskReport(Long employeeId);
    List<ProjectResponseDto> getProjectProgressReport();
    List<TaskResponseDto> getPendingTaskReport();

    ByteArrayInputStream exportTasksToExcel(List<TaskResponseDto> tasks, String title) throws IOException;
    ByteArrayInputStream exportTasksToPdf(List<TaskResponseDto> tasks, String title);

    ByteArrayInputStream exportProjectsToExcel(List<ProjectResponseDto> projects) throws IOException;
    ByteArrayInputStream exportProjectsToPdf(List<ProjectResponseDto> projects);
}
