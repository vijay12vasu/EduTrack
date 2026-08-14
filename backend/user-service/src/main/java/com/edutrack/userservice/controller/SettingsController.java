package com.edutrack.userservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edutrack.userservice.domain.SystemSettings;
import com.edutrack.userservice.repository.SystemSettingsRepository;

@RestController
@RequestMapping("/api/users/admin/settings")
@PreAuthorize("hasRole('ADMIN')")
public class SettingsController {

    private final SystemSettingsRepository repository;
    private static final String DEFAULT_ID = "singleton-settings";

    public SettingsController(SystemSettingsRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<SystemSettings> getSettings() {
        SystemSettings settings = repository.findById(DEFAULT_ID).orElseGet(this::createDefaultSettings);
        return ResponseEntity.ok(settings);
    }

    @PostMapping
    public ResponseEntity<SystemSettings> updateSettings(@RequestBody SystemSettings update) {
        update.setId(DEFAULT_ID); // enforce singleton
        return ResponseEntity.ok(repository.save(update));
    }

    private SystemSettings createDefaultSettings() {
        SystemSettings s = new SystemSettings();
        s.setId(DEFAULT_ID);
        s.setJwtAuthEnabled(true);
        s.setAllowedUploadTypes("PDF, JPG, PNG");
        s.setAiServiceActive(true);
        s.setReportExportEnabled(true);
        s.setRecruiterVerificationMode("Read Only");
        return repository.save(s);
    }
}
