package com.edutrack.activityservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.edutrack.activityservice.domain.Activity;
import com.edutrack.activityservice.domain.ActivityEvent;
import com.edutrack.activityservice.domain.ActivityStatus;
import com.edutrack.activityservice.dto.request.CreateActivityRequest;
import com.edutrack.activityservice.dto.request.RejectActivityRequest;
import com.edutrack.activityservice.dto.request.UpdateActivityRequest;
import com.edutrack.activityservice.dto.response.ActivitySummaryResponse;
import com.edutrack.activityservice.exception.ActivityNotFoundException;
import com.edutrack.activityservice.exception.ForbiddenActivityActionException;
import com.edutrack.activityservice.exception.InvalidActivityStateException;
import com.edutrack.activityservice.repository.ActivityRepository;
import com.edutrack.activityservice.security.AuthenticatedUser;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    // ---------------------------------------------------------------
    // Student-facing
    // ---------------------------------------------------------------

    /** Creates a new submission. studentId/name/email come from the token, never the request body. */
    public Activity create(CreateActivityRequest request, AuthenticatedUser student) {
        if (activityRepository.existsByStudentIdAndTitleAndCategory(student.id(), request.title(), request.category())) {
            throw new InvalidActivityStateException("You have already submitted an activity with this title and category.");
        }

        Activity activity = Activity.builder()
                .studentId(student.id())
                .studentName(student.fullName())
                .studentEmail(student.email())
                .title(request.title())
                .category(request.category())
                .activityDate(request.activityDate())
                .description(request.description())
                .certificateReference(request.certificateReference())
                .status(ActivityStatus.PENDING)
                .build();

        activity.getHistory().add(ActivityEvent.builder()
                .action("SUBMITTED")
                .actorName(student.fullName())
                .actorRole("STUDENT")
                .remarks("Initial submission")
                .build());

        return activityRepository.save(activity);
    }

    public List<Activity> findMine(AuthenticatedUser student, ActivityStatus statusFilter) {
        if (statusFilter != null) {
            return activityRepository.findByStudentIdAndStatus(student.id(), statusFilter);
        }
        return activityRepository.findByStudentId(student.id());
    }

    public ActivitySummaryResponse summarizeMine(AuthenticatedUser student) {
        long total = activityRepository.countByStudentId(student.id());
        long pending = activityRepository.countByStudentIdAndStatus(student.id(), ActivityStatus.PENDING);
        long verified = activityRepository.countByStudentIdAndStatus(student.id(), ActivityStatus.VERIFIED);
        long rejected = activityRepository.countByStudentIdAndStatus(student.id(), ActivityStatus.REJECTED);
        return new ActivitySummaryResponse(total, pending, verified, rejected);
    }

    /** Any authenticated caller can look up a single record; access shaping happens at the controller layer. */
    public Activity findById(String id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new ActivityNotFoundException(id));
    }

    /** Only the owning student may edit their own record, and only while it's still PENDING. */
    public Activity updateOwn(String id, UpdateActivityRequest request, AuthenticatedUser student) {
        Activity activity = findById(id);
        requireOwner(activity, student);

        if (activity.getStatus() == ActivityStatus.VERIFIED) {
            throw new InvalidActivityStateException("VERIFIED activities cannot be edited.");
        }

        activity.setTitle(request.title());
        activity.setCategory(request.category());
        activity.setActivityDate(request.activityDate());
        activity.setDescription(request.description());
        activity.setCertificateReference(request.certificateReference());

        // If it was rejected, resubmit it back to pending queue
        if (activity.getStatus() == ActivityStatus.REJECTED) {
            activity.setStatus(ActivityStatus.PENDING);
            activity.setRemarks(null);
            activity.setVerifierId(null);
            activity.setVerifierName(null);
            
            activity.getHistory().add(ActivityEvent.builder()
                    .action("RESUBMITTED")
                    .actorName(student.fullName())
                    .actorRole("STUDENT")
                    .remarks("Resubmitted after rejection")
                    .build());
        } else {
            activity.getHistory().add(ActivityEvent.builder()
                    .action("UPDATED")
                    .actorName(student.fullName())
                    .actorRole("STUDENT")
                    .build());
        }

        return activityRepository.save(activity);
    }

    /** Lets a student withdraw a submission before it's been reviewed. */
    public void withdrawOwn(String id, AuthenticatedUser student) {
        Activity activity = findById(id);
        requireOwner(activity, student);

        if (activity.getStatus() != ActivityStatus.PENDING) {
            throw new InvalidActivityStateException(
                    "Only PENDING activities can be withdrawn; this one is " + activity.getStatus());
        }

        activityRepository.delete(activity);
    }

    private void requireOwner(Activity activity, AuthenticatedUser student) {
        if (!activity.getStudentId().equals(student.id())) {
            throw new ForbiddenActivityActionException("You do not own this activity record");
        }
    }

    // ---------------------------------------------------------------
    // Faculty-facing
    // ---------------------------------------------------------------

    public List<Activity> findPending() {
        return activityRepository.findByStatus(ActivityStatus.PENDING);
    }

    public List<Activity> findReviewedByFaculty(AuthenticatedUser faculty) {
        return activityRepository.findByVerifierIdAndStatusIn(
                faculty.id(), List.of(ActivityStatus.VERIFIED, ActivityStatus.REJECTED));
    }

    public Activity approve(String id, AuthenticatedUser faculty) {
        Activity activity = requirePending(id);
        activity.setStatus(ActivityStatus.VERIFIED);
        activity.setVerifierId(faculty.id());
        activity.setVerifierName(faculty.fullName());
        activity.setRemarks(null);
        
        activity.getHistory().add(ActivityEvent.builder()
                .action("VERIFIED")
                .actorName(faculty.fullName())
                .actorRole(faculty.role())
                .build());
                
        return activityRepository.save(activity);
    }

    public Activity reject(String id, RejectActivityRequest request, AuthenticatedUser faculty) {
        Activity activity = requirePending(id);
        activity.setStatus(ActivityStatus.REJECTED);
        activity.setVerifierId(faculty.id());
        activity.setVerifierName(faculty.fullName());
        activity.setRemarks(request.remarks());
        
        activity.getHistory().add(ActivityEvent.builder()
                .action("REJECTED")
                .actorName(faculty.fullName())
                .actorRole(faculty.role())
                .remarks(request.remarks())
                .build());
                
        return activityRepository.save(activity);
    }

    private Activity requirePending(String id) {
        Activity activity = findById(id);
        if (activity.getStatus() != ActivityStatus.PENDING) {
            throw new InvalidActivityStateException(
                    "Only PENDING activities can be reviewed; this one is " + activity.getStatus());
        }
        return activity;
    }

    // ---------------------------------------------------------------
    // Admin-facing
    // ---------------------------------------------------------------

    public List<Activity> findAll(ActivityStatus statusFilter, String category, String studentId) {
        List<Activity> activities = statusFilter != null
                ? activityRepository.findByStatus(statusFilter)
                : activityRepository.findAll();

        return activities.stream()
                .filter(a -> category == null || category.equalsIgnoreCase(a.getCategory()))
                .filter(a -> studentId == null || studentId.equals(a.getStudentId()))
                .toList();
    }

    public ActivitySummaryResponse summarizeAll() {
        long total = activityRepository.count();
        long pending = activityRepository.countByStatus(ActivityStatus.PENDING);
        long verified = activityRepository.countByStatus(ActivityStatus.VERIFIED);
        long rejected = activityRepository.countByStatus(ActivityStatus.REJECTED);
        return new ActivitySummaryResponse(total, pending, verified, rejected);
    }
}
