import { baseUrl } from '@/lib/constants';
import TrunkForm from './trunk-form';

type TTrunkViewPageProps = {
  trunkId: string;
};

export default async function TrunkViewPage({ trunkId }: TTrunkViewPageProps) {
  let trunk = null;
  let pageTitle = 'Create New Trunk';

  if (trunkId !== 'new') {
    const response = await fetch(`${baseUrl}/api/trunk/${trunkId}`, {
      method: 'GET',
      cache: 'no-store'
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      return res;
    });

    const data = await response.json();
    trunk = data.trunk;

    pageTitle = `Edit Trunk`;
  }

  return <TrunkForm initialData={trunk} pageTitle={pageTitle} />;
}
