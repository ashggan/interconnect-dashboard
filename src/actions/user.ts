'use server';
// import bcrypt from 'bcrypt';

import { UserFormValues } from '@/features/users/utils/form-schema';
import prisma from '@/lib/prisma';

export async function createUser(data: UserFormValues) {
  try {
    const { name, email, password, role, isBlocked } = data;
    // const hashedPassword = await bcrypt.hash(password ,10)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, //:hashedPassword,
        role,
        isBlocked
      }
    });
    console.log('server created a new user ', user);

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllUSers() {
  try {
    const users = await prisma.user.findMany();

    console.log('users :', users);
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
