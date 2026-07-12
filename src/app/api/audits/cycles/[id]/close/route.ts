import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';
import { getSession } from '@/core/auth/jwt';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.role !== 'Admin' && session.role !== 'Asset Manager') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await context.params;
  try {
    const cycle = await prisma.auditCycle.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!cycle) return NextResponse.json({ error: 'Not found', status: 404 }, { status: 404 });
    if (cycle.status === 'Closed') return NextResponse.json({ error: 'Already closed', status: 400 }, { status: 400 });

    // Mark as closed
    await prisma.auditCycle.update({
      where: { id },
      data: { status: 'Closed' },
    });

    // Generate discrepancy report & mutate assets
    const missingItems = cycle.items.filter(i => i.status === 'Missing');
    const damagedItems = cycle.items.filter(i => i.status === 'Damaged');

    for (const item of missingItems) {
      await prisma.asset.update({
        where: { id: item.assetId },
        data: { status: 'Lost' },
      });
      await logActivity(session.userId, 'Asset Marked Lost via Audit', 'Asset', item.assetId, `Asset lost in Audit Cycle ${cycle.name}`);
    }

    for (const item of damagedItems) {
      // In a real scenario, we might create a maintenance request automatically,
      // but the requirement says "flag for maintenance". 
      // I'll set status to Under Maintenance.
      await prisma.asset.update({
        where: { id: item.assetId },
        data: { status: 'Under Maintenance' },
      });
      await logActivity(session.userId, 'Asset Marked Damaged via Audit', 'Asset', item.assetId, `Asset damaged in Audit Cycle ${cycle.name}`);
    }

    const discrepancyReport = {
      missing: missingItems.length,
      damaged: damagedItems.length,
      message: `Audit cycle closed. ${missingItems.length} items missing, ${damagedItems.length} items damaged.`,
    };

    return NextResponse.json(discrepancyReport);
  } catch (error) {
    console.error('Error closing audit cycle:', error);
    return NextResponse.json({ error: 'Failed to close cycle', status: 500 }, { status: 500 });
  }
}
