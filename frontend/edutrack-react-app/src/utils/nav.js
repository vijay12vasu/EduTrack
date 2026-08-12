import {
  LayoutDashboard,
  PlusCircle,
  ListChecks,
  Sparkles,
  FileText,
  User,
  ClipboardCheck,
  ShieldCheck,
  Users,
  Activity,
  CheckCircle2,
  Settings,
  Search,
  Building2,
} from 'lucide-react'

export const NAV_BY_ROLE = {
  student: [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/add-achievement', label: 'Add Achievement', icon: PlusCircle },
    { to: '/student/my-activities', label: 'My Activities', icon: ListChecks },
    { to: '/student/ai-score', label: 'AI Score', icon: Sparkles },
    { to: '/student/reports', label: 'Reports', icon: FileText },
    { to: '/student/profile', label: 'Profile', icon: User },
  ],
  faculty: [
    { to: '/faculty/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/faculty/pending-verification', label: 'Pending Verification', icon: ClipboardCheck },
    { to: '/faculty/verified-records', label: 'Verified Records', icon: ShieldCheck },
    { to: '/faculty/reports', label: 'Reports', icon: FileText },
    { to: '/faculty/profile', label: 'Profile', icon: User },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/students', label: 'Students', icon: Users },
    { to: '/admin/activities', label: 'Activities', icon: Activity },
    { to: '/admin/verifications', label: 'Verifications', icon: CheckCircle2 },
    { to: '/admin/reports', label: 'Reports', icon: FileText },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ],
  employer: [
    { to: '/employer/verify-student', label: 'Verify Student', icon: Search },
    { to: '/employer/verified-profiles', label: 'Verified Profiles', icon: ShieldCheck },
    { to: '/employer/about', label: 'About EduTrack', icon: Building2 },
    { to: '/employer/profile', label: 'Profile', icon: User },
  ],
}

export const ROLE_DASHBOARD_PATH = {
  student: '/student/dashboard',
  faculty: '/faculty/dashboard',
  admin: '/admin/dashboard',
  employer: '/employer/verify-student',
}
