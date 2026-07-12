import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    return NextResponse.json({ message: 'Logged out successfully', status: 200 }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Logout failed', status: 500 }, { status: 500 });
  }
}
