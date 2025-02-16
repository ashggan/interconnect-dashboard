'use client ';
// import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as UserTable } from '@/components/ui/table/data-table';
import { columns } from './user-tables/columns';
import prisma from '@/lib/prisma';
import { User } from 'types';
import { getUSers } from '@/services/user';

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
  // const allUsers = await prisma.user.findMany()

  // const data = await prisma.user.findMany()
  // console.log(data)
  //fakeProducts.getProducts(filters);
  const totalProducts = 19; //data?.count();data.users ||
  const userResponse = await getUSers();

  let users: User[] = [];

  if (userResponse.error) {
    console.error(userResponse.error);
  } else if (userResponse.users) {
    users = userResponse.users;
  }

  console.log(users);

  return (
    <UserTable columns={columns} data={users} totalItems={totalProducts} />
  );
}
