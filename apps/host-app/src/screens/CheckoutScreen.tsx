import React from 'react';

import Fallback from '../components/Fallback';

const CheckoutAppRemote = React.lazy(async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(import('checkout/App'));
    }, 3000); // delay de 3 segundos
  });
});

const CheckoutScreen: React.FC = () => {
  return (
    <React.Suspense fallback={<Fallback label='Carregando Checkout...' />}>
      <CheckoutAppRemote />
    </React.Suspense>
  );
};

export default CheckoutScreen;
