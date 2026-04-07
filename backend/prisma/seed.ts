import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const [student, teacher] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'student@classpartner.dev' },
      create: {
        email: 'student@classpartner.dev',
        password: hashedPassword,
        name: 'Student User',
        role: 'student',
        tier: 'free',
      },
      update: {},
    }),
    prisma.user.upsert({
      where: { email: 'teacher@classpartner.dev' },
      create: {
        email: 'teacher@classpartner.dev',
        password: hashedPassword,
        name: 'Teacher User',
        role: 'teacher',
        tier: 'pro',
      },
      update: {},
    }),
  ]);

  console.log('Seed completed:', {
    student: { id: student.id, email: student.email },
    teacher: { id: teacher.id, email: teacher.email },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
