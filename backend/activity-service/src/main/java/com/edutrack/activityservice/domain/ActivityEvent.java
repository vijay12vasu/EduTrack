package com.edutrack.activityservice.domain;

import java.time.Instant;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityEvent {
    @Builder.Default
    private String id = UUID.randomUUID().toString();
    
    @Builder.Default
    private Instant timestamp = Instant.now();
    
    private String action;
    private String actorName;
    private String actorRole;
    private String remarks;
}
