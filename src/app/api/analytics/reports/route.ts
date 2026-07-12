import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Assets by Category
    const categoryStats = await prisma.category.findMany({
      include: {
        _count: {
          select: { assets: true }
        }
      }
    });
    const pieData = categoryStats.map(c => ({
      name: c.name,
      value: c._count.assets
    }));

    // Maintenance by Priority
    const mRequests = await prisma.maintenanceRequest.groupBy({
      by: ['priority'],
      _count: {
        id: true
      }
    });
    const barData = mRequests.map(m => ({
      name: m.priority,
      count: m._count.id
    }));

    // Asset Status Distribution
    const statusStats = await prisma.asset.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });
    const statusData = statusStats.map(s => ({
      name: s.status,
      count: s._count.id
    }));

    return NextResponse.json({
      pieData,
      barData,
      statusData
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports', status: 500 }, { status: 500 });
  }
}
