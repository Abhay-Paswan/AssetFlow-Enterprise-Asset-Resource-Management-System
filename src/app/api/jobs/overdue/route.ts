import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';

// This endpoint is intended to be called by a cron job service (e.g. Vercel Cron, GitHub Actions, AWS EventBridge)
export async function GET(request: Request) {
  try {
    // Optional: Add an authorization header check for cron secret here in a real production app.
    /*
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    */

    const now = new Date();

    const overdueAllocations = await prisma.allocation.findMany({
      where: {
        status: 'Allocated',
        expectedReturnDate: { lt: now },
      },
      include: {
        asset: true
      }
    });

    let flaggedCount = 0;
    
    // In a real system, you might add a boolean to Allocation like "isOverdueFlagged" to avoid repeated logs,
    // or you could send emails here.
    for (const alloc of overdueAllocations) {
      await logActivity(
        'system',
        'Allocation Overdue',
        'Asset',
        alloc.assetId,
        `Asset ${alloc.asset.tag} was due to be returned by ${alloc.assigneeId} on ${alloc.expectedReturnDate?.toDateString()}`
      );
      flaggedCount++;
    }

    return NextResponse.json({ message: `Cron job executed successfully. Flagged ${flaggedCount} overdue allocations.` });
  } catch (error) {
    console.error('Error running overdue cron:', error);
    return NextResponse.json({ error: 'Failed to run overdue cron', status: 500 }, { status: 500 });
  }
}
