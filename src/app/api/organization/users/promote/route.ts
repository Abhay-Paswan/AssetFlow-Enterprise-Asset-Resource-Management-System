import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/core/auth/jwt';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized', status: 401 }, { status: 401 });
    }

    const { userId, newRole, departmentId } = await request.json();

    if (!userId || !newRole) {
      return NextResponse.json({ error: 'Missing required fields', status: 400 }, { status: 400 });
    }

    const validRoles = ['Admin', 'Asset Manager', 'Department Head', 'Employee'];
    if (!validRoles.includes(newRole)) {
      return NextResponse.json({ error: 'Invalid role', status: 400 }, { status: 400 });
    }

    // If promoting to Department Head and assigning a department
    if (newRole === 'Department Head' && departmentId) {
      // First, update the user
      await prisma.user.update({
        where: { id: userId },
        data: { role: newRole, departmentId }
      });
      // Then set them as the head of the department
      await prisma.department.update({
        where: { id: departmentId },
        data: { headId: userId }
      });
    } else {
      // Just update the user role
      await prisma.user.update({
        where: { id: userId },
        data: { role: newRole }
      });
    }

    return NextResponse.json({ message: 'User promoted successfully', status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to promote user', status: 500 }, { status: 500 });
  }
}
