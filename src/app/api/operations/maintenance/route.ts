import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/core/auth/jwt';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('assetId');
    const status = searchParams.get('status');

    const whereClause: any = {};
    if (assetId) whereClause.assetId = assetId;
    if (status) whereClause.status = status;

    const maintenanceRequests = await prisma.maintenanceRequest.findMany({
      where: whereClause,
      include: {
        asset: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(maintenanceRequests);
  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    return NextResponse.json({ error: 'Failed to fetch maintenance requests', status: 500 }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { assetId, issue, priority, photoUrl } = body;
    const userId = session.userId;

    if (!assetId || !issue || !priority) {
      return NextResponse.json({ error: 'Missing required fields', status: 400 }, { status: 400 });
    }

    const maintenanceRequest = await prisma.maintenanceRequest.create({
      data: {
        assetId,
        userId,
        issue,
        priority,
        photoUrl,
        status: 'Pending'
      },
      include: {
        asset: true,
        user: true
      }
    });

    try {
        const { logActivity } = await import('@/lib/activity');
        await logActivity(userId, 'Maintenance Requested', 'Asset', assetId, `Maintenance requested with priority ${priority}`);
    } catch (e) {
        console.warn('Activity logging failed or not implemented yet');
    }

    return NextResponse.json(maintenanceRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating maintenance request:', error);
    return NextResponse.json({ error: 'Failed to create maintenance request', status: 500 }, { status: 500 });
  }
}
