import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import type { User } from '@prisma/client';

export type { User } from '@prisma/client';

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export async function createUser(data: { email: string; name?: string; password: string }): Promise<User> {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name ?? null,
      password: hashedPassword,
    },
  });
}
