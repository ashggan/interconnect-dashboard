import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  type UserSession = DefaultSession['user'];
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: Role;
  }

  interface CredentialsInputs {
    email: string;
    password: string;
  }
}
