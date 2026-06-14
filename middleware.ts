import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseMiddlewareClient } from '@/lib/supabase/server';

const PUBLIC_ROUTES  = ['/', '/auth/login', '/auth/forgot-password', '/auth/reset-password'];
const ROLE_ROUTES: Record<string, string[]> = {
  super_admin:  ['/dashboard/admin', '/dashboard/teacher', '/dashboard/student'],
  school_admin: ['/dashboard/admin'],
  teacher:      ['/dashboard/teacher'],
  student:      ['/dashboard/student'],
  parent:       ['/dashboard/parent'],
};

export async function middleware(request: NextRequest) {
  const { supabase, response } = await createSupabaseMiddlewareClient(request);
  const { data: { session } } = await supabase.auth.getSession();
  const pathname = request.nextUrl.pathname;

  // Allow public routes
  if (PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith('/auth/'))) {
    // Redirect authenticated users away from login
    if (session && pathname === '/auth/login') {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }
    return response;
  }

  // Require authentication for dashboard routes
  if (!session) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Fetch user role from profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', session.user.id)
    .single();

  const role = profile?.role as string | undefined;

  // Role-based route protection
  if (role && pathname.startsWith('/dashboard/')) {
    const allowedPrefixes = ROLE_ROUTES[role] ?? [];
    const isAllowed = allowedPrefixes.some(prefix => pathname.startsWith(prefix));

    if (!isAllowed) {
      // Redirect to correct dashboard
      const redirect = allowedPrefixes[0] ?? '/auth/login';
      return NextResponse.redirect(new URL(redirect, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
