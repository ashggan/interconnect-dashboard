import { Trunk } from '@/constants/data';
import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as TrunkTable } from '@/components/ui/table/data-table';
import { columns } from './trunk-tables/columns';
import { baseUrl } from '@/lib/constants';

type TrunkListingPage = {};

export default async function TrunkListingPage({}: TrunkListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');
  const categories = searchParamsCache.get('categories');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories: categories })
  };

  const response = await fetch(`${baseUrl}/api/trunk`);
  const data = await response.json();
  const totalTrunks = data.trunks?.length || 0;
  const trunks: Trunk[] = data.trunks || []; // Fixed this line

  console.log('response', response);
  return (
    <TrunkTable columns={columns} data={trunks} totalItems={totalTrunks} />
  );
}
