import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json({ error: 'User ID and Role are required' }, { status: 400 });
    }

    const validRoles = ['Admin', 'Asset Manager', 'Department Head', 'Employee'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role }
    });

    return NextResponse.json({ data: user, status: 200 });
  } catch (error: any) {
    console.error('Error promoting user:', error);
    return NextResponse.json({ error: 'Failed to promote user', status: 500 }, { status: 500 });
  }
}
