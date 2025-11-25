'use server';

import { SignOutForm } from '@/components/sign-out-form';

export default async function OtherPage({
  params,
}: {
  params: { page: string };
}) {

  return (
    <main className='text-center' aria-label='Unknown page'>
      <h1>Oops!</h1>
      <p>You don't have access to this site yet!</p>
      <SignOutForm />
    </main>
  );
}
