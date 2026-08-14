import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AchievementProvider } from './context/AchievementContext'
import ProtectedRoute from './routes/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import { ROLE_DASHBOARD_PATH } from './utils/nav'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ResetPassword from './pages/auth/ResetPassword'

import StudentDashboard from './pages/student/Dashboard'
import AddAchievement from './pages/student/AddAchievement'
import MyActivities from './pages/student/MyActivities'
import AIScore from './pages/student/AIScore'
import StudentReports from './pages/student/Reports'
import StudentProfile from './pages/student/Profile'

import FacultyDashboard from './pages/faculty/Dashboard'
import PendingVerification from './pages/faculty/PendingVerification'
import VerifiedRecords from './pages/faculty/VerifiedRecords'
import FacultyReports from './pages/faculty/Reports'
import FacultyProfile from './pages/faculty/Profile'

import AdminDashboard from './pages/admin/Dashboard'
import ManageStudents from './pages/admin/ManageStudents'
import ManageActivities from './pages/admin/ManageActivities'
import Verifications from './pages/admin/Verifications'
import AdminReports from './pages/admin/Reports'
import Settings from './pages/admin/Settings'

import VerifyStudent from './pages/employer/VerifyStudent'
import VerifiedProfiles from './pages/employer/VerifiedProfiles'
import AboutEduTrack from './pages/employer/AboutEduTrack'
import RecruiterProfile from './pages/employer/Profile'

function RootRedirect() {
  const { role } = useAuth()
  return <Navigate to={role ? ROLE_DASHBOARD_PATH[role] : '/login'} replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Student */}
      <Route path="/student/dashboard" element={<ProtectedRoute allow={['student']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/add-achievement" element={<ProtectedRoute allow={['student']}><AddAchievement /></ProtectedRoute>} />
      <Route path="/student/my-activities" element={<ProtectedRoute allow={['student']}><MyActivities /></ProtectedRoute>} />
      <Route path="/student/ai-score" element={<ProtectedRoute allow={['student']}><AIScore /></ProtectedRoute>} />
      <Route path="/student/reports" element={<ProtectedRoute allow={['student']}><StudentReports /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute allow={['student']}><StudentProfile /></ProtectedRoute>} />

      {/* Faculty */}
      <Route path="/faculty/dashboard" element={<ProtectedRoute allow={['faculty']}><FacultyDashboard /></ProtectedRoute>} />
      <Route path="/faculty/pending-verification" element={<ProtectedRoute allow={['faculty']}><PendingVerification /></ProtectedRoute>} />
      <Route path="/faculty/verified-records" element={<ProtectedRoute allow={['faculty']}><VerifiedRecords /></ProtectedRoute>} />
      <Route path="/faculty/reports" element={<ProtectedRoute allow={['faculty']}><FacultyReports /></ProtectedRoute>} />
      <Route path="/faculty/profile" element={<ProtectedRoute allow={['faculty']}><FacultyProfile /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allow={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute allow={['admin']}><ManageStudents /></ProtectedRoute>} />
      <Route path="/admin/activities" element={<ProtectedRoute allow={['admin']}><ManageActivities /></ProtectedRoute>} />
      <Route path="/admin/verifications" element={<ProtectedRoute allow={['admin']}><Verifications /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allow={['admin']}><AdminReports /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allow={['admin']}><Settings /></ProtectedRoute>} />

      {/* Employer */}
      <Route path="/employer/verify-student" element={<ProtectedRoute allow={['employer']}><VerifyStudent /></ProtectedRoute>} />
      <Route path="/employer/verified-profiles" element={<ProtectedRoute allow={['employer']}><VerifiedProfiles /></ProtectedRoute>} />
      <Route path="/employer/about" element={<ProtectedRoute allow={['employer']}><AboutEduTrack /></ProtectedRoute>} />
      <Route path="/employer/profile" element={<ProtectedRoute allow={['employer']}><RecruiterProfile /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AchievementProvider>
            <AppRoutes />
          </AchievementProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
