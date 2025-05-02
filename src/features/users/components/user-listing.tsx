'use client ';
// import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as UserTable } from '@/components/ui/table/data-table';
import { columns } from './user-tables/columns';
import { User } from 'types';
import { baseUrl } from '@/lib/constants';

type UserListingPage = {};

export default async function UserListingPage({}: UserListingPage) {
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

  // const BASE_URL =
  // process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'; // Default to localhost if not defined
  const response = await fetch(
    `https://interconnect-dashboard.vercel.app/api/user`
  );

  const data = await response.json();

  const users: User[] = data.users || [];
  const totalUser = users.length || 0;

  return <UserTable columns={columns} data={users} totalItems={totalUser} />;
}
