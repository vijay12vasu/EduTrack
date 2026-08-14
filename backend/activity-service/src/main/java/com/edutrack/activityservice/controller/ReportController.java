package com.edutrack.activityservice.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edutrack.activityservice.domain.Activity;
import com.edutrack.activityservice.security.AuthenticatedUser;
import com.edutrack.activityservice.service.ActivityService;
import com.edutrack.activityservice.service.ReportService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/activities/reports")
@Tag(name = "Reports", description = "PDF Generation")
public class ReportController {

    private final ReportService reportService;
    private final ActivityService activityService;

    public ReportController(ReportService reportService, ActivityService activityService) {
        this.reportService = reportService;
        this.activityService = activityService;
    }

    @GetMapping("/student")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @Operation(summary = "Generate PDF report for the current student")
    public ResponseEntity<byte[]> getOwnReport(
            @AuthenticationPrincipal AuthenticatedUser student,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "profile") String type) {
        
        byte[] pdf;
        if ("naac".equalsIgnoreCase(type)) {
            pdf = reportService.generateNaacReportPdf(student.id(), student.fullName(), student.email());
        } else if ("nba".equalsIgnoreCase(type)) {
            pdf = reportService.generateNbaReportPdf(student.id(), student.fullName(), student.email());
        } else {
            pdf = reportService.generateStudentReportPdf(student.id(), student.fullName(), student.email());
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "EduTrack_Report_" + type + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
    }

    @GetMapping("/student/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'EMPLOYER')")
    @Operation(summary = "Generate PDF report for a specific student (For Admin/Faculty/Employer)")
    public ResponseEntity<byte[]> getStudentReport(@PathVariable String id) {
        // Find one activity to get the student's name and email for the report headers
        // Realistically we'd query user-service, but since activity stores denormalized studentName/Email, we can use it.
        var activities = activityService.findAll(null, null, id);
        
        String name = "Unknown Student";
        String email = "unknown@domain.com";
        
        if (!activities.isEmpty()) {
            Activity a = activities.get(0);
            name = a.getStudentName();
            email = a.getStudentEmail();
        }

        byte[] pdf = reportService.generateStudentReportPdf(id, name, email);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "EduTrack_Report_" + id + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
    }
    @GetMapping("/faculty")
    @PreAuthorize("hasAuthority('ROLE_FACULTY')")
    @Operation(summary = "Generate PDF report for the current faculty")
    public ResponseEntity<byte[]> getFacultyReport(@AuthenticationPrincipal AuthenticatedUser faculty) {
        byte[] pdf = reportService.generateFacultyReportPdf(faculty.id(), faculty.fullName());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "Faculty_Report.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Generate Org-Wide PDF report")
    public ResponseEntity<byte[]> getAdminReport() {
        byte[] pdf = reportService.generateAdminReportPdf();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "Admin_Report.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
    }
}
