# PRODUCTION GRADE IMPLEMENTATION PLAN

## 1. Current Architecture vs. Target Architecture

**Current Architecture:**
- React frontend bypasses the API Gateway entirely, calling `localhost:8081` (user-service) and `localhost:8082` (activity-service) directly via Vite proxy.
- File access (GridFS) relies solely on knowing the ObjectId, which is an IDOR vulnerability.
- Employer AI scores are mocked on the frontend (`studentActs.length * 15`).
- Profile editing and reporting features are frontend-only stubs.
- `ai-service` is an empty, abandoned directory.

**Target Architecture:**
- **Strict Gateway Routing:** React frontend -> `api-gateway` -> `eureka-server` -> `user-service` / `activity-service`.
- **Zero-Trust Security:** Every endpoint, especially file downloads and AI endpoints, strictly validates the identity, role, and data ownership from the verified JWT.
- **Data Integrity:** Real AI scoring via backend determinism, real PDF report generation, and robust MongoDB validation.

---

## 2. Implementation Phases

### PHASE 1 — SECURITY FIRST (GridFS IDOR)
- **Goal:** Secure `GET /api/files/{id}`.
- **Tasks:**
  - Update `FileService.java` to attach the `userId` as metadata when storing a file into GridFS.
  - Update `ActivityRepository.java` to include `Optional<Activity> findByCertificateReference(String certificateReference)`.
  - Update `FileController.java` to verify authorization before returning the file resource:
    - `STUDENT`: Allow if `metadata.userId == principal.id()`.
    - `FACULTY` / `ADMIN`: Allow.
    - `EMPLOYER`: Allow only if the associated `Activity` is `VERIFIED`.
  - Add file type validation (`image/png`, `image/jpeg`, `application/pdf`) and size constraints on `POST /api/files`.

### PHASE 2 — DATA ISOLATION
- **Goal:** Prevent cross-user data leakage.
- **Tasks:**
  - Secure `/api/activities/admin/summary`: Create a separate `/api/activities/employer/summary` or enforce strict filtering inside the method to ensure Employers cannot see raw PENDING/REJECTED counts.
  - Audit `ActivityController` and ensure students cannot query activities by arbitrary IDs they do not own.

### PHASE 3 — API GATEWAY
- **Goal:** Route all traffic securely through the gateway.
- **Tasks:**
  - Configure `api-gateway/src/main/resources/application.yaml` to route `/api/auth/**` and `/api/users/**` to `user-service`, and `/api/activities/**`, `/api/files/**` to `activity-service`.
  - Configure CORS in the Gateway.
  - Update `frontend/edutrack-react-app/vite.config.js` to proxy *all* `/api` traffic to `http://localhost:8080` (API Gateway).

### PHASE 4 — COMPLETE ALL REAL FEATURES
- **A. Profile Management:**
  - Implement `PUT /api/users/me` in `UserController.java` (update `fullName` only, never `role`).
  - Connect the React Profile pages (`StudentProfile.jsx`, etc.) to this API.
- **B. Admin/Faculty Reports:**
  - Implement backend export APIs (e.g., CSV generation or tabular JSON) for Admin and Faculty.
  - Connect `Admin/Reports.jsx` and `Faculty/Reports.jsx` to the actual APIs, removing the "MISSING BACKEND API" mocks.
- **C. Employer Mock Removal:**
  - Remove `Math.min(...)` from `VerifyStudent.jsx`.
  - Use `GET /api/activities/ai/score/{studentId}`.

### PHASE 5 — AI
- **Goal:** Finalize the deterministic AI endpoint.
- **Tasks:**
  - Add `GET /api/activities/ai/score/{studentId}` in `AiController.java`.
  - Restrict access to this endpoint to `ADMIN`, `FACULTY`, and `EMPLOYER`.
  - The engine will strictly parse only `VERIFIED` activities for the requested student.

### PHASE 6 & 7 — ADMIN SETTINGS & REMOVE ALL MOCKS
- **Goal:** Purge fake data.
- **Tasks:**
  - Confirm Admin Settings persist correctly.
  - Remove fake UI tiles for reports that do not exist if they fall outside the SRS, or implement them properly.

### PHASE 8 & 9 — ERROR HANDLING & DATABASE QUALITY
- **Goal:** Production resilience.
- **Tasks:**
  - Ensure API exceptions map to 400/401/403/404 via `@ControllerAdvice`.
  - Add logic to delete the GridFS file when an Activity is deleted (prevent orphaned files).

### PHASE 10 & 11 — SECURITY HARDENING & TESTING
- **Goal:** Defensible backend.
- **Tasks:**
  - Verify Spring Security chains.
  - Create standard E2E test suites in Postman or automated scripts.

### PHASE 12 & 13 — REAL BROWSER TEST & PERFORMANCE
- **Goal:** Final E2E verification.
- **Tasks:**
  - Perform the exact multi-role workflow requested.
  - Monitor logs for N+1 queries.

### PHASE 14 — FINAL AUDIT
- **Goal:** Generate the final required documentation.
- **Tasks:**
  - Write `docs/FINAL_PRODUCTION_AUDIT.md`.
