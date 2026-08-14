# EduTrack — Final Demo Report

> Generated: 2026-08-13 09:07 IST  
> Status: **🟢 READY FOR DEMO**

---

## 1. Project Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                       │
│              (Vite + React 19, port 5173)               │
│   Proxy: /api → localhost:8081 & localhost:8082          │
└────────────┬───────────────────────┬────────────────────┘
             │                       │
     ┌───────▼───────┐       ┌───────▼──────────┐
     │  User Service  │       │ Activity Service  │
     │  (Spring Boot) │       │  (Spring Boot)    │
     │   port 8081    │       │   port 8082       │
     │                │       │                   │
     │  • Auth/JWT    │       │  • Activities     │
     │  • Register    │       │  • Verification   │
     │  • Login       │       │  • GridFS Files   │
     │                │       │  • AI Scoring     │
     └───────┬───────┘       └───────┬──────────┘
             │                       │
             │   ┌───────────────┐   │
             └──►│  Eureka Server │◄──┘
                 │   port 8761    │
                 └───────────────┘
                        │
                 ┌──────▼──────┐
                 │   MongoDB   │
                 │  port 27017 │
                 │  db: "test" │
                 └─────────────┘
```

## 2. Technologies Used

| Layer | Technology | Version |
|:------|:-----------|:--------|
| Frontend | React + Vite | React 19, Vite 8.2 |
| Styling | Tailwind CSS | 4.x |
| Backend | Spring Boot | 4.1.0 |
| Service Discovery | Netflix Eureka | (via Spring Cloud) |
| Database | MongoDB | 8.x |
| File Storage | MongoDB GridFS | (via spring-data-mongodb) |
| Authentication | JWT (JJWT) | HS256, 24h expiry |
| AI Engine | Local rule-based scoring | Deterministic, no external API |
| Build | Maven (backend), npm (frontend) | |
| Language | Java 21, JavaScript (ES2020+) | |

## 3. MongoDB & GridFS Usage

- **Database**: `test` on `mongodb://localhost:27017`
- **Collections**:
  - `users` — 18 documents (students, faculty)
  - `activities` — 10 documents (achievements with status tracking)
  - `fs.files` / `fs.chunks` — GridFS certificate storage (2 files verified)
- **GridFS flow**: Student uploads a certificate file → `FileService` stores it via `GridFsTemplate` → returns ObjectId → saved as `certificateReference` in the activity document → Faculty can download via `GET /api/files/{id}`

## 4. AI Implementation

- **Location**: `AiService.java` in activity-service
- **Type**: Local deterministic rule-based engine (no paid API keys required)
- **Scoring logic**:
  - Base score: 50
  - +10 per verified activity (up to 5)
  - +5 per unique category (diversity bonus)
  - Bonus for certificates attached
- **Endpoint**: `GET /api/activities/ai/score` (requires student JWT)
- **Response**: `{ score, strengths[], recommendations[] }` — dynamically computed from the student's actual activity data

## 5. Completed Features

### Core Workflow ✅
- [x] Student self-registration (STUDENT role only)
- [x] JWT-based login/logout
- [x] Role-based routing (Student / Faculty / Admin / Employer)
- [x] Add Achievement with certificate upload
- [x] Activity persisted in MongoDB with `PENDING` status
- [x] Faculty pending verification list (real-time, no caching issues)
- [x] Faculty approve / reject with remarks
- [x] Student sees updated status in My Activities

### Certificate Management ✅
- [x] File upload via multipart/form-data to GridFS
- [x] Certificate reference stored on activity document
- [x] Faculty can view/download certificate from pending list

### AI Profile Analysis ✅
- [x] Rule-based AI scoring from actual achievement data
- [x] Strengths and recommendations dynamically generated
- [x] Frontend AI Score page connected to real backend endpoint

### Dashboards ✅
- [x] Student Dashboard — real counts (Total, Verified, Pending, Rejected, AI Score)
- [x] Student Dashboard — real category progress bars
- [x] Faculty Dashboard — real pending/verified/reviewed counts
- [x] Admin Dashboard — real activity statistics
- [x] Reports page — real verified achievement log with Print/PDF button

