import React from 'react';
import TrunkForm from './trunk-form';
import { baseUrl } from '@/lib/constants';

type TrunkViewPageProps = {
  trunkId: string;
};

export default async function TrunkViewPage({ trunkId }: TrunkViewPageProps) {
  let trunck = null;
  let pageTitle = 'Create New Trunck';

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
    trunck = data.trunk;

    pageTitle = `Edit Trunck`;
  }
  return <TrunkForm initialData={trunck} pageTitle={pageTitle} />;
}
