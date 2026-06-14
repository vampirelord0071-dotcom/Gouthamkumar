# 🎓 EduManage — School Management System

A production-ready, full-stack school management system built with **Next.js 15**, **Supabase**, **TypeScript**, and **Tailwind CSS**.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

### 2. Clone & Install
```bash
git clone <your-repo>
cd school-mgmt
npm install
```

### 3. Set up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → New Query
3. Paste the entire contents of `supabase-schema.sql` and run it
4. Copy your project URL and anon key from **Settings → API**

### 4. Configure Environment
```bash
cp .env.local.example .env.local
```
Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SCHOOL_NAME="Greenwood International School"
```

### 5. Create Demo Users in Supabase Auth
Go to **Authentication → Users** in Supabase dashboard and create these users manually (or use the Supabase SQL editor):

```sql
-- After creating users via Auth UI, update their profiles:
UPDATE profiles SET role = 'super_admin'  WHERE email = 'superadmin@school.edu';
UPDATE profiles SET role = 'school_admin' WHERE email = 'admin@school.edu';
UPDATE profiles SET role = 'teacher'      WHERE email = 'teacher@school.edu';
UPDATE profiles SET role = 'student'      WHERE email = 'student@school.edu';
UPDATE profiles SET role = 'parent'       WHERE email = 'parent@school.edu';
```

### 6. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Tech Stack

| Layer       | Technology |
|-------------|------------|
| Framework   | Next.js 15 (App Router) |
| Language    | TypeScript |
| Styling     | Tailwind CSS |
| Database    | Supabase (PostgreSQL) |
| Auth        | Supabase Auth |
| Storage     | Supabase Storage |
| Charts      | Recharts |
| Forms       | React Hook Form + Zod |
| PDF Export  | jsPDF + AutoTable |
| Excel       | SheetJS (xlsx) |
| Theming     | next-themes (Dark/Light) |

---

## 👥 User Roles & Access

| Role | Email (Demo) | Dashboard |
|------|-------------|-----------|
| Super Admin  | superadmin@school.edu | Full system access |
| School Admin | admin@school.edu      | School management |
| Teacher      | teacher@school.edu    | Teaching tools |
| Student      | student@school.edu    | Personal data only |
| Parent       | parent@school.edu     | Child's data only |

---

## 📁 Project Structure

```
school-mgmt/
├── app/
│   ├── page.tsx                    # Public home page
│   ├── layout.tsx                  # Root layout
│   ├── auth/
│   │   ├── login/                  # Login page
│   │   └── forgot-password/        # Password reset
│   └── dashboard/
│       ├── admin/                  # Admin/Super Admin
│       │   ├── page.tsx            # Dashboard overview
│       │   ├── students/           # Student management
│       │   ├── teachers/           # Teacher management
│       │   ├── classes/            # Class & section management
│       │   ├── homework/           # Homework management
│       │   ├── marks/              # Marks & report cards
│       │   ├── attendance/         # Daily attendance
│       │   ├── fees/               # Fee management
│       │   ├── exams/              # Exam scheduling
│       │   ├── library/            # Library system
│       │   ├── transport/          # Bus routes
│       │   ├── timetable/          # Class timetables
│       │   ├── announcements/      # School announcements
│       │   └── reports/            # Analytics & reports
│       ├── teacher/                # Teacher dashboard
│       │   ├── page.tsx
│       │   ├── attendance/
│       │   ├── homework/
│       │   ├── marks/
│       │   └── materials/
│       ├── student/                # Student dashboard
│       │   └── page.tsx
│       └── parent/                 # Parent dashboard
│           └── page.tsx
├── components/
│   ├── ui/
│   │   ├── index.tsx               # StatCard, Modal, DataTable, Badge, etc.
│   │   └── ThemeProvider.tsx
│   └── layout/
│       ├── Sidebar.tsx             # Role-based navigation
│       ├── Topbar.tsx              # Header with notifications
│       └── DashboardLayout.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   └── server.ts               # Server-side client
│   ├── types/index.ts              # All TypeScript types
│   ├── utils/index.ts              # Helper functions
│   └── hooks/useAuth.tsx           # Auth context & hooks
├── middleware.ts                   # Route protection
├── supabase-schema.sql             # Complete DB schema + RLS
└── styles/globals.css              # Tailwind + custom classes
```

---

## ✨ Features

### 🏠 Public Homepage
- School info, principal's message, facilities
- Events calendar, achievements, contact info
- Admission information with Google Maps

### 🔐 Authentication
- Email/password login (Supabase Auth)
- Role-based redirect after login
- Forgot password via email link
- Protected routes via Next.js middleware

### 👨‍💼 Admin Panel
- **Students**: Add/edit/delete, bulk import, search, class assignment
- **Teachers**: Employee management, subject assignment
- **Classes**: 10 grades × 3 sections, room management
- **Homework**: Post to entire class, track submissions
- **Attendance**: Mark present/absent/late per section
- **Marks**: Enter scores, auto grade calculation, report cards
- **Fees**: Collection tracking, receipts, analytics
- **Exams**: Schedule creation, hall tickets, result publishing
- **Library**: Book catalog, issue/return tracking, fines
- **Transport**: Bus routes, driver details, stops
- **Timetable**: Visual weekly grid editor
- **Announcements**: Targeted to all/students/teachers/parents
- **Reports**: Attendance, academic, fee, student analytics

### 👩‍🏫 Teacher Dashboard
- Quick attendance marking
- Post homework per class
- Enter marks with auto grading
- Upload study materials

### 👨‍🎓 Student Dashboard
- View only **own** attendance, marks, homework
- Download report cards
- View timetable & notices
- Check fee status

### 👪 Parent Dashboard
- Monitor child's attendance & marks
- View fee status & notices
- See homework status

---

## 🔒 Security

- **Row-Level Security (RLS)** on all Supabase tables
- Students can ONLY read their own marks/attendance
- Parents can ONLY access their children's data
- Role-based route protection via middleware
- No direct table access without authentication

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```
Add environment variables in Vercel dashboard.

### Deploy to any Node.js host
```bash
npm run build
npm start
```

---

## 🔧 Configuration

### Add a Real School
1. Update `supabase-schema.sql` seed data with your school details
2. Change `NEXT_PUBLIC_SCHOOL_NAME` in `.env.local`
3. Update the homepage (`app/page.tsx`) with real content
4. Add your Google Maps embed in the Contact section

### Connect Real Email (for notifications)
Add to `.env.local`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-school@gmail.com
SMTP_PASS=your-app-password
```

### Supabase Storage (for file uploads)
1. Create a bucket named `school-files` in Supabase Storage
2. Set bucket to public or configure signed URLs
3. File upload code is ready — just plug in the bucket name

---

## 📊 Database

- **PostgreSQL** via Supabase
- **21 tables** with proper foreign keys
- **Row Level Security** on all sensitive tables
- **Indexes** on frequently queried columns
- **Triggers** for `updated_at` and auto-profile creation
- Designed to handle **10,000+ students** efficiently

---

## 📄 License

MIT — free to use and modify for your school.

---

**Built with ❤️ for school administrators, teachers, students, and parents.**