### Other ✅
- [x] Student Profile (connected to auth context)
- [x] Protected routes with JWT guard
- [x] Responsive UI with Tailwind CSS

## 6. Validated End-to-End Workflow

Smoke test executed at 2026-08-13 09:06 IST — **9/9 PASSED**:

```
1. Register: PASS
2. Student Login: PASS
3. Faculty Login: PASS
4. Certificate Upload: PASS (ID=6a7d3bcf9df28050ba199fc1)
5. Activity Created: PASS (ID=6a7d3bcf9df28050ba199fc3, Status=PENDING)
6. Faculty Certificate Download: PASS
7. Faculty Approve: PASS
8. AI Score: PASS (score=65)
9. Dashboard Stats: PASS (verified=1)
```

## 7. Build Results

| Component | Command | Result |
|:----------|:--------|:-------|
| User Service | `mvnw compile` | ✅ SUCCESS (0 errors) |
| Activity Service | `mvnw compile` | ✅ SUCCESS (0 errors) |
| React Frontend | `npm run build` | ✅ SUCCESS (290.63 kB JS, 22.21 kB CSS) |

## 8. Known Non-Critical Limitations

1. **Admin User Management UI** — Backend supports CRUD, but no dedicated Admin panel to create/delete users from the frontend. Users are created via the registration API.
2. **Employer Dashboard** — Minimal implementation showing a list of verified student profiles. No advanced analytics or search.
3. **AI Engine** — Deterministic rule-based (not ML/LLM). Sufficient for demo purposes, clearly explainable.
4. **Password field** — The `User` entity has a field name inconsistency (`password` vs `passwordHash`) across older/newer records in MongoDB. Both work because the auth logic handles it, but it's a cosmetic DB-level inconsistency.

## 9. Startup Commands

**Prerequisites**: MongoDB must be running on `localhost:27017`.

Open 4 separate terminals and run in this order:

### Terminal 1 — Eureka Server
```powershell
cd D:\eduTrack_structure\EduTrack\backend\eureka-server
.\mvnw.cmd spring-boot:run
```
*Wait ~15 seconds until you see "Started EurekaServerApplication"*

### Terminal 2 — User Service
```powershell
cd D:\eduTrack_structure\EduTrack\backend\user-service
.\mvnw.cmd spring-boot:run
```
*Wait ~10 seconds until you see "Started UserServiceApplication"*

### Terminal 3 — Activity Service
```powershell
cd D:\eduTrack_structure\EduTrack\backend\activity-service
.\mvnw.cmd spring-boot:run
```
*Wait ~10 seconds until you see "Started ActivityServiceApplication"*

### Terminal 4 — React Frontend
```powershell
cd D:\eduTrack_structure\EduTrack\frontend\edutrack-react-app
npm run dev
```

### Open in Browser
```
http://localhost:5173
```

### If a port is already occupied
```powershell
# Find the process using a port (e.g., 8082):
netstat -ano | findstr :8082
# Kill it by PID:
taskkill /PID <PID> /F
```

## 10. Demo Steps

### Student Flow
1. Open `http://localhost:5173`
2. Click **Register** → enter name, email, password → Submit
3. Login with the new credentials
4. Click **Add Achievement** in the sidebar
5. Fill in title, category, date, description
6. Upload a certificate file (PDF or image)
7. Click **Submit**
8. Navigate to **My Activities** → see the new activity with status **Pending**
9. Navigate to **Dashboard** → see updated counts
10. Navigate to **AI Score** → see computed score and recommendations

### Faculty Flow
1. Logout from student
2. Login as faculty: `fac_20260812235001@test.com` / `Test@123`
3. Dashboard shows pending count
4. Click **Pending Verification** in the sidebar
5. See the student's submitted achievement
6. Click **View Certificate** to download/view the uploaded file
7. Click **Approve** (or **Reject** with remarks)

### Verify Student Update
1. Logout from faculty
2. Login as the original student
3. Navigate to **My Activities** → status now shows **Verified**
4. Navigate to **Dashboard** → Verified count incremented
5. Navigate to **Reports** → verified activity appears in the log
6. Navigate to **AI Score** → score updated based on new verified achievement

---

**DEVELOPMENT STOPPED. PROJECT IS FROZEN AND READY FOR DEMO.**
