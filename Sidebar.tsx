'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap, LayoutDashboard, Users, UserCog, BookOpen, ClipboardList,
  BarChart2, Calendar, DollarSign, Bell, Library, Bus, FileText,
  Settings, LogOut, ChevronLeft, ChevronRight, Award, BookMarked,
  ClipboardCheck, Upload, TrendingUp, Home, X, Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/useAuth';
import type { UserRole } from '@/lib/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

const NAV_BY_ROLE: Record<UserRole, NavGroup[]> = {
  super_admin: [
    { items: [{ label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard }] },
    { title: 'Management', items: [
      { label: 'Students',      href: '/dashboard/admin/students',      icon: Users },
      { label: 'Teachers',      href: '/dashboard/admin/teachers',      icon: UserCog },
      { label: 'Classes',       href: '/dashboard/admin/classes',       icon: BookOpen },
    ]},
    { title: 'Academic', items: [
      { label: 'Homework',      href: '/dashboard/admin/homework',      icon: BookMarked },
      { label: 'Attendance',    href: '/dashboard/admin/attendance',    icon: ClipboardCheck },
      { label: 'Marks',         href: '/dashboard/admin/marks',         icon: Award },
      { label: 'Exams',         href: '/dashboard/admin/exams',         icon: ClipboardList },
      { label: 'Timetable',     href: '/dashboard/admin/timetable',     icon: Calendar },
    ]},
    { title: 'Operations', items: [
      { label: 'Fee Management', href: '/dashboard/admin/fees',         icon: DollarSign },
      { label: 'Library',        href: '/dashboard/admin/library',      icon: Library },
      { label: 'Transport',      href: '/dashboard/admin/transport',    icon: Bus },
      { label: 'Documents',      href: '/dashboard/admin/documents',    icon: FileText },
      { label: 'Announcements',  href: '/dashboard/admin/announcements',icon: Bell },
    ]},
    { title: 'Insights', items: [
      { label: 'Reports',       href: '/dashboard/admin/reports',       icon: BarChart2 },
    ]},
    { items: [{ label: 'Settings', href: '/dashboard/admin/settings',   icon: Settings }] },
  ],
  school_admin: [
    { items: [{ label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard }] },
    { title: 'Management', items: [
      { label: 'Students',      href: '/dashboard/admin/students',      icon: Users },
      { label: 'Teachers',      href: '/dashboard/admin/teachers',      icon: UserCog },
      { label: 'Classes',       href: '/dashboard/admin/classes',       icon: BookOpen },
    ]},
    { title: 'Academic', items: [
      { label: 'Homework',      href: '/dashboard/admin/homework',      icon: BookMarked },
      { label: 'Attendance',    href: '/dashboard/admin/attendance',    icon: ClipboardCheck },
      { label: 'Marks',         href: '/dashboard/admin/marks',         icon: Award },
      { label: 'Exams',         href: '/dashboard/admin/exams',         icon: ClipboardList },
      { label: 'Timetable',     href: '/dashboard/admin/timetable',     icon: Calendar },
    ]},
    { title: 'Operations', items: [
      { label: 'Fee Management', href: '/dashboard/admin/fees',         icon: DollarSign },
      { label: 'Library',        href: '/dashboard/admin/library',      icon: Library },
      { label: 'Transport',      href: '/dashboard/admin/transport',    icon: Bus },
      { label: 'Announcements',  href: '/dashboard/admin/announcements',icon: Bell },
    ]},
    { title: 'Insights', items: [
      { label: 'Reports',       href: '/dashboard/admin/reports',       icon: BarChart2 },
    ]},
  ],
  teacher: [
    { items: [{ label: 'Dashboard', href: '/dashboard/teacher', icon: LayoutDashboard }] },
    { title: 'Classroom', items: [
      { label: 'Attendance',    href: '/dashboard/teacher/attendance',  icon: ClipboardCheck },
      { label: 'Homework',      href: '/dashboard/teacher/homework',    icon: BookMarked },
      { label: 'Marks Entry',   href: '/dashboard/teacher/marks',       icon: Award },
      { label: 'Study Materials',href: '/dashboard/teacher/materials',  icon: Upload },
      { label: 'Timetable',     href: '/dashboard/teacher/timetable',   icon: Calendar },
    ]},
    { title: 'Communication', items: [
      { label: 'Announcements', href: '/dashboard/teacher/announcements',icon: Bell },
      { label: 'Reports',       href: '/dashboard/teacher/reports',     icon: BarChart2 },
    ]},
  ],
  student: [
    { items: [{ label: 'Dashboard', href: '/dashboard/student', icon: LayoutDashboard }] },
    { title: 'Academics', items: [
      { label: 'Homework',      href: '/dashboard/student/homework',    icon: BookMarked },
      { label: 'My Marks',      href: '/dashboard/student/marks',       icon: Award },
      { label: 'Attendance',    href: '/dashboard/student/attendance',  icon: ClipboardCheck },
      { label: 'Timetable',     href: '/dashboard/student/timetable',   icon: Calendar },
      { label: 'Study Materials',href: '/dashboard/student/materials',  icon: BookOpen },
      { label: 'Exams',         href: '/dashboard/student/exams',       icon: ClipboardList },
    ]},
    { title: 'Other', items: [
      { label: 'Fee Status',    href: '/dashboard/student/fees',        icon: DollarSign },
      { label: 'Notices',       href: '/dashboard/student/notices',     icon: Bell },
      { label: 'Documents',     href: '/dashboard/student/documents',   icon: FileText },
    ]},
  ],
  parent: [
    { items: [{ label: 'Dashboard', href: '/dashboard/parent', icon: LayoutDashboard }] },
    { title: "My Child's Info", items: [
      { label: 'Attendance',    href: '/dashboard/parent/attendance',   icon: ClipboardCheck },
      { label: 'Marks',         href: '/dashboard/parent/marks',        icon: TrendingUp },
      { label: 'Homework',      href: '/dashboard/parent/homework',     icon: BookMarked },
      { label: 'Fee Status',    href: '/dashboard/parent/fees',         icon: DollarSign },
    ]},
    { title: 'School', items: [
      { label: 'Notices',       href: '/dashboard/parent/notices',      icon: Bell },
      { label: 'Documents',     href: '/dashboard/parent/documents',    icon: FileText },
    ]},
  ],
};

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { profile, signOut, role } = useAuth();

  const navGroups = NAV_BY_ROLE[role ?? 'student'] ?? [];

  const isActive = (href: string) =>
    href === '/dashboard/admin' || href === '/dashboard/teacher' ||
    href === '/dashboard/student' || href === '/dashboard/parent'
      ? pathname === href
      : pathname.startsWith(href);

  const sidebarContent = (
    <div className={cn(
      'flex flex-col h-full transition-all duration-300 bg-slate-900',
      collapsed ? 'w-16' : 'w-64',
    )}>
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-slate-800 flex-shrink-0',
        collapsed ? 'justify-center' : 'justify-between',
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm truncate">EduManage</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
        )}
        {/* Desktop collapse button */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-800">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
        {/* Mobile close button */}
        <button onClick={onMobileClose}
          className="lg:hidden text-slate-500 hover:text-slate-300 transition-colors p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {navGroups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-4' : ''}>
            {group.title && !collapsed && (
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                {group.title}
              </div>
            )}
            {group.items.map(item => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} onClick={onMobileClose}
                  className={cn(
                    'sidebar-item',
                    active && 'active',
                    collapsed && 'justify-center px-2',
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && item.badge ? (
                    <span className="ml-auto bg-brand-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Profile & Logout */}
      <div className="flex-shrink-0 border-t border-slate-800 p-3 space-y-1">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-brand-600/30 flex items-center justify-center flex-shrink-0">
              <span className="text-brand-400 text-sm font-bold">
                {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">{profile?.full_name ?? 'User'}</div>
              <div className="text-xs text-slate-500 truncate capitalize">{profile?.role?.replace('_', ' ')}</div>
            </div>
          </div>
        )}
        <Link href="/" className={cn('sidebar-item', collapsed && 'justify-center px-2')}>
          <Home className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Home Page</span>}
        </Link>
        <button onClick={signOut}
          className={cn('sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10', collapsed && 'justify-center px-2')}>
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onMobileClose} />
      )}
      {/* Mobile sidebar */}
      <div className={cn(
        'fixed left-0 top-0 h-screen z-40 lg:hidden transition-transform duration-300',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
      )}>
        {sidebarContent}
      </div>
      {/* Desktop sidebar */}
      <div className="hidden lg:block flex-shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </div>
    </>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
      <Menu className="w-5 h-5" />
    </button>
  );
}
