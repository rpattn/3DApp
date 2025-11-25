import { SignInForm } from '@/components/sign-in-form';

export default function SignInPage() {
  return (
    <main aria-label='Sign in page' className='justify-center mb-20'>
      <h1 className='text-2xl font-semibold'>Digital Design Manager</h1>
      <div className="mt-5"></div>
      <div className="inline-flex items-center justify-center w-full"><hr className="w-32 h-px my-4 border-0 dark:bg-gray-100/10 bg-gray-700/10" />  <hr className="w-32 h-px my-4 border-0 dark:bg-gray-100/10 bg-gray-700/10" /></div>
      <SignInForm />
    </main>
  );
}
