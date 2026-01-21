import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStaticNavigation } from '@react-navigation/native';
import CatalogScreen from 'src/screens/CatalogScreen';

const Tabs = createBottomTabNavigator({
  screens: {
    Catalog: {
      screen: CatalogScreen,
      options: {
        title: 'Catalogo',
      }
    },
  },
});

const TabsNavigator = createStaticNavigation(Tabs);

export default TabsNavigator;