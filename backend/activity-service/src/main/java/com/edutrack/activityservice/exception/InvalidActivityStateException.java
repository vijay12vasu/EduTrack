package com.edutrack.activityservice.exception;

public class InvalidActivityStateException extends RuntimeException {
    public InvalidActivityStateException(String message) {
        super(message);
    }
}
