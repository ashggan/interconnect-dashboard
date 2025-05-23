// import { notFound } from 'next/navigation';
import UserForm from './user-form';

type TUserViewPageProps = {
  userId: string;
};

export default async function UserViewPage({ userId }: TUserViewPageProps) {
  let user = null;
  let pageTitle = 'Create New User';

  if (userId !== 'new') {
    const response = await fetch(
      `https://interconnect-dashboard.vercel.app/api/user/${userId}`,
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

    const data = await response.json();
    user = data.user;

    pageTitle = `Edit User`;
  }

  return <UserForm initialData={user} pageTitle={pageTitle} />;
}
