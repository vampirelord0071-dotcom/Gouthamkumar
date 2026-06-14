'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard, Badge, Tabs, Modal, Select } from '@/components/ui';
import {
  ClipboardCheck, BookMarked, Award, Users, Calendar,
  Plus, CheckCircle2, Clock, Bell, ChevronRight, TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { formatDate, CLASSES, SECTIONS } from '@/lib/utils';
import toast from 'react-hot-toast';

const MY_CLASSES = [
  { id:'c1', name:'Class 6A', students:35, subject:'Mathematics',   period:'8:00–8:45'  },
  { id:'c2', name:'Class 7B', students:33, subject:'Mathematics',   period:'9:30–10:15' },
  { id:'c3', name:'Class 8A', students:36, subject:'Mathematics',   period:'11:15–12:00'},
  { id:'c4', name:'Class 9A', students:34, subject:'Mathematics',   period:'1:30–2:15'  },
];

const PENDING_MARKS = [
  { class:'Class 6A', subject:'Mathematics', exam:'Unit Test 1', submitted:20, total:35 },
  { class:'Class 8A', subject:'Mathematics', exam:'Mid Term',    submitted:36, total:36 },
];

const RECENT_HW = [
  { title:'Chapter 5 — Quadratic Equations', class:'Class 8A', due:'2025-07-16', submissions:28, total:36 },
  { title:'Algebra Practice Sheet',          class:'Class 6A', due:'2025-07-17', submissions:30, total:35 },
  { title:'Trigonometry Problems',           class:'Class 9A', due:'2025-07-18', submissions:15, total:34 },
];

type AttendanceStatus = 'present' | 'absent' | 'late';
const QUICK_STUDENTS = Array.from({ length: 12 }, (_, i) => ({
  id: `s${i+1}`,
  name: ['Arjun Sharma','Priya Patel','Rohan Gupta','Ananya Singh','Karthik Nair',
         'Meera Iyer','Vikram Kumar','Sneha Reddy','Aditya Joshi','Pooja Mehta','Rahul V.','Kavya K.'][i],
}));

export default function TeacherDashboard() {
  const [tab, setTab]                     = useState('overview');
  const [attendClass, setAttendClass]     = useState('6');
  const [attendSection, setAttendSection] = useState('A');
  const [statuses, setStatuses]           = useState<Record<string, AttendanceStatus>>(
    Object.fromEntries(QUICK_STUDENTS.map(s => [s.id, 'present' as AttendanceStatus]))
  );
  const [saved, setSaved] = useState(false);

  const handleSaveAttend = async () => {
    await new Promise(r => setTimeout(r, 600));
    setSaved(true);
    toast.success(`Attendance saved for Class ${attendClass}${attendSection}!`);
  };

  const present = Object.values(statuses).filter(s => s === 'present').length;
  const absent  = Object.values(statuses).filter(s => s === 'absent').length;

  return (
    <DashboardLayout title="Teacher Dashboard">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 60%)' }} />
        <div className="relative">
          <p className="text-emerald-200 text-sm mb-1">Welcome back,</p>
          <h2 className="text-2xl font-bold">Ms. Priya Sharma</h2>
          <p className="text-emerald-200 text-sm mt-1">Mathematics Teacher · Class Teacher — 8A</p>
          <div className="flex gap-4 mt-4">
            <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
              <div className="text-lg font-bold">{MY_CLASSES.length}</div>
              <div className="text-xs text-emerald-200">Classes Today</div>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
              <div className="text-lg font-bold">{MY_CLASSES.reduce((s,c) => s+c.students, 0)}</div>
              <div className="text-xs text-emerald-200">Total Students</div>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
              <div className="text-lg font-bold">3</div>
              <div className="text-xs text-emerald-200">HW Due Soon</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Students (Total)" value={MY_CLASSES.reduce((s,c)=>s+c.students,0)} icon={Users}          color="brand"   />
        <StatCard title="Attendance Today" value={`${present}/${QUICK_STUDENTS.length}`}    icon={ClipboardCheck} color="emerald" />
        <StatCard title="Marks Pending"    value={PENDING_MARKS.filter(m=>m.submitted<m.total).length} icon={Award} color="amber" />
        <StatCard title="Homework Active"  value={RECENT_HW.length}                          icon={BookMarked}     color="purple"  />
      </div>

      <Tabs tabs={[
        { id:'overview',    label:'Overview' },
        { id:'attendance',  label:'Quick Attendance' },
        { id:'homework',    label:'Homework' },
        { id:'marks',       label:'Marks Status' },
      ]} active={tab} onChange={setTab} />

      <div className="mt-5 space-y-5">

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Today's classes */}
            <div className="card p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                Today's Classes
                <span className="badge badge-success">Active</span>
              </h3>
              <div className="space-y-3">
                {MY_CLASSES.map((cls, i) => (
                  <div key={cls.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                    <div className="bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 rounded-lg px-2 py-1 text-xs font-mono min-w-20 text-center">
                      {cls.period}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{cls.name}</div>
                      <div className="text-xs text-slate-400">{cls.subject} · {cls.students} students</div>
                    </div>
                    {i === 0 && <Badge variant="success">Now</Badge>}
                    {i === 1 && <Badge variant="warning">Next</Badge>}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="card p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label:'Mark Attendance', href:'/dashboard/teacher/attendance', icon:ClipboardCheck, color:'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' },
                  { label:'Post Homework',   href:'/dashboard/teacher/homework',   icon:BookMarked,     color:'bg-brand-100 dark:bg-brand-900/30 text-brand-600' },
                  { label:'Enter Marks',     href:'/dashboard/teacher/marks',      icon:Award,          color:'bg-amber-100 dark:bg-amber-900/30 text-amber-600' },
                  { label:'Study Materials', href:'/dashboard/teacher/materials',  icon:Users,          color:'bg-purple-100 dark:bg-purple-900/30 text-purple-600' },
                  { label:'Announcements',   href:'/dashboard/teacher/announcements',icon:Bell,         color:'bg-rose-100 dark:bg-rose-900/30 text-rose-600' },
                  { label:'View Reports',    href:'/dashboard/teacher/reports',    icon:TrendingUp,     color:'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600' },
                ].map(a => (
                  <Link key={a.label} href={a.href}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all group">
                    <div className={`w-8 h-8 rounded-lg ${a.color} flex items-center justify-center flex-shrink-0`}>
                      <a.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* HW summary */}
            <div className="card p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                Recent Homework
                <Link href="/dashboard/teacher/homework" className="text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1 hover:underline">View all <ChevronRight className="w-3 h-3" /></Link>
              </h3>
              <div className="space-y-3">
                {RECENT_HW.map(hw => {
                  const pct = Math.round((hw.submissions / hw.total) * 100);
                  return (
                    <div key={hw.title} className="flex items-start gap-3">
                      <BookMarked className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{hw.title}</div>
                        <div className="text-xs text-slate-400">{hw.class} · Due {formatDate(hw.due)}</div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div className={`h-full rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-slate-500">{hw.submissions}/{hw.total}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Marks status */}
            <div className="card p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Marks Entry Status</h3>
              <div className="space-y-3">
                {PENDING_MARKS.map(m => {
                  const done = m.submitted === m.total;
                  return (
                    <div key={m.class+m.exam} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                        {done ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-amber-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{m.class} — {m.exam}</div>
                        <div className="text-xs text-slate-400">{m.submitted}/{m.total} students entered</div>
                      </div>
                      {!done && (
                        <Link href="/dashboard/teacher/marks" className="btn-primary btn-sm text-xs px-3">Enter</Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── QUICK ATTENDANCE ── */}
        {tab === 'attendance' && (
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-3 items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Quick Attendance</h3>
                <p className="text-xs text-slate-500 mt-0.5">{formatDate(new Date(), 'long')} · {present} present, {absent} absent</p>
              </div>
              <div className="flex gap-3">
                <Select value={attendClass} onChange={v => { setAttendClass(v); setSaved(false); }}
                  options={CLASSES.map(c => ({ value: c.value, label: c.label }))} className="w-32 h-10" />
                <Select value={attendSection} onChange={v => { setAttendSection(v); setSaved(false); }}
                  options={SECTIONS.map(s => ({ value: s, label: `Section ${s}` }))} className="w-32 h-10" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4">
              {QUICK_STUDENTS.map(student => (
                <div key={student.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
                  <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg mx-auto mb-2 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">
                    {student.name[0]}
                  </div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 truncate">{student.name.split(' ')[0]}</div>
                  <div className="flex gap-1 justify-center">
                    {(['present','absent','late'] as AttendanceStatus[]).map(s => (
                      <button key={s} onClick={() => { setStatuses(p => ({ ...p, [student.id]: s })); setSaved(false); }}
                        className={`w-7 h-7 rounded-md text-xs font-bold transition-all ${
                          statuses[student.id] === s
                            ? s === 'present' ? 'bg-emerald-500 text-white' : s === 'absent' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}>
                        {s[0].toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button onClick={handleSaveAttend} disabled={saved}
                className={`btn btn-md px-8 ${saved ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'btn-primary'}`}>
                {saved ? '✓ Saved' : 'Save Attendance'}
              </button>
            </div>
          </div>
        )}

        {/* ── HOMEWORK ── */}
        {tab === 'homework' && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <Link href="/dashboard/teacher/homework" className="btn-primary btn-md">
                <Plus className="w-4 h-4" /> Post Homework
              </Link>
            </div>
            {RECENT_HW.map(hw => {
              const pct = Math.round((hw.submissions / hw.total) * 100);
              return (
                <div key={hw.title} className="card p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookMarked className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-white">{hw.title}</div>
                    <div className="text-sm text-slate-500 mt-0.5">{hw.class} · Due {formatDate(hw.due)}</div>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div className={`h-full rounded-full ${pct >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-sm text-slate-500">{hw.submissions}/{hw.total} submitted ({pct}%)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── MARKS ── */}
        {tab === 'marks' && (
          <div className="space-y-3">
            {PENDING_MARKS.map(m => {
              const done = m.submitted === m.total;
              const pct  = Math.round((m.submitted / m.total) * 100);
              return (
                <div key={m.class+m.exam} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">{m.class} — {m.exam}</div>
                      <div className="text-sm text-slate-500">{m.subject}</div>
                    </div>
                    <Badge variant={done ? 'success' : 'warning'}>{done ? 'Complete' : 'In Progress'}</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className={`h-full rounded-full ${done ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm text-slate-500">{m.submitted}/{m.total} ({pct}%)</span>
                    {!done && <Link href="/dashboard/teacher/marks" className="btn-primary btn-sm text-xs px-3">Enter Marks</Link>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
