import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/password-utils';

const prisma = new PrismaClient();

async function main() {
  // Check if admin already exists to avoid duplicates
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: 'admin@mail.com'
    }
  });

  if (!existingAdmin) {
    const hashedPassword = await hashPassword('Admin123');
    const admin = await prisma.user.create({
      data: {
        name: 'Admin ',
        email: 'admin@bssconnect.com',
        password: hashedPassword,
        role: 'ADMIN',
        isBlocked: false
      }
    });

    console.log(`Created admin user with ID: ${admin.id}`);
  } else {
    console.log('Admin user already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
