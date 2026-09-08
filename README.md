# EduTrack

EduTrack is a comprehensive full-stack institutional platform designed to track, verify, and score student academic and extracurricular achievements. It bridges the gap between students, faculty verifiers, administrators, and potential employers by providing a secure, reliable, and intelligent achievement record system.

## Key Features

- **Role-Based Access Control**: Secure workflows tailored for Students, Faculty, Administrators, and Employers.
- **Achievement Lifecycle Management**: Students can submit achievements, track statuses (Pending, Verified, Rejected), and view a complete audit history of remarks and resubmissions.
- **Faculty Verification Workflow**: Dedicated dashboards for faculty to review pending submissions, approve them, or reject them with specific remarks.
- **Intelligent AI Scoring**: Integrates a Python/FastAPI Machine Learning service using `scikit-learn` to automatically evaluate and score student activities.
- **Admin Command Center**: Real-time operational insights, bottleneck tracking, and comprehensive reporting.
- **Secure Document Viewer**: Embedded inline secure viewer for uploaded certificates and proof documents, avoiding pop-up blockers.
- **Modern UI/UX**: Built with React and Tailwind CSS, featuring light/dark mode support, skeleton loaders, toast notifications, and an Activity Center.

## Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Icons & Visualization**: Lucide React, Recharts
- **Routing**: React Router DOM

### Backend (Microservices)
- **Framework**: Java 17+, Spring Boot 3
- **Service Discovery**: Spring Cloud Netflix Eureka
- **API Gateway**: Spring Cloud Gateway
- **Security**: JWT Authentication (jjwt)
- **Database**: MongoDB (via Spring Data MongoDB)

### ML / AI Service
- **Framework**: Python, FastAPI, Uvicorn
- **Machine Learning**: scikit-learn, pandas, joblib

## Folder Structure Overview

```text
EduTrack/
├── backend/
│   ├── activity-service/    # Manages achievement submissions, lifecycles, and audit history
│   ├── api-gateway/         # Spring Cloud Gateway routing requests to respective microservices
│   ├── eureka-server/       # Service registry for microservice discovery
│   ├── ml-service/          # Python/FastAPI service for AI scoring of activities
│   └── user-service/        # Manages authentication, JWT generation, and user profiles
├── frontend/
│   └── edutrack-react-app/  # React/Vite SPA frontend application
├── database/                # Database related scripts/assets
├── docs/                    # Architecture diagrams and documentation
├── start-edutrack.bat       # One-click startup script for Windows
└── stop-edutrack.bat        # Safe shutdown script for all services
```

## Setup & Installation

### Prerequisites
- **Java 17+**
- **Node.js 18+**
- **Python 3.8+**
- **MongoDB** running locally on default port `27017`

### Windows One-Click Startup (Recommended)
If you are on Windows, you can launch the entire microservice stack and frontend automatically:
1. Ensure MongoDB is running (or installed in your PATH so it can be auto-started).
2. Double-click `start-edutrack.bat` in the root folder.
3. This will launch all microservices in order, wait for their ports, and finally open `http://localhost:5173` in your browser.

To safely shut down the services without killing your database, run `stop-edutrack.bat`.

### Manual Startup

1. **MongoDB**: Ensure MongoDB is running on `localhost:27017`.
2. **Eureka Server** (`8761`):
   ```bash
   cd backend/eureka-server
   ./mvnw spring-boot:run
   ```
3. **User Service** (`8081`):
   ```bash
   cd backend/user-service
   ./mvnw spring-boot:run
   ```
4. **Activity Service** (`8082`):
   ```bash
   cd backend/activity-service
   ./mvnw spring-boot:run
   ```
5. **ML Service** (`8000`):
   ```bash
   cd backend/ml-service
   pip install -r requirements.txt
   python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
6. **API Gateway** (`8080`):
   ```bash
   cd backend/api-gateway
   ./mvnw spring-boot:run
   ```
7. **Frontend** (`5173`):
   ```bash
   cd frontend/edutrack-react-app
   npm install
   npm run dev
   ```

## Screenshots
<img width="1917" height="1052" alt="Screenshot 2026-08-31 100055" src="https://github.com/user-attachments/assets/bb87b93b-72ae-4f4e-8e35-1f3d56e015c2" />

