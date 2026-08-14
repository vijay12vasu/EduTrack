# Requirement Traceability Matrix

| ID | SRS Requirement | Module | Backend API | Frontend Page | Database | Security | Test | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| REQ-01 | Student Registration/Login | Auth | `POST /api/auth/register`, `POST /api/auth/login` | `Register.jsx`, `Login.jsx` | `User` (MongoDB) | JWT | `mvn test` | ✅ COMPLETE | Real User entity, BCrypt hashes |
| REQ-02 | Student Profile Management | User | `PUT /api/users/me` | `Profile.jsx` | `User` (MongoDB) | `ROLE_STUDENT` | Pending E2E | ✅ COMPLETE | Backend mapped correctly |
| REQ-03 | Activity Submission | Activity | `POST /api/activities` | `AddAchievement.jsx` | `Activity` (MongoDB) | `ROLE_STUDENT` | `mvn test` | ⚠️ PARTIAL | UI uses fake `placeholder` attributes |
| REQ-04 | Certificate Upload | File | `POST /api/files/upload` | `AddAchievement.jsx` | GridFS | `ROLE_STUDENT` | Pending E2E | ✅ COMPLETE | Metadata & GridFS mapped |
| REQ-05 | Faculty Verification | Verification | `POST /api/activities/{id}/approve` | `PendingVerification.jsx` | `Activity` (MongoDB) | `ROLE_FACULTY` | `mvn test` | ⚠️ PARTIAL | `alert()` mock failures in UI |
| REQ-06 | Dashboard (Student) | Dashboard | `GET /api/activities/me/summary` | `Dashboard.jsx` | Aggregations | `ROLE_STUDENT` | Pending | 🎭 MOCK | `Math.min(100, Math.round...)` used for progress |
| REQ-07 | AI Appraisal Scoring | ML | `POST /predict/score` (Missing) | `AIScore.jsx` | None | Internal REST | Missing | ❌ MISSING | Currently `AiService.java` is deterministic math rules |
| REQ-08 | AI Recommendations | ML | `POST /predict/recommendation` (Missing) | `AIScore.jsx` | None | Internal REST | Missing | ❌ MISSING | Currently Java string rules |
| REQ-09 | AI Communication via Python/FastAPI | ML | N/A | N/A | N/A | Internal REST | Missing | ❌ MISSING | No Python service exists |
| REQ-10 | Admin Dashboard / User Management | Admin | `GET /api/users/admin/all` | `Dashboard.jsx` (Admin) | `User` | `ROLE_ADMIN` | Pending E2E | ⚠️ PARTIAL | Real API, but missing full CRUD |
| REQ-11 | NAAC/NBA/Profile Reports | Reporting | `GET /api/activities/reports/*` | `Reports.jsx` (Student/Faculty) | `Activity` | RBAC | Pending E2E | ⚠️ PARTIAL | UI uses `alert(e.message)` on failure |
| REQ-12 | Employer Verified Profiles | Employer | `GET /api/activities/{id}` | `VerifyStudent.jsx` | `Activity` | `ROLE_EMPLOYER` | Pending | ⚠️ PARTIAL | `alert()` mocks for missing certificates |
| REQ-13 | API Gateway Integration | Gateway | Routes to 8081/8082 | `vite.config.js` | N/A | 8080 Enforcement | Pending E2E | ✅ COMPLETE | `vite.config.js` uses `proxy: '/api' -> 8080` |
| REQ-14 | GridFS IDOR Protection | File | `GET /api/files/{id}` | Certificate Views | GridFS | Ownership Check | Missing | ⚠️ PARTIAL | Logic in place, needs E2E tests |
| REQ-15 | ML Local Training (scikit-learn) | ML | N/A | N/A | N/A | N/A | Missing | ❌ MISSING | No model exists |
| REQ-16 | Fallback Mechanisms | Architecture| `AiService.java` | Fallback Displays | N/A | Circuit Breaker| Missing | ⚠️ PARTIAL | Java logic exists, but not designed as explicit fallback |
