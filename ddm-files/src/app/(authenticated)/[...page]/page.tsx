'use server';

import Link from 'next/link';

export default async function UnknownPage({
  params,
}: {
  params: { page: string };
}) {

  return (
    <main className='text-center' aria-label='Unknown page'>
      <h1>Oops! Page Not Found</h1>
      <p>The page &quot;{params.page}&quot; does not exist... yet.</p>
      <Link href='/'>
        <button>Go Back</button>
      </Link>
    </main>
  );
}
