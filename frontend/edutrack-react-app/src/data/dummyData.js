// Empty data source for EduTrack.
// This file keeps the frontend working until the backend is connected.

export const USERS = {
  student: {
    id: '',
    name: '',
    role: 'student',
    roleLabel: 'student',
    regNo: '',
    department: '',
    year: '',
    email: '',
    mobile: '',
    institution: '',
  },

  faculty: {
    id: '',
    name: '',
    role: 'faculty',
    roleLabel: 'faculty',
    facultyId: '',
    department: '',
    email: '',
  },

  admin: {
    id: '',
    name: '',
    role: 'admin',
    roleLabel: 'admin',
    email: '',
  },

  employer: {
    id: '',
    name: '',
    role: 'employer',
    roleLabel: 'employer',
    companyName: '',
    email: '',
    accessLevel: '',
  },
}

export const AVATAR_LETTER = (name) =>
  name?.trim()?.[0]?.toUpperCase() ?? '?'

// ---------------- STUDENT ----------------

export const ACHIEVEMENTS = []

export const STUDENT_STATS = {
  totalActivities: 0,
  verified: 0,
  pending: 0,
  rejected: 0,
  aiScore: 0,
}

export const PROGRESS_BY_CATEGORY = []

export const DASHBOARD_PROGRESS_BY_CATEGORY = []

export const RECOMMENDATIONS = []

// ---------------- FACULTY ----------------

export const FACULTY_STATS = {
  pendingReview: 0,
  verifiedToday: 0,
  rejected: 0,
  totalReviewed: 0,
}

export const PENDING_SUBMISSIONS = []

export const VERIFIED_RECORDS = []

export const DEPARTMENT_VERIFICATION_SUMMARY = []

export const REPORT_HISTORY = []

// ---------------- ADMIN ----------------

export const ADMIN_STATS = {
  totalStudents: 0,
  totalActivities: 0,
  verifiedRecords: 0,
  pendingVerification: 0,
}

export const DEPARTMENT_PARTICIPATION = []

export const ACTIVITY_BY_CATEGORY_ADMIN = []

export const MONTHLY_ACTIVITY_TREND = []

export const STUDENT_LIST = []

export const ALL_ACTIVITY_RECORDS = []

export const VERIFICATION_AUDIT = []

export const VERIFICATIONS_OVERVIEW_STATS = {
  pending: 0,
  approved: 0,
  rejected: 0,
}

// ---------------- EMPLOYER ----------------

export const VERIFIED_PROFILES = []

export const EMPLOYER_SEARCH_RESULT = null

export const REPORT_TYPES = []

export const DOWNLOADED_REPORTS = []