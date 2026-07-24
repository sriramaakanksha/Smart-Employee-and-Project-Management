package com.semp.util;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.semp.dto.ProjectResponseDto;
import com.semp.dto.TaskResponseDto;

import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

public class PdfReportGenerator {

    public static ByteArrayInputStream generateTaskReportPdf(List<TaskResponseDto> tasks, String title) {
        Document document = new Document(PageSize.A4.rotate());
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Title
            Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLUE);
            Paragraph titlePara = new Paragraph(title, fontTitle);
            titlePara.setAlignment(Paragraph.ALIGN_CENTER);
            titlePara.setSpacingAfter(15);
            document.add(titlePara);

            // Table setup
            PdfPTable table = new PdfPTable(8);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1.2f, 2.5f, 2.0f, 2.0f, 1.2f, 1.2f, 1.0f, 1.4f});

            // Table Header
            Font fontHeader = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);
            String[] headers = {"Code", "Title", "Project", "Assigned To", "Status", "Priority", "Progress", "Due Date"};

            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, fontHeader));
                cell.setBackgroundColor(new Color(30, 41, 59));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(6);
                table.addCell(cell);
            }

            // Table Data
            Font fontData = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.BLACK);
            for (TaskResponseDto task : tasks) {
                table.addCell(new Phrase(task.getTaskCode() != null ? task.getTaskCode() : "", fontData));
                table.addCell(new Phrase(task.getTitle() != null ? task.getTitle() : "", fontData));
                table.addCell(new Phrase(task.getProjectName() != null ? task.getProjectName() : "", fontData));
                table.addCell(new Phrase(task.getAssignedEmployeeName() != null ? task.getAssignedEmployeeName() : "Unassigned", fontData));
                table.addCell(new Phrase(task.getStatus() != null ? task.getStatus().name() : "", fontData));
                table.addCell(new Phrase(task.getPriority() != null ? task.getPriority().name() : "", fontData));
                table.addCell(new Phrase((task.getProgressPercentage() != null ? task.getProgressPercentage() : 0) + "%", fontData));
                table.addCell(new Phrase(task.getDueDate() != null ? task.getDueDate().toString() : "N/A", fontData));
            }

            document.add(table);
            document.close();

        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    public static ByteArrayInputStream generateProjectReportPdf(List<ProjectResponseDto> projects) {
        Document document = new Document(PageSize.A4.rotate());
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, new Color(15, 118, 110));
            Paragraph titlePara = new Paragraph("Project Progress Report", fontTitle);
            titlePara.setAlignment(Paragraph.ALIGN_CENTER);
            titlePara.setSpacingAfter(15);
            document.add(titlePara);

            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1.5f, 3.0f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f});

            Font fontHeader = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);
            String[] headers = {"Project Code", "Name", "Start Date", "End Date", "Status", "Priority", "Progress"};

            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, fontHeader));
                cell.setBackgroundColor(new Color(15, 118, 110));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(6);
                table.addCell(cell);
            }

            Font fontData = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.BLACK);
            for (ProjectResponseDto p : projects) {
                table.addCell(new Phrase(p.getProjectCode() != null ? p.getProjectCode() : "", fontData));
                table.addCell(new Phrase(p.getName() != null ? p.getName() : "", fontData));
                table.addCell(new Phrase(p.getStartDate() != null ? p.getStartDate().toString() : "", fontData));
                table.addCell(new Phrase(p.getEndDate() != null ? p.getEndDate().toString() : "N/A", fontData));
                table.addCell(new Phrase(p.getStatus() != null ? p.getStatus().name() : "", fontData));
                table.addCell(new Phrase(p.getPriority() != null ? p.getPriority().name() : "", fontData));
                table.addCell(new Phrase(p.getProgressPercentage() + "%", fontData));
            }

            document.add(table);
            document.close();

        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
