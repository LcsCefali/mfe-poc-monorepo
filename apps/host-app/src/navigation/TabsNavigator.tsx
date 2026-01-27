import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CatalogScreen from '~/screens/CatalogScreen';

const TabsNavigator = createBottomTabNavigator({
  screens: {
    Catalog: {
      screen: CatalogScreen,
      options: {
        headerShown: false,
      }
    },
  },
});

export default TabsNavigator;