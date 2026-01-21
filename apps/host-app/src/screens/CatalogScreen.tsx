import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Fallback from '../components/Fallback';

const CatalogScreenRemote = React.lazy(() => import('catalog/CatalogScreen'));

const CatalogScreen: React.FC = () => {
  return (
    <React.Suspense fallback={<Fallback label='Carregando papai... xd'/>}>
      <CatalogScreenRemote />
    </React.Suspense>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CatalogScreen;