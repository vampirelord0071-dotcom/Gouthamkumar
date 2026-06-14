-- ============================================================
-- GREENWOOD SCHOOL MANAGEMENT SYSTEM — SUPABASE SCHEMA
-- Run this in the Supabase SQL Editor (supabase.com/dashboard)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- 1. PROFILES (linked to Supabase Auth users)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  full_name     TEXT NOT NULL,
  phone         TEXT,
  avatar_url    TEXT,
  role          TEXT NOT NULL CHECK (role IN ('super_admin','school_admin','teacher','student','parent')),
  school_id     UUID,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 2. SCHOOLS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS schools (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                TEXT NOT NULL,
  short_name          TEXT NOT NULL,
  address             TEXT NOT NULL,
  city                TEXT NOT NULL,
  state               TEXT NOT NULL,
  pincode             TEXT,
  phone               TEXT,
  email               TEXT,
  website             TEXT,
  logo_url            TEXT,
  principal_name      TEXT,
  principal_message   TEXT,
  established_year    INTEGER,
  affiliation_board   TEXT DEFAULT 'CBSE',
  affiliation_number  TEXT,
  latitude            DECIMAL(10,8),
  longitude           DECIMAL(11,8),
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 3. ACADEMIC YEARS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS academic_years (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id   UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  is_current  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 4. CLASSES (Grade 1–10)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS classes (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id      UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  numeric_level  INTEGER NOT NULL CHECK (numeric_level BETWEEN 1 AND 12),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, numeric_level)
);

-- ─────────────────────────────────────────────────────────────
-- 5. SECTIONS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sections (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id          UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  school_id         UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  class_teacher_id  UUID REFERENCES profiles(id),
  room_number       TEXT,
  max_students      INTEGER DEFAULT 40,
  academic_year_id  UUID NOT NULL REFERENCES academic_years(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, name, academic_year_id)
);

-- ─────────────────────────────────────────────────────────────
-- 6. SUBJECTS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subjects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id   UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  code        TEXT NOT NULL,
  description TEXT,
  max_marks   INTEGER DEFAULT 100,
  is_optional BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, code)
);

-- ─────────────────────────────────────────────────────────────
-- 7. CLASS SUBJECTS (which subjects are taught in which class)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS class_subjects (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id          UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id        UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id        UUID REFERENCES profiles(id),
  periods_per_week  INTEGER DEFAULT 5,
  academic_year_id  UUID NOT NULL REFERENCES academic_years(id),
  UNIQUE(class_id, subject_id, academic_year_id)
);

-- ─────────────────────────────────────────────────────────────
-- 8. TEACHERS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teachers (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id         UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  profile_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  employee_id       TEXT NOT NULL,
  full_name         TEXT NOT NULL,
  date_of_birth     DATE,
  gender            TEXT CHECK (gender IN ('male','female','other')),
  blood_group       TEXT,
  address           TEXT,
  phone             TEXT,
  email             TEXT NOT NULL,
  qualification     TEXT,
  specialization    TEXT,
  experience_years  INTEGER DEFAULT 0,
  joining_date      DATE,
  employment_type   TEXT DEFAULT 'permanent' CHECK (employment_type IN ('permanent','contract','visiting')),
  salary            DECIMAL(12,2),
  profile_photo_url TEXT,
  aadhar_number     TEXT,
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, employee_id)
);

-- ─────────────────────────────────────────────────────────────
-- 9. STUDENTS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id            UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  profile_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id           TEXT NOT NULL,
  full_name            TEXT NOT NULL,
  date_of_birth        DATE NOT NULL,
  gender               TEXT NOT NULL CHECK (gender IN ('male','female','other')),
  blood_group          TEXT,
  address              TEXT,
  city                 TEXT,
  state                TEXT,
  pincode              TEXT,
  admission_date       DATE NOT NULL,
  admission_number     TEXT NOT NULL,
  current_class_id     UUID REFERENCES classes(id),
  current_section_id   UUID REFERENCES sections(id),
  academic_year_id     UUID NOT NULL REFERENCES academic_years(id),
  profile_photo_url    TEXT,
  aadhar_number        TEXT,
  nationality          TEXT DEFAULT 'Indian',
  religion             TEXT,
  category             TEXT,
  is_active            BOOLEAN DEFAULT TRUE,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, student_id)
);

