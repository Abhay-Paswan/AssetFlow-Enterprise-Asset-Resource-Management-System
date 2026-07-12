import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Clear existing data (using try/catch in case some models were not generated correctly by member 4)
  try { await (prisma as any).activityLog?.deleteMany(); } catch (e) {}
  try { await (prisma as any).auditItem?.deleteMany(); } catch (e) {}
  try { await (prisma as any).auditCycle?.deleteMany(); } catch (e) {}
  try { await (prisma as any).notification?.deleteMany(); } catch (e) {}
  
  await prisma.booking.deleteMany();
  await prisma.maintenanceRequest.deleteMany();
  await prisma.transferRequest.deleteMany();
  await prisma.allocation.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Departments
  const itDept = await prisma.department.create({ data: { name: 'IT' } });
  const hrDept = await prisma.department.create({ data: { name: 'HR' } });

  // Users
  const admin = await prisma.user.create({
    data: { name: 'Admin User', email: 'admin@assetflow.com', password: hashedPassword, role: 'Admin' }
  });
  
  const manager = await prisma.user.create({
    data: { name: 'Asset Manager', email: 'manager@assetflow.com', password: hashedPassword, role: 'Asset Manager' }
  });

  const priya = await prisma.user.create({
    data: { name: 'Priya', email: 'priya@assetflow.com', password: hashedPassword, role: 'Employee', departmentId: itDept.id }
  });

  const raj = await prisma.user.create({
    data: { name: 'Raj', email: 'raj@assetflow.com', password: hashedPassword, role: 'Employee', departmentId: itDept.id }
  });

  // Categories
  const catElectronics = await prisma.category.create({
    data: { name: 'Electronics', customAttributes: '[]' }
  });
  
  const catFacilities = await prisma.category.create({
    data: { name: 'Facilities', customAttributes: '[]' }
  });

  // Assets
  const laptop = await prisma.asset.create({
    data: {
      name: 'MacBook Pro 16"',
      tag: 'AF-0114',
      categoryId: catElectronics.id,
      condition: 'Good',
      status: 'Allocated',
      isSharedResource: false
    }
  });

  const roomB2 = await prisma.asset.create({
    data: {
      name: 'Conference Room B2',
      tag: 'AF-ROOM-B2',
      categoryId: catFacilities.id,
      condition: 'Good',
      status: 'Available',
      isSharedResource: true
    }
  });

  const oldMonitor = await prisma.asset.create({
    data: {
      name: 'Dell 27" Monitor',
      tag: 'AF-0999',
      categoryId: catElectronics.id,
      condition: 'Poor',
      status: 'Allocated',
      isSharedResource: false
    }
  });

  // Allocations & Story Data
  // 1. Allocate Laptop AF-0114 to Priya
  await prisma.allocation.create({
    data: {
      assetId: laptop.id,
      assigneeId: priya.id,
      status: 'Allocated'
    }
  });

  // 2. Overdue Allocation for Red Banner
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  await prisma.allocation.create({
    data: {
      assetId: oldMonitor.id,
      assigneeId: manager.id,
      expectedReturnDate: yesterday,
      status: 'Allocated'
    }
  });

  // 3. Book Room B2 from 09:00 to 10:00 today
  const today = new Date();
  const start = new Date(today);
  start.setHours(9, 0, 0, 0);
  const end = new Date(today);
  end.setHours(10, 0, 0, 0);

  await prisma.booking.create({
    data: {
      assetId: roomB2.id,
      userId: admin.id,
      startTime: start,
      endTime: end,
      purpose: 'Team Sync',
      status: 'Upcoming'
    }
  });

  console.log('Seed completed successfully!');
  console.log('Test accounts (password: password123):');
  console.log('- admin@assetflow.com (Admin)');
  console.log('- manager@assetflow.com (Asset Manager)');
  console.log('- priya@assetflow.com (Employee)');
  console.log('- raj@assetflow.com (Employee)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
