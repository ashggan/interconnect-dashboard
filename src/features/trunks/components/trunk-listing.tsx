import { Trunk } from '@/constants/data';
// import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as TrunkTable } from '@/components/ui/table/data-table';
import { columns } from './trunk-tables/columns';

type TrunkListingPage = {};

export default async function TrunkListingPage({}: TrunkListingPage) {
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
    `https://interconnect-dashboard.vercel.app/api/trunk`
  );
  const data = await response.json();
  const totalTrunks = data.trunks?.length || 0;
  const trunks: Trunk[] = data.trunks || [];

  return (
    <TrunkTable columns={columns} data={trunks} totalItems={totalTrunks} />
  );
}
