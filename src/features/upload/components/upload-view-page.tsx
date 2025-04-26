import { notFound } from 'next/navigation';
import UploadForm from './ulpoad-form';

type TUploadtViewPageProps = {
  uploadId: string;
};

export default async function UploadViewPage({
  uploadId
}: TUploadtViewPageProps) {
  let upload = null;
  let pageTitle = ' New CSV File';

  console.log(uploadId);
  if (uploadId !== 'new') {
    //   const data = await fakeProducts.getProductById(Number(productId));
    //   product = data.product as Product;
    //   console.log(productId);
    pageTitle = `Edit Upload File`;
    if (!upload) {
      notFound();
    }
  }

  return <UploadForm initialData={upload} pageTitle={pageTitle} />;
}
