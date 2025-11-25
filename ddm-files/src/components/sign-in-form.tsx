'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signInAction } from '@/services/msEntraId';

function SignInButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className='flex justify-center items-center text-black bg-gray-700/5 hover:bg-gray-700/10 dark:bg-gray-100/5 dark:hover:bg-gray-100/10 dark:text-gray-300 dark:hover:text-white transition w-full rounded-full font-medium text-sm py-2.5 p-16'>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" className="size-6 mr-3"><rect x="1" y="1" width="9" height="9" fill="#f25022"></rect><rect x="1" y="11" width="9" height="9" fill="#00a4ef"></rect><rect x="11" y="1" width="9" height="9" fill="#7fba00"></rect><rect x="11" y="11" width="9" height="9" fill="#ffb900"></rect></svg>
      
      {pending ? 'Signing in...' : 'Continue with Microsoft'}
    </button>
  );
}

export function SignInForm() {
  const [errorMessage, signIn] = useFormState(signInAction, undefined);

  return (
    <form action={signIn}>
      <SignInButton />
      {errorMessage && (
        <p role='alert' className='text-red-500 pt-3'>
          {errorMessage}
        </p>
      )}
    </form>
  );
}
