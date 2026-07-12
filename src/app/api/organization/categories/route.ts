import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/core/auth/jwt';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized', status: 401 }, { status: 401 });
    }

    const categories = await prisma.category.findMany();

    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch categories', status: 500 }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized', status: 401 }, { status: 401 });
    }

    const { name, customAttributes } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required', status: 400 }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        customAttributes: customAttributes || '[]'
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create category', status: 500 }, { status: 500 });
  }
}
