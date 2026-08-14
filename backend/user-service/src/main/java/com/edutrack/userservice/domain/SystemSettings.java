package com.edutrack.userservice.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "settings")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemSettings {

    @Id
    private String id;
    
    private boolean jwtAuthEnabled;
    private String allowedUploadTypes;
    private boolean aiServiceActive;
    private boolean reportExportEnabled;
    private String recruiterVerificationMode;
}
