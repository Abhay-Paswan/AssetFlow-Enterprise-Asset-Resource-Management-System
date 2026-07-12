import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/core/auth/jwt';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  
  if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (!session && !request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session) {
    try {
      const payload = await decrypt(session);
      
      // Screen 3 (Organization Setup Tabs A & B) / Employee Directory (Tab C) is Admin only
      if (request.nextUrl.pathname.startsWith('/organization') && payload.role !== 'Admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      // Add more RBAC logic if needed
      
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
