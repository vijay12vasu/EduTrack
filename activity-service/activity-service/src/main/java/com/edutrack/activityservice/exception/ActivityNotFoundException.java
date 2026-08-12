package com.edutrack.activityservice.exception;

public class ActivityNotFoundException extends RuntimeException {
    public ActivityNotFoundException(String id) {
        super("No activity found with id '" + id + "'");
    }
}
