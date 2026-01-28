

import React from 'react';
import Fallback from '../components/Fallback';

const CheckoutAppRemote = React.lazy(() => import('checkout/App'));

const CheckoutScreen: React.FC = () => {
  return (
    <React.Suspense fallback={<Fallback label='Carregando Checkout...'/>}>
      <CheckoutAppRemote />
    </React.Suspense>
  );
};

export default CheckoutScreen;