-- ─────────────────────────────────────────────────────────────
-- 10. PARENTS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS parents (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  profile_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL,
  relation      TEXT NOT NULL CHECK (relation IN ('father','mother','guardian')),
  phone         TEXT NOT NULL,
  alternate_phone TEXT,
  email         TEXT,
  occupation    TEXT,
  annual_income DECIMAL(12,2),
  address       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_parents (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id  UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  parent_id   UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  is_primary  BOOLEAN DEFAULT TRUE,
  UNIQUE(student_id, parent_id)
);

-- ─────────────────────────────────────────────────────────────
-- 11. ATTENDANCE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id        UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id       UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  section_id       UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id),
  date             DATE NOT NULL,
  status           TEXT NOT NULL CHECK (status IN ('present','absent','late','half_day','leave')),
  remarks          TEXT,
  marked_by        UUID NOT NULL REFERENCES profiles(id),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_section ON attendance(section_id, date);

-- ─────────────────────────────────────────────────────────────
-- 12. HOMEWORK
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS homework (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id        UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id       UUID NOT NULL REFERENCES profiles(id),
  class_id         UUID NOT NULL REFERENCES classes(id),
  section_id       UUID REFERENCES sections(id),   -- NULL = all sections
  subject_id       UUID NOT NULL REFERENCES subjects(id),
  academic_year_id UUID NOT NULL REFERENCES academic_years(id),
  title            TEXT NOT NULL,
  description      TEXT,
  due_date         DATE NOT NULL,
  is_active        BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS homework_attachments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homework_id UUID NOT NULL REFERENCES homework(id) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  file_type   TEXT,
  file_size   INTEGER
);

