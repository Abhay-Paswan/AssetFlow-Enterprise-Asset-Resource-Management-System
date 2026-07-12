import { prisma } from './prisma';

export async function logActivity(
  userId: string | null,
  action: string,
  entityType: string,
  entityId: string,
  message: string
) {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        message,
      },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}
