import { NextAuthConfig, User } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { verifyPassword } from './password-utils';
import prisma from './prisma';

const authConfig = {
  providers: [
    CredentialProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com'
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        console.log(credentials);
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await prisma.user.findUnique({
          where: { email }
        });

        console.log('user', user);

        if (user) {
          // check if password is correct
          if (!(await verifyPassword(password, user.password))) {
            throw new Error('Invalid credentials');
          }
          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            role: user.role
          } as User;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
        }
      }
    })
  ],
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: async ({ session, user }) => {
      // Add property to session, like an access_token from a provider.
      if (user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/dashboard/overview' //sigin page
  }
} satisfies NextAuthConfig;

export default authConfig;
