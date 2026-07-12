import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, scopeType, scopeValue, startDate, endDate, auditorIds } = await request.json();

    if (!name || !scopeType || !scopeValue || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // First find the assets that match the scope
    let whereClause = {};
    if (scopeType === 'Department') {
      whereClause = { 
        allocations: { 
          some: { 
            status: 'Allocated', 
            assignee: { department: { name: scopeValue } }
          }
        } 
      };
    } else if (scopeType === 'Location') {
      whereClause = { location: scopeValue };
    } else if (scopeType === 'Category') {
      whereClause = { category: { name: scopeValue } };
    }

    const assetsInScope = await prisma.asset.findMany({
      where: whereClause,
      select: { id: true }
    });

    const cycle = await prisma.auditCycle.create({
      data: {
        name,
        scopeType,
        scopeValue,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'Active',
        auditors: auditorIds && auditorIds.length > 0 ? {
          connect: auditorIds.map((id: string) => ({ id }))
        } : undefined,
        items: {
          create: assetsInScope.map(asset => ({
            assetId: asset.id,
            status: 'Pending'
          }))
        }
      }
    });

    return NextResponse.json({ data: cycle, status: 201 });
  } catch (error: any) {
    console.error('Error creating audit cycle:', error);
    return NextResponse.json({ error: 'Failed to create audit cycle', status: 500 }, { status: 500 });
  }
}
