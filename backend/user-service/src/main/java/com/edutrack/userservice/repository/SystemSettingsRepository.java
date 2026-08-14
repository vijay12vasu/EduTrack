package com.edutrack.userservice.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.edutrack.userservice.domain.SystemSettings;

public interface SystemSettingsRepository extends MongoRepository<SystemSettings, String> {
}
