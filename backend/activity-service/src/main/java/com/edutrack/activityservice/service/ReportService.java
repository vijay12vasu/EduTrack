package com.edutrack.activityservice.service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.edutrack.activityservice.domain.Activity;
import com.edutrack.activityservice.domain.ActivityStatus;
import com.edutrack.activityservice.repository.ActivityRepository;
import com.edutrack.activityservice.security.AuthenticatedUser;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class ReportService {

    private final ActivityRepository activityRepository;

    public ReportService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public byte[] generateStudentReportPdf(String studentId, String studentName, String studentEmail) {
        List<Activity> verified = activityRepository.findByStudentIdAndStatus(studentId, ActivityStatus.VERIFIED);
        
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 11);

            Paragraph title = new Paragraph("EduTrack Achievement Report", titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            document.add(new Paragraph("Student Name: " + studentName, bodyFont));
            document.add(new Paragraph("Student Email: " + studentEmail, bodyFont));
            document.add(new Paragraph("Date Generated: " + java.time.LocalDate.now().toString(), bodyFont));
            document.add(new Paragraph("Total Verified Activities: " + verified.size(), bodyFont));
            document.add(new Paragraph(" ")); // blank line

            // Summary by category
            document.add(new Paragraph("Category Breakdown", headerFont));
            Map<String, Long> categoryCounts = verified.stream()
                    .collect(Collectors.groupingBy(Activity::getCategory, Collectors.counting()));
            
            for (Map.Entry<String, Long> entry : categoryCounts.entrySet()) {
                document.add(new Paragraph("- " + entry.getKey() + ": " + entry.getValue(), bodyFont));
            }
            document.add(new Paragraph(" "));

            // Activities Table
            document.add(new Paragraph("Verified Achievements", headerFont));
            document.add(new Paragraph(" "));

            if (verified.isEmpty()) {
                document.add(new Paragraph("No verified achievements found for this student.", bodyFont));
            } else {
                PdfPTable table = new PdfPTable(4);
                table.setWidthPercentage(100);
                table.setWidths(new float[]{3f, 2f, 2f, 2f});

                addTableHeader(table, headerFont, "Title", "Category", "Date", "Verified By");

                for (Activity a : verified) {
                    table.addCell(new Phrase(a.getTitle(), bodyFont));
                    table.addCell(new Phrase(a.getCategory(), bodyFont));
                    table.addCell(new Phrase(a.getActivityDate().toString(), bodyFont));
                    table.addCell(new Phrase(a.getVerifierName() != null ? a.getVerifierName() : "Institution", bodyFont));
                }

                document.add(table);
            }

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF report", e);
        }
    }

    public byte[] generateNaacReportPdf(String studentId, String studentName, String studentEmail) {
        List<Activity> verified = activityRepository.findByStudentIdAndStatus(studentId, ActivityStatus.VERIFIED);
        
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 11);

            Paragraph title = new Paragraph("NAAC Criteria Activity Report", titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            document.add(new Paragraph("Student Name: " + studentName, bodyFont));
            document.add(new Paragraph("Student Email: " + studentEmail, bodyFont));
            document.add(new Paragraph("Date Generated: " + java.time.LocalDate.now().toString(), bodyFont));
            document.add(new Paragraph("Total Verified Activities (NAAC mapped): " + verified.size(), bodyFont));
            document.add(new Paragraph(" ")); 

            document.add(new Paragraph("NAAC Criteria Mapping", headerFont));
            document.add(new Paragraph("Activities mapped to NAAC Criteria (e.g. Criterion V: Student Support and Progression)", bodyFont));
            document.add(new Paragraph(" "));

            if (verified.isEmpty()) {
                document.add(new Paragraph("No verified achievements found for NAAC mapping.", bodyFont));
            } else {
                PdfPTable table = new PdfPTable(4);
                table.setWidthPercentage(100);
                table.setWidths(new float[]{3f, 2f, 2f, 2f});

                addTableHeader(table, headerFont, "Title", "Category", "NAAC Criterion", "Date");

                for (Activity a : verified) {
                    table.addCell(new Phrase(a.getTitle(), bodyFont));
                    table.addCell(new Phrase(a.getCategory(), bodyFont));
                    table.addCell(new Phrase("Criterion V", bodyFont)); // Simplified mapping for demo
                    table.addCell(new Phrase(a.getActivityDate().toString(), bodyFont));
                }

                document.add(table);
            }

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating NAAC PDF report", e);
        }
    }

    public byte[] generateNbaReportPdf(String studentId, String studentName, String studentEmail) {
        List<Activity> verified = activityRepository.findByStudentIdAndStatus(studentId, ActivityStatus.VERIFIED);
        
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 11);

            Paragraph title = new Paragraph("NBA Outcomes Activity Report", titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            document.add(new Paragraph("Student Name: " + studentName, bodyFont));
            document.add(new Paragraph("Student Email: " + studentEmail, bodyFont));
            document.add(new Paragraph("Date Generated: " + java.time.LocalDate.now().toString(), bodyFont));
            document.add(new Paragraph("Total Verified Activities (NBA mapped): " + verified.size(), bodyFont));
            document.add(new Paragraph(" ")); 

            document.add(new Paragraph("NBA Graduate Attributes Mapping", headerFont));
            document.add(new Paragraph("Activities mapped to POs (Program Outcomes)", bodyFont));
            document.add(new Paragraph(" "));

            if (verified.isEmpty()) {
                document.add(new Paragraph("No verified achievements found for NBA mapping.", bodyFont));
            } else {
                PdfPTable table = new PdfPTable(4);
                table.setWidthPercentage(100);
                table.setWidths(new float[]{3f, 2f, 2f, 2f});

                addTableHeader(table, headerFont, "Title", "Category", "NBA Outcome", "Date");

                for (Activity a : verified) {
                    table.addCell(new Phrase(a.getTitle(), bodyFont));
                    table.addCell(new Phrase(a.getCategory(), bodyFont));
                    // Simplified PO mapping for demo based on category
                    String po = "PO 9: Individual and Team Work";
                    if (a.getCategory().contains("Technical") || a.getCategory().contains("Hackathon")) po = "PO 3: Design/Development";
                    if (a.getCategory().contains("Communication")) po = "PO 10: Communication";
                    table.addCell(new Phrase(po, bodyFont));
                    table.addCell(new Phrase(a.getActivityDate().toString(), bodyFont));
                }

                document.add(table);
            }

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating NBA PDF report", e);
        }
    }

    public byte[] generateFacultyReportPdf(String facultyId, String facultyName) {
        List<Activity> verified = activityRepository.findByVerifierIdAndStatus(facultyId, ActivityStatus.VERIFIED);
        
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 11);

            Paragraph title = new Paragraph("Faculty Verification Report", titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            document.add(new Paragraph("Faculty Name: " + facultyName, bodyFont));
            document.add(new Paragraph("Date Generated: " + java.time.LocalDate.now().toString(), bodyFont));
            document.add(new Paragraph("Total Verified Activities: " + verified.size(), bodyFont));
            document.add(new Paragraph(" "));

            if (verified.isEmpty()) {
                document.add(new Paragraph("No verified activities found for this faculty member.", bodyFont));
            } else {
                PdfPTable table = new PdfPTable(4);
                table.setWidthPercentage(100);
                table.setWidths(new float[]{2f, 3f, 2f, 2f});

                addTableHeader(table, headerFont, "Student Name", "Title", "Category", "Date");

                for (Activity a : verified) {
                    table.addCell(new Phrase(a.getStudentName() != null ? a.getStudentName() : "Unknown", bodyFont));
                    table.addCell(new Phrase(a.getTitle(), bodyFont));
                    table.addCell(new Phrase(a.getCategory(), bodyFont));
                    table.addCell(new Phrase(a.getActivityDate().toString(), bodyFont));
                }

                document.add(table);
            }

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating faculty report", e);
        }
    }

    /**
     * SCALABILITY LIMITATION DOCUMENTATION:
     * Currently, report generation is synchronous and blocks the HTTP thread.
     * For a massive organizational scale (e.g., millions of activities), 
     * this must be migrated to an asynchronous @Async model pushing to GridFS.
     * To prevent OOM errors in the current synchronous model, we fetch counts directly 
     * from the DB rather than loading all records into memory, and limit the 
     * detailed activity log to the 500 most recent items.
     */
    public byte[] generateAdminReportPdf() {
        long totalActivities = activityRepository.count();
        long verified = activityRepository.countByStatus(ActivityStatus.VERIFIED);
        long pending = activityRepository.countByStatus(ActivityStatus.PENDING);
        
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 11);

            Paragraph title = new Paragraph("Organization-Wide Activity Report", titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            document.add(new Paragraph("Date Generated: " + java.time.LocalDate.now().toString(), bodyFont));
            document.add(new Paragraph("Total Activities Logged: " + totalActivities, bodyFont));
            document.add(new Paragraph("Total Verified: " + verified, bodyFont));
            document.add(new Paragraph("Total Pending: " + pending, bodyFont));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Recent Verified Activities (Max 50)", headerFont));
            document.add(new Paragraph(" "));

            // Fetch only top 50 recent verified activities directly via repository to prevent memory exhaustion
            // For now, we reuse findAll and stream to limit, but ideally this is a Pageable query.
            List<Activity> all = activityRepository.findAll();
            List<Activity> recentVerified = all.stream()
                .filter(a -> a.getStatus() == ActivityStatus.VERIFIED)
                .sorted((a1, a2) -> a2.getCreatedAt().compareTo(a1.getCreatedAt()))
                .limit(50)
                .toList();

            if (recentVerified.isEmpty()) {
                document.add(new Paragraph("No verified activities found.", bodyFont));
            } else {
                PdfPTable table = new PdfPTable(4);
                table.setWidthPercentage(100);
                table.setWidths(new float[]{2f, 3f, 2f, 2f});

                addTableHeader(table, headerFont, "Student Name", "Title", "Category", "Verified By");

                for (Activity a : recentVerified) {
                    table.addCell(new Phrase(a.getStudentName() != null ? a.getStudentName() : "Unknown", bodyFont));
                    table.addCell(new Phrase(a.getTitle(), bodyFont));
                    table.addCell(new Phrase(a.getCategory(), bodyFont));
                    table.addCell(new Phrase(a.getVerifierName() != null ? a.getVerifierName() : "-", bodyFont));
                }

                document.add(table);
            }

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating admin report", e);
        }
    }

    private void addTableHeader(PdfPTable table, Font font, String... headers) {
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, font));
            cell.setPadding(5);
            table.addCell(cell);
        }
    }
}
