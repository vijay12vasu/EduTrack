package com.edutrack.activityservice.domain;

import java.time.Instant;
import java.time.LocalDate;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A single student activity/achievement submission, e.g. a workshop,
 * competition, certification, or research credit, submitted for faculty
 * verification.
 * <p>
 * {@code studentName}/{@code studentEmail} and {@code verifierName} are
 * intentionally denormalized from JWT claims at write time (see
 * {@link com.edutrack.activityservice.security.AuthenticatedUser}) rather
 * than looked up from user-service on read. This avoids a cross-service
 * call for every list/detail view; the trade-off is that a later name
 * change in user-service won't retroactively update historical records
 * here, which is acceptable for an audit-style record.
 */
@Document(collection = "activities")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Activity {

    @Id
    private String id;

    @Indexed
    private String studentId;

    private String studentName;
    private String studentEmail;

    private String title;
    @Indexed
    private String category;
    private LocalDate activityDate;
    private String description;

    /**
     * Reference to the uploaded proof (filename or URL). No dedicated file
     * storage service exists in this backend yet, so this is accepted as an
     * opaque string supplied by the client rather than a real upload.
     */
    @Indexed
    private String certificateReference;

    @Indexed
    @Builder.Default
    private ActivityStatus status = ActivityStatus.PENDING;

    @Indexed
    private String verifierId;
    private String verifierName;

    /** Faculty's note, most relevant on rejection but usable on either outcome. */
    private String remarks;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
