export async function logActivity(userId: string, action: string, entityType: string, entityId: string, message: string) {
    console.log(`[ACTIVITY LOG] ${userId} did ${action} on ${entityType} ${entityId}: ${message}`);
}
