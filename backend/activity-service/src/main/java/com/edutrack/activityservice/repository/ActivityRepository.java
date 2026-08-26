package com.edutrack.activityservice.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.edutrack.activityservice.domain.Activity;
import com.edutrack.activityservice.domain.ActivityStatus;

public interface ActivityRepository extends MongoRepository<Activity, String> {

    List<Activity> findByStudentId(String studentId);

    boolean existsByStudentIdAndTitleAndCategory(String studentId, String title, String category);

    List<Activity> findByStudentIdAndStatus(String studentId, ActivityStatus status);

    List<Activity> findByStatus(ActivityStatus status);

    List<Activity> findByVerifierIdAndStatusIn(String verifierId, List<ActivityStatus> statuses);

    List<Activity> findByVerifierIdAndStatus(String verifierId, ActivityStatus status);

    long countByStudentId(String studentId);

    long countByStudentIdAndStatus(String studentId, ActivityStatus status);

    long countByStatus(ActivityStatus status);

    List<Activity> findByCertificateReference(String certificateReference);
}
