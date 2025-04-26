import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import PartnerViewPage from '@/features/partners/components/partner-view-page';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard : Partner View'
};

type PageProps = { params: Promise<{ partnerId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <PartnerViewPage partnerId={params.partnerId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
