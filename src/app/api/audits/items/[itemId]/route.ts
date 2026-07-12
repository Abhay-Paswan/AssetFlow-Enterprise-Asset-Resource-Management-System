import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, context: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await context.params;
  try {
    const body = await request.json();
    const { status, notes } = body;

    if (!['Pending', 'Verified', 'Missing', 'Damaged'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status', status: 400 }, { status: 400 });
    }

    const item = await prisma.auditItem.update({
      where: { id: itemId },
      data: { status, notes },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating audit item:', error);
    return NextResponse.json({ error: 'Failed to update item', status: 500 }, { status: 500 });
  }
}
