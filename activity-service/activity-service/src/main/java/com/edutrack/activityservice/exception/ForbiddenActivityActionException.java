package com.edutrack.activityservice.exception;

public class ForbiddenActivityActionException extends RuntimeException {
    public ForbiddenActivityActionException(String message) {
        super(message);
    }
}
