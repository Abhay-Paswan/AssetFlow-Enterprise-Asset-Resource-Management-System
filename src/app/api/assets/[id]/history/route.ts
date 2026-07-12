import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const allocations = await prisma.allocation.findMany({
      where: { assetId: id },
      orderBy: { createdAt: 'desc' }
    });

    const maintenanceRequests = await prisma.maintenanceRequest.findMany({
      where: { assetId: id },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });

    // Combine and sort by date descending
    const history = [
      ...allocations.map(a => ({
        type: 'Allocation',
        date: a.createdAt,
        status: a.status,
        details: `Assigned to: ${a.assigneeId} | Notes: ${a.checkInNotes || 'None'}`
      })),
      ...maintenanceRequests.map(m => ({
        type: 'Maintenance',
        date: m.createdAt,
        status: m.status,
        details: `Issue: ${m.issue} | Priority: ${m.priority} | Reported by: ${m.user.name}`
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching asset history:', error);
    return NextResponse.json({ error: 'Failed to fetch asset history', status: 500 }, { status: 500 });
  }
}
