// import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { User } from 'types';

interface CreateUserResponse {
  user?: User;
  error?: unknown;
}

export async function createUser(user: User) {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });

    return response.json();
  } catch (error) {
    console.log(error);
  }
}

export async function getUSers() {
  try {
    const users = await prisma.user.findMany();
    return { users };
  } catch (error) {
    return { error };
  }
}

export async function getUSerById(id: string) {
  try {
    const user = await prisma.user.findFirst({ where: { id } });
    return user;
  } catch (error) {
    return { error };
  }
}
