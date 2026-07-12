import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, context: { params: { id: string } }) {
  const { id } = await context.params;
  try {
    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ error: 'Failed to update notification', status: 500 }, { status: 500 });
  }
}
