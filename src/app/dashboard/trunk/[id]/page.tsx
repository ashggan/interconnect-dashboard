// src/app/dashboard/trunk/[id]/page.tsx
import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import TrunkViewPage from '@/features/trunks/components/trunk-view-page';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Trunk Details'
};

type PageProps = { params: Promise<{ id: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <TrunkViewPage trunkId={params.id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
