'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Sun, Moon, ChevronDown, Settings, LogOut, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/lib/hooks/useAuth';
import { MobileMenuButton } from './Sidebar';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface TopbarProps {
  onMobileMenuOpen: () => void;
  title?: string;
}

export function Topbar({ onMobileMenuOpen, title }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const { profile, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const MOCK_NOTIFICATIONS = [
    { id: 1, title: 'New homework posted', message: 'Mathematics HW due tomorrow', time: '5m ago', unread: true },
    { id: 2, title: 'Attendance marked',   message: 'Class 5A attendance done',   time: '1h ago', unread: true },
    { id: 3, title: 'Fee reminder',        message: 'Q2 fees due in 3 days',      time: '2h ago', unread: false },
  ];

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => n.unread).length;

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 md:px-6 gap-4 sticky top-0 z-20">
      <MobileMenuButton onClick={onMobileMenuOpen} />

      {title && (
        <h1 className="text-lg font-bold text-slate-900 dark:text-white hidden md:block">{title}</h1>
      )}

      {/* Search */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search students, teachers, classes…"
            className="w-full pl-9 pr-4 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all" />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Theme toggle */}
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setNotifOpen(!notifOpen)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all relative">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 card shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-in">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-white text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <span className="badge badge-brand">{unreadCount} new</span>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {MOCK_NOTIFICATIONS.map(n => (
                  <div key={n.id}
                    className={cn('p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors',
                      n.unread && 'bg-brand-50/50 dark:bg-brand-950/20')}>
                    <div className="flex items-start gap-3">
                      {n.unread && <div className="w-2 h-2 bg-brand-500 rounded-full mt-1.5 flex-shrink-0" />}
                      {!n.unread && <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" />}
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{n.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{n.message}</div>
                        <div className="text-xs text-slate-400 mt-1">{n.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-slate-200 dark:border-slate-800">
                <button onClick={() => setNotifOpen(false)}
                  className="w-full text-center text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-3 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
              </span>
            </div>
            <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-300 max-w-28 truncate">
              {profile?.full_name ?? 'User'}
            </span>
            <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 transition-transform', profileOpen && 'rotate-180')} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-11 w-52 card shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-in py-1">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">{profile?.full_name}</div>
                <div className="text-xs text-slate-500 truncate capitalize">{profile?.role?.replace('_', ' ')}</div>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <User className="w-4 h-4" /> My Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <Settings className="w-4 h-4" /> Settings
                </button>
                <div className="divider my-1" />
                <button onClick={signOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
