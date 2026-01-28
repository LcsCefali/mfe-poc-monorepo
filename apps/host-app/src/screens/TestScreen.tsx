import React from 'react';

import Fallback from '~/components/Fallback';

const TestScreenRemote = React.lazy(() => import('catalog/TestScreen'));

const TestScreen = () => {
  return (
    <React.Suspense fallback={<Fallback label='test' />}>
      <TestScreenRemote />
    </React.Suspense>
  );
};

export default TestScreen;
