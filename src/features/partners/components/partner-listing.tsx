import { Partner } from '@/constants/data';
import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as PartnerTable } from '@/components/ui/table/data-table';
import { columns } from './partner-tables/columns';

type PartnerListingPage = {};

export default async function PartnerListingPage({}: PartnerListingPage) {
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

  const response = await fetch('http://localhost:3000/api/partner');
  const data = await response.json();
  const totalPartners = data.partners?.length || 0;
  const partners: Partner[] = data.partners || [];

  return (
    <PartnerTable
      columns={columns}
      data={partners}
      totalItems={totalPartners}
    />
  );
}
