package com.semp.controller;

import com.semp.dto.ProjectResponseDto;
import com.semp.dto.TaskResponseDto;
import com.semp.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/employee-tasks")
    public ResponseEntity<List<TaskResponseDto>> getEmployeeTaskReport(@RequestParam(required = false) Long employeeId) {
        return ResponseEntity.ok(reportService.getEmployeeTaskReport(employeeId));
    }

    @GetMapping("/project-progress")
    public ResponseEntity<List<ProjectResponseDto>> getProjectProgressReport() {
        return ResponseEntity.ok(reportService.getProjectProgressReport());
    }

    @GetMapping("/pending-tasks")
    public ResponseEntity<List<TaskResponseDto>> getPendingTaskReport() {
        return ResponseEntity.ok(reportService.getPendingTaskReport());
    }

    // Export Endpoints
    @GetMapping("/tasks/excel")
    public ResponseEntity<InputStreamResource> exportTasksExcel(
            @RequestParam(required = false) Long employeeId,
            @RequestParam(defaultValue = "Task Report") String title) throws IOException {

        List<TaskResponseDto> tasks = reportService.getEmployeeTaskReport(employeeId);
        ByteArrayInputStream in = reportService.exportTasksToExcel(tasks, title);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=tasks_report.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }

    @GetMapping("/tasks/pdf")
    public ResponseEntity<InputStreamResource> exportTasksPdf(
            @RequestParam(required = false) Long employeeId,
            @RequestParam(defaultValue = "Task Report") String title) {

        List<TaskResponseDto> tasks = reportService.getEmployeeTaskReport(employeeId);
        ByteArrayInputStream in = reportService.exportTasksToPdf(tasks, title);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=tasks_report.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(in));
    }

    @GetMapping("/projects/excel")
    public ResponseEntity<InputStreamResource> exportProjectsExcel() throws IOException {
        List<ProjectResponseDto> projects = reportService.getProjectProgressReport();
        ByteArrayInputStream in = reportService.exportProjectsToExcel(projects);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=projects_report.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }

    @GetMapping("/projects/pdf")
    public ResponseEntity<InputStreamResource> exportProjectsPdf() {
        List<ProjectResponseDto> projects = reportService.getProjectProgressReport();
        ByteArrayInputStream in = reportService.exportProjectsToPdf(projects);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=projects_report.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(in));
    }
}
