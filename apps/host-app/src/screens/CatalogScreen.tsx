import React from 'react';

import Fallback from '../components/Fallback';

const CatalogAppRemote = React.lazy(() => import('catalog/App'));

const CatalogScreen: React.FC = () => {
  return (
    <React.Suspense fallback={<Fallback label='Carregando Catálogo...' />}>
      <CatalogAppRemote />
    </React.Suspense>
  );
};

export default CatalogScreen;
