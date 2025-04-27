import ParnterForm from './parnter-form';
import { baseUrl } from '@/lib/constants';

type TProductViewPageProps = {
  partnerId: string;
};

export default async function PartnerViewPage({
  partnerId
}: TProductViewPageProps) {
  let partner = null;
  let pageTitle = 'Create New Partner';

  if (partnerId !== 'new') {
    const response = await fetch(`${baseUrl}/api/partner/${partnerId}`, {
      method: 'GET',
      cache: 'no-store'
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      return res;
    });

    const data = await response.json();
    partner = data.partner;

    pageTitle = `Edit Partner`;
  }

  return <ParnterForm initialData={partner} pageTitle={pageTitle} />;
}