CREATE TABLE IF NOT EXISTS homework_submissions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homework_id UUID NOT NULL REFERENCES homework(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  file_url    TEXT,
  remarks     TEXT,
  grade       TEXT,
  status      TEXT DEFAULT 'submitted' CHECK (status IN ('submitted','graded','late')),
  UNIQUE(homework_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_homework_class ON homework(class_id);
CREATE INDEX IF NOT EXISTS idx_homework_due ON homework(due_date);

-- ─────────────────────────────────────────────────────────────
-- 13. EXAMS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exams (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id        UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id),
  name             TEXT NOT NULL,
  exam_type        TEXT NOT NULL,
  start_date       DATE NOT NULL,
  end_date         DATE NOT NULL,
  is_active        BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_schedules (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id       UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  class_id      UUID NOT NULL REFERENCES classes(id),
  subject_id    UUID NOT NULL REFERENCES subjects(id),
  exam_date     DATE NOT NULL,
  start_time    TIME NOT NULL,
  end_time      TIME NOT NULL,
  hall_number   TEXT,
  max_marks     INTEGER DEFAULT 100,
  passing_marks INTEGER DEFAULT 33
);

-- ─────────────────────────────────────────────────────────────
-- 14. MARKS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS marks (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id        UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  exam_id          UUID NOT NULL REFERENCES exams(id),
  student_id       UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id       UUID NOT NULL REFERENCES subjects(id),
  class_id         UUID NOT NULL REFERENCES classes(id),
  section_id       UUID NOT NULL REFERENCES sections(id),
  academic_year_id UUID NOT NULL REFERENCES academic_years(id),
  marks_obtained   DECIMAL(6,2) NOT NULL DEFAULT 0,
  max_marks        INTEGER NOT NULL DEFAULT 100,
  grade            TEXT,
  is_absent        BOOLEAN DEFAULT FALSE,
  remarks          TEXT,
  entered_by       UUID NOT NULL REFERENCES profiles(id),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(exam_id, student_id, subject_id)
);

CREATE INDEX IF NOT EXISTS idx_marks_student ON marks(student_id);
CREATE INDEX IF NOT EXISTS idx_marks_exam ON marks(exam_id);

-- ─────────────────────────────────────────────────────────────
-- 15. FEES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fee_categories (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id    UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  is_mandatory BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS fee_structures (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id        UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id),
  class_id         UUID NOT NULL REFERENCES classes(id),
  fee_category_id  UUID NOT NULL REFERENCES fee_categories(id),
  amount           DECIMAL(10,2) NOT NULL,
  due_date         DATE NOT NULL,
  installments     INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS fee_payments (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id        UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id       UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  fee_structure_id UUID NOT NULL REFERENCES fee_structures(id),
  academic_year_id UUID NOT NULL REFERENCES academic_years(id),
  amount_paid      DECIMAL(10,2) NOT NULL,
  payment_date     DATE NOT NULL,
  payment_method   TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash','online','cheque','dd')),
  transaction_id   TEXT,
  receipt_number   TEXT NOT NULL UNIQUE,
  status           TEXT DEFAULT 'paid' CHECK (status IN ('paid','partial','pending','overdue')),
  remarks          TEXT,
  collected_by     UUID NOT NULL REFERENCES profiles(id),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fee_payments_student ON fee_payments(student_id);

-- ─────────────────────────────────────────────────────────────
-- 16. TIMETABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS time_slots (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id   UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  slot_number INTEGER NOT NULL,
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  is_break    BOOLEAN DEFAULT FALSE,
  break_name  TEXT,
  UNIQUE(school_id, slot_number)
);

CREATE TABLE IF NOT EXISTS timetable_entries (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id        UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  section_id       UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  subject_id       UUID NOT NULL REFERENCES subjects(id),
  teacher_id       UUID NOT NULL REFERENCES profiles(id),
  time_slot_id     UUID NOT NULL REFERENCES time_slots(id),
  day_of_week      TEXT NOT NULL CHECK (day_of_week IN ('monday','tuesday','wednesday','thursday','friday','saturday')),
  academic_year_id UUID NOT NULL REFERENCES academic_years(id),
  room_number      TEXT,
  UNIQUE(section_id, time_slot_id, day_of_week, academic_year_id)
);

-- ─────────────────────────────────────────────────────────────
-- 17. ANNOUNCEMENTS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS announcements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  content         TEXT NOT NULL,
  target          TEXT NOT NULL DEFAULT 'all' CHECK (target IN ('all','students','teachers','parents','class')),
  target_class_id UUID REFERENCES classes(id),
  priority        TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  published_by    UUID NOT NULL REFERENCES profiles(id),
  is_published    BOOLEAN DEFAULT TRUE,
  publish_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date     DATE,
  attachment_url  TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 18. LIBRARY
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS books (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id        UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  author           TEXT NOT NULL,
  isbn             TEXT,
  publisher        TEXT,
  edition          TEXT,
  category         TEXT,
  total_copies     INTEGER DEFAULT 1,
  available_copies INTEGER DEFAULT 1,
  rack_number      TEXT,
  cover_url        TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS book_issues (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  book_id       UUID NOT NULL REFERENCES books(id),
  student_id    UUID NOT NULL REFERENCES students(id),
  issued_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date      DATE NOT NULL,
  returned_date DATE,
  fine_amount   DECIMAL(8,2) DEFAULT 0,
  fine_paid     BOOLEAN DEFAULT FALSE,
  status        TEXT DEFAULT 'issued' CHECK (status IN ('issued','returned','overdue'))
);

-- ─────────────────────────────────────────────────────────────
-- 19. TRANSPORT
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bus_routes (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id      UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  route_name     TEXT NOT NULL,
  route_number   TEXT,
  driver_name    TEXT NOT NULL,
  driver_phone   TEXT NOT NULL,
  conductor_name TEXT,
  vehicle_number TEXT NOT NULL,
  capacity       INTEGER DEFAULT 40,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS route_stops (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id   UUID NOT NULL REFERENCES bus_routes(id) ON DELETE CASCADE,
  stop_name  TEXT NOT NULL,
  pickup_time TIME,
  drop_time  TIME,
  sequence   INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS student_transport (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id       UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  route_id         UUID NOT NULL REFERENCES bus_routes(id),
  stop_id          UUID NOT NULL REFERENCES route_stops(id),
  academic_year_id UUID NOT NULL REFERENCES academic_years(id),
  UNIQUE(student_id, academic_year_id)
);

-- ─────────────────────────────────────────────────────────────
-- 20. STUDY MATERIALS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS study_materials (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id        UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id       UUID NOT NULL REFERENCES profiles(id),
  class_id         UUID NOT NULL REFERENCES classes(id),
  section_id       UUID REFERENCES sections(id),
  subject_id       UUID NOT NULL REFERENCES subjects(id),
  academic_year_id UUID NOT NULL REFERENCES academic_years(id),
  title            TEXT NOT NULL,
  description      TEXT,
  file_url         TEXT NOT NULL,
  file_name        TEXT NOT NULL,
  file_type        TEXT,
  file_size        INTEGER,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 21. NOTIFICATIONS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  type       TEXT DEFAULT 'general',
  is_read    BOOLEAN DEFAULT FALSE,
  link       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY POLICIES
-- ─────────────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE students           ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers           ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents            ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance         ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework           ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks              ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials    ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_issues        ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user's role
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper function: get current user's school_id
CREATE OR REPLACE FUNCTION get_my_school_id()
RETURNS UUID AS $$
  SELECT school_id FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper function: get current user's profile_id
CREATE OR REPLACE FUNCTION get_my_profile_id()
RETURNS UUID AS $$
  SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ── PROFILES ──
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR get_my_role() IN ('super_admin','school_admin'));

CREATE POLICY "profiles_update" ON profiles FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR get_my_role() IN ('super_admin','school_admin'));

CREATE POLICY "profiles_insert" ON profiles FOR INSERT TO authenticated
  WITH CHECK (get_my_role() IN ('super_admin','school_admin'));

-- ── STUDENTS ──
CREATE POLICY "students_admin_all" ON students FOR ALL TO authenticated
  USING (get_my_role() IN ('super_admin','school_admin') AND school_id = get_my_school_id());

CREATE POLICY "students_teacher_read" ON students FOR SELECT TO authenticated
  USING (get_my_role() = 'teacher' AND school_id = get_my_school_id());

-- Students can only see their own record
CREATE POLICY "students_own_record" ON students FOR SELECT TO authenticated
  USING (get_my_role() = 'student' AND profile_id = get_my_profile_id());

-- Parents can see their children's records
CREATE POLICY "students_parent_read" ON students FOR SELECT TO authenticated
  USING (
    get_my_role() = 'parent' AND
    id IN (
      SELECT student_id FROM student_parents sp
      JOIN parents p ON p.id = sp.parent_id
      WHERE p.profile_id = get_my_profile_id()
    )
  );

-- ── ATTENDANCE ──
CREATE POLICY "attendance_admin_all" ON attendance FOR ALL TO authenticated
  USING (get_my_role() IN ('super_admin','school_admin') AND school_id = get_my_school_id());

CREATE POLICY "attendance_teacher_manage" ON attendance FOR ALL TO authenticated
  USING (get_my_role() = 'teacher' AND school_id = get_my_school_id());

-- Students see only their own attendance
CREATE POLICY "attendance_student_own" ON attendance FOR SELECT TO authenticated
  USING (
    get_my_role() = 'student' AND
    student_id IN (SELECT id FROM students WHERE profile_id = get_my_profile_id())
  );

-- Parents see their children's attendance
CREATE POLICY "attendance_parent_read" ON attendance FOR SELECT TO authenticated
  USING (
    get_my_role() = 'parent' AND
    student_id IN (
      SELECT sp.student_id FROM student_parents sp
      JOIN parents p ON p.id = sp.parent_id
      WHERE p.profile_id = get_my_profile_id()
    )
  );

-- ── MARKS ──
CREATE POLICY "marks_admin_all" ON marks FOR ALL TO authenticated
  USING (get_my_role() IN ('super_admin','school_admin') AND school_id = get_my_school_id());

CREATE POLICY "marks_teacher_manage" ON marks FOR ALL TO authenticated
  USING (get_my_role() = 'teacher' AND school_id = get_my_school_id());

-- CRITICAL: Students can only see their OWN marks
CREATE POLICY "marks_student_own" ON marks FOR SELECT TO authenticated
  USING (
    get_my_role() = 'student' AND
    student_id IN (SELECT id FROM students WHERE profile_id = get_my_profile_id())
  );

-- Parents can see their children's marks
CREATE POLICY "marks_parent_read" ON marks FOR SELECT TO authenticated
  USING (
    get_my_role() = 'parent' AND
    student_id IN (
      SELECT sp.student_id FROM student_parents sp
      JOIN parents p ON p.id = sp.parent_id
      WHERE p.profile_id = get_my_profile_id()
    )
  );

-- ── HOMEWORK ──
CREATE POLICY "homework_admin_all" ON homework FOR ALL TO authenticated
  USING (get_my_role() IN ('super_admin','school_admin') AND school_id = get_my_school_id());

CREATE POLICY "homework_teacher_manage" ON homework FOR ALL TO authenticated
  USING (get_my_role() = 'teacher' AND teacher_id = get_my_profile_id());

-- Students see homework for their class
CREATE POLICY "homework_student_read" ON homework FOR SELECT TO authenticated
  USING (
    get_my_role() = 'student' AND
    class_id IN (SELECT current_class_id FROM students WHERE profile_id = get_my_profile_id())
  );

-- Parents see homework for their children's class
CREATE POLICY "homework_parent_read" ON homework FOR SELECT TO authenticated
  USING (get_my_role() = 'parent' AND school_id = get_my_school_id());

-- ── ANNOUNCEMENTS ──
CREATE POLICY "announcements_admin_all" ON announcements FOR ALL TO authenticated
  USING (get_my_role() IN ('super_admin','school_admin') AND school_id = get_my_school_id());

CREATE POLICY "announcements_teacher_manage" ON announcements FOR ALL TO authenticated
  USING (get_my_role() = 'teacher' AND (target IN ('all','teachers') OR published_by = get_my_profile_id()));

CREATE POLICY "announcements_read_targeted" ON announcements FOR SELECT TO authenticated
  USING (
    is_published = TRUE AND school_id = get_my_school_id() AND (
      target = 'all' OR
      (target = 'students' AND get_my_role() = 'student') OR
      (target = 'teachers' AND get_my_role() = 'teacher') OR
      (target = 'parents'  AND get_my_role() = 'parent')
    )
  );

-- ── FEE PAYMENTS ──
CREATE POLICY "fees_admin_all" ON fee_payments FOR ALL TO authenticated
  USING (get_my_role() IN ('super_admin','school_admin') AND school_id = get_my_school_id());

CREATE POLICY "fees_student_own" ON fee_payments FOR SELECT TO authenticated
  USING (
    get_my_role() = 'student' AND
    student_id IN (SELECT id FROM students WHERE profile_id = get_my_profile_id())
  );

CREATE POLICY "fees_parent_read" ON fee_payments FOR SELECT TO authenticated
  USING (
    get_my_role() = 'parent' AND
    student_id IN (
      SELECT sp.student_id FROM student_parents sp
      JOIN parents p ON p.id = sp.parent_id
      WHERE p.profile_id = get_my_profile_id()
    )
  );

-- ── STUDY MATERIALS ──
CREATE POLICY "materials_teacher_manage" ON study_materials FOR ALL TO authenticated
  USING (get_my_role() IN ('super_admin','school_admin','teacher') AND school_id = get_my_school_id());

CREATE POLICY "materials_student_read" ON study_materials FOR SELECT TO authenticated
  USING (
    get_my_role() = 'student' AND
    class_id IN (SELECT current_class_id FROM students WHERE profile_id = get_my_profile_id())
  );

-- ── NOTIFICATIONS ──
CREATE POLICY "notifications_own" ON notifications FOR ALL TO authenticated
  USING (user_id = get_my_profile_id());

-- ─────────────────────────────────────────────────────────────
-- TRIGGERS: auto-update updated_at
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles  BEFORE UPDATE ON profiles  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_students  BEFORE UPDATE ON students  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_teachers  BEFORE UPDATE ON teachers  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_marks     BEFORE UPDATE ON marks     FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────────────────
-- TRIGGER: auto-create profile on signup
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- SEED DATA: Demo school
-- ─────────────────────────────────────────────────────────────
INSERT INTO schools (id, name, short_name, address, city, state, pincode, phone, email, principal_name, established_year, affiliation_board)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Greenwood International School',
  'GIS',
  '123 Greenwood Avenue, Education City',
  'New Delhi',
  'Delhi',
  '110001',
  '+91-11-23456789',
  'info@greenwoodschool.edu.in',
  'Dr. Rajesh Kumar',
  1985,
  'CBSE'
) ON CONFLICT DO NOTHING;

-- Seed academic year
INSERT INTO academic_years (id, school_id, name, start_date, end_date, is_current)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  '2025-26',
  '2025-04-01',
  '2026-03-31',
  TRUE
) ON CONFLICT DO NOTHING;

-- Seed classes 1-10
DO $$
DECLARE i INT;
BEGIN
  FOR i IN 1..10 LOOP
    INSERT INTO classes (school_id, name, numeric_level)
    VALUES ('a0000000-0000-0000-0000-000000000001', 'Class ' || i, i)
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;
