# EduTrack — Student Achievement Management Platform

A production-structured React + Vite + Tailwind CSS implementation of the EduTrack
Figma design (27 screens, 4 roles), built with reusable components, client-side
routing, and dummy data so every screen is explorable end to end.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview   # serve the production build locally
```

## Logging in (demo auth)

There is no backend, so the design's login screen doubles as a lightweight role
switcher. The dashboard you land on is inferred from the **email** you type —
any password works:

| Email contains        | Signs in as |
|------------------------|-------------|
| `admin`                | Admin       |
| `faculty` / `staff`    | Faculty     |
| `employer` / `recruit` / `hr@` | Employer |
| anything else          | Student     |

Example: `admin@edutrack.com`, `faculty@edutrack.com`, `hr@abctech.com`, or just
`vijay@example.com` for the student view.

## Project structure

```
src/
  components/
    ui/          Reusable primitives: Button, Card, Input/Textarea, Badge,
                  Modal, ProgressBar, StatCard, Table
    layout/       Logo, Sidebar (role-aware nav + logout modal), Topbar, UserCard
  layouts/
    DashboardLayout.jsx   Sidebar + Topbar shell shared by every authenticated page
  pages/
    auth/         Login, ResetPassword
    student/      Dashboard, AddAchievement, MyActivities, AIScore, Reports, Profile
    faculty/      Dashboard, PendingVerification, VerifiedRecords, Reports, Profile
    admin/        Dashboard, ManageStudents, ManageActivities, Verifications,
                  Reports, Settings
    employer/     VerifyStudent, VerifiedProfiles, AboutEduTrack, Profile
  context/
    AuthContext.jsx   Simulated role-based auth (see table above)
  routes/
    ProtectedRoute.jsx   Redirects to /login when unauthenticated or wrong role
  data/
    dummyData.js   Single source of truth for all demo data (users, achievements,
                  stats, chart data) used across every dashboard
  utils/
    nav.js         Per-role sidebar navigation config + dashboard landing paths
```

## Design notes

- Colors were sampled directly from the Figma export and matched almost exactly
  to Tailwind's default palette (`blue-600` primary, `green-600` verified,
  `amber-500` pending, `red-600` rejected, `violet-600` / `cyan-500` for chart
  accents). These are wired into `tailwind.config.js` under `theme.colors.brand`
  and used throughout via standard Tailwind utility classes.
- Typography uses **Inter** (loaded via Google Fonts in `src/index.css`). The
  source PDF's fonts were outlined/subset (no font name embedded), so Inter was
  chosen as the closest match to the geometric sans-serif used in the design —
  swap it in `index.css` / `tailwind.config.js` if you have the exact family.
- Layout spacing, card radii (`rounded-2xl`), shadows, and the sidebar/topbar
  composition follow the Figma screens as closely as pixel-sampling and visual
  inspection allowed.
- The "Confirm Logout" modal is implemented once (in `Sidebar.jsx`) and reused
  across all four roles, matching the repeated pattern in the Figma file.
- Tables, status badges, progress bars, and stat cards are all shared
  components driven by props/data, not duplicated per page.

## Tech stack

- React 19 + Vite
- Tailwind CSS 3
- React Router 7 (role-protected routes)
- lucide-react (icons)
- recharts (Monthly Activity Trend bar chart on the Admin dashboard)
