import NextAuth from 'next-auth';
import { authConfig } from '@/config/auth.config';

export const {
  auth,
  signIn,
  signOut,
  unstable_update,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
});
