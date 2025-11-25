'use server';

import { auth } from '@/auth';
import { cookies } from 'next/headers';
import { DataProvider } from '@/components/DataProvider';
import Navbar from '@/components/Navbar';
import InspectionPage from '@/components/InspectionPage';


export default async function HomePage() {
  const cookieStore = cookies()
  const session = await auth();
  const userName = session?.user?.name || 'Unknown user';

  let resourcePath: string
  resourcePath = cookieStore.get('resourcePath')?.value || '/'

  return (
    <main aria-label='Home page'>
      <Navbar appVersion={'1.0.0'} userName={userName} />
      <DataProvider resourcePath={resourcePath}>
        <InspectionPage />
      </DataProvider>
    </main>
  );
}

//      <ProtectedResource resourcePath={resourcePath + '/page.html'} />
