import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CatalogScreen from '~/screens/CatalogScreen';
import CheckoutScreen from '~/screens/CheckoutScreen';
import TestScreen from '~/screens/TestScreen';

const TabsNavigator = createBottomTabNavigator({
  screens: {
    Catalog: {
      screen: CatalogScreen,
      options: {
        headerShown: false,
        title: 'Catálogo'
      }
    },
    Checkout: {
      screen: CheckoutScreen,
      options: {
        title: 'Checkout'
      }
    },
    TestScreen: {
      screen: TestScreen,
      options: {
        title: 'Test Screen'
      }
    }
  }
});

export default TabsNavigator;
