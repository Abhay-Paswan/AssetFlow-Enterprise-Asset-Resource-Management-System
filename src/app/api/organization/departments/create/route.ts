import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, headId, parentId, status } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Department name is required' }, { status: 400 });
    }

    const data: any = { name, status: status || 'Active' };
    if (headId) data.headId = headId;
    if (parentId) data.parentId = parentId;

    const department = await prisma.department.create({ data });

    return NextResponse.json({ data: department, status: 201 });
  } catch (error: any) {
    console.error('Error creating department:', error);
    return NextResponse.json({ error: 'Failed to create department', status: 500 }, { status: 500 });
  }
}
