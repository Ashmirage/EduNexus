import { prisma } from '../apps/web/src/lib/server/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const demoEmail = 'demo@edunexus.com';
  const demoPassword = 'demo123';

  const existingUser = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (existingUser) {
    console.log('Demo user already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash(demoPassword, 10);
  await prisma.user.create({
    data: {
      email: demoEmail,
      password: hashedPassword,
      name: 'Demo User',
    },
  });

  console.log('Demo user created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
