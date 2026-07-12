import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/core/auth/jwt';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized', status: 401 }, { status: 401 });
    }

    const departments = await prisma.department.findMany({
      include: {
        head: {
          select: { id: true, name: true, email: true }
        },
        parent: {
          select: { id: true, name: true }
        }
      }
    });

    return NextResponse.json(departments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch departments', status: 500 }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized', status: 401 }, { status: 401 });
    }

    const { name, headId, parentId, status } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required', status: 400 }, { status: 400 });
    }

    const department = await prisma.department.create({
      data: {
        name,
        headId: headId || null,
        parentId: parentId || null,
        status: status || 'Active'
      }
    });

    return NextResponse.json(department, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create department', status: 500 }, { status: 500 });
  }
}
