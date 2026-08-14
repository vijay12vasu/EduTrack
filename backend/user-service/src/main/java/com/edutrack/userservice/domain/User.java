package com.edutrack.userservice.domain;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;

    private String fullName;

    @org.springframework.data.mongodb.core.index.Indexed(unique = true)
    private String email;

    private String passwordHash;

    @org.springframework.data.mongodb.core.index.Indexed
    private Role role;

    // Profile fields
    private String department;
    private String year;
    private String mobile;
    private String registerNumber;
    private String facultyId;
    private String company;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}