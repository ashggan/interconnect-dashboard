import { notFound } from 'next/navigation';
import UserForm from './user-form';
import { getUSerById } from '@/services/user';

type TUserViewPageProps = {
  userId: string;
};

export default async function UserViewPage({ userId }: TUserViewPageProps) {
  let user = null;
  let pageTitle = 'Create New User';

  // if (userId !== 'new') {
  //   // const data = await fakeProducts.getProductById(Number(userId));data.users ||
  //   // const data  =  await
  //   // user = data  || {}
  //   // console.log( userId)
  //   const user =await getUSerById(userId)
  //   if (!user) {
  //     notFound();
  //   }
  //   pageTitle = `Edit User`;
  // }

  return <UserForm initialData={user} pageTitle={pageTitle} />;
}
