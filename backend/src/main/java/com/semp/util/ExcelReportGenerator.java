package com.semp.util;

import com.semp.dto.EmployeeResponseDto;
import com.semp.dto.ProjectResponseDto;
import com.semp.dto.TaskResponseDto;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

public class ExcelReportGenerator {

    public static ByteArrayInputStream generateTaskReportExcel(List<TaskResponseDto> tasks, String title) throws IOException {
        String[] columns = {"Task Code", "Title", "Project", "Assigned To", "Department", "Status", "Priority", "Progress (%)", "Due Date"};

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Task Report");

            // Header Style
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerFont.setFontHeightInPoints((short) 12);

            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerCellStyle.setAlignment(HorizontalAlignment.CENTER);

            // Header Row
            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < columns.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(columns[col]);
                cell.setCellStyle(headerCellStyle);
            }

            // Data Rows
            int rowIdx = 1;
            for (TaskResponseDto task : tasks) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(task.getTaskCode() != null ? task.getTaskCode() : "");
                row.createCell(1).setCellValue(task.getTitle() != null ? task.getTitle() : "");
                row.createCell(2).setCellValue(task.getProjectName() != null ? task.getProjectName() : "");
                row.createCell(3).setCellValue(task.getAssignedEmployeeName() != null ? task.getAssignedEmployeeName() : "Unassigned");
                row.createCell(4).setCellValue(task.getDepartmentName() != null ? task.getDepartmentName() : "N/A");
                row.createCell(5).setCellValue(task.getStatus() != null ? task.getStatus().name() : "");
                row.createCell(6).setCellValue(task.getPriority() != null ? task.getPriority().name() : "");
                row.createCell(7).setCellValue(task.getProgressPercentage() != null ? task.getProgressPercentage() : 0);
                row.createCell(8).setCellValue(task.getDueDate() != null ? task.getDueDate().toString() : "N/A");
            }

            for (int col = 0; col < columns.length; col++) {
                sheet.autoSizeColumn(col);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public static ByteArrayInputStream generateProjectReportExcel(List<ProjectResponseDto> projects) throws IOException {
        String[] columns = {"Project Code", "Project Name", "Start Date", "End Date", "Status", "Priority", "Budget", "Total Tasks", "Completed Tasks", "Progress (%)"};

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Project Report");

            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.TEAL.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < columns.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(columns[col]);
                cell.setCellStyle(headerCellStyle);
            }

            int rowIdx = 1;
            for (ProjectResponseDto p : projects) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(p.getProjectCode() != null ? p.getProjectCode() : "");
                row.createCell(1).setCellValue(p.getName() != null ? p.getName() : "");
                row.createCell(2).setCellValue(p.getStartDate() != null ? p.getStartDate().toString() : "");
                row.createCell(3).setCellValue(p.getEndDate() != null ? p.getEndDate().toString() : "N/A");
                row.createCell(4).setCellValue(p.getStatus() != null ? p.getStatus().name() : "");
                row.createCell(5).setCellValue(p.getPriority() != null ? p.getPriority().name() : "");
                row.createCell(6).setCellValue(p.getBudget() != null ? p.getBudget().doubleValue() : 0.0);
                row.createCell(7).setCellValue(p.getTotalTasks());
                row.createCell(8).setCellValue(p.getCompletedTasks());
                row.createCell(9).setCellValue(p.getProgressPercentage());
            }

            for (int col = 0; col < columns.length; col++) {
                sheet.autoSizeColumn(col);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}
