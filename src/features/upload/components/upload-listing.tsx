import { FileUpload } from '@/constants/data';
// import { fakeProducts } from '@/constants/mock-api';
// import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as UploadTable } from '@/components/ui/table/data-table';
import { columns } from './upload-tables/columns';

type ProductListingPage = {};

export default async function UploadListingPage({}: ProductListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  // const page = searchParamsCache.get('page');
  // const search = searchParamsCache.get('q');
  // const pageLimit = searchParamsCache.get('limit');
  // const categories = searchParamsCache.get('categories');

  // const filters = {
  //   page,
  //   limit: pageLimit,
  //   ...(search && { search }),
  //   ...(categories && { categories: categories })

  // };

  const response = await fetch(
    `https://interconnect-dashboard.vercel.app/api/upload`
  );
  const data = await response.json();

  const totalUploads = data.uploads?.length || 0;
  const uploads: FileUpload[] = data.uploads || [];

  return (
    <UploadTable columns={columns} data={uploads} totalItems={totalUploads} />
  );
}
