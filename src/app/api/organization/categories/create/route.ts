import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, customAttributes } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        customAttributes: customAttributes || '[]'
      }
    });

    return NextResponse.json({ data: category, status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category', status: 500 }, { status: 500 });
  }
}
