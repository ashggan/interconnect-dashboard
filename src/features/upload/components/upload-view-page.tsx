import UploadForm from './ulpoad-form';

type TUploadtViewPageProps = {
  uploadId: string;
};

export default async function UploadViewPage({
  uploadId
}: TUploadtViewPageProps) {
  let upload = null;
  let pageTitle = ' New CSV File';

  if (uploadId !== 'new') {
    const response = await fetch(
      `https://interconnect-dashboard.vercel.app/api/upload/${uploadId}`,
      {
        method: 'GET',
        cache: 'no-store'
      }
    ).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      return res;
    });

    upload = await response.json();

    pageTitle = `Edit Upload File`;
  }

  return <UploadForm initialData={upload} pageTitle={pageTitle} />;
}
