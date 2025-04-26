import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import UploadViewPage from '@/features/upload/components/upload-view-page';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Upload'
};

type pageProps = {
  params: Promise<{ uploadId: string }>;
};

export default async function Page(props: pageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <UploadViewPage uploadId={params.uploadId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
