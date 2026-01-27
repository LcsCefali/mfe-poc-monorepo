import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CatalogScreen from '../screens/CatalogScreen';

const MainNativeStack = createNativeStackNavigator({
  screens: {
    Tabs: {
      screen: CatalogScreen,
      options: {
        title: 'Catálogo',
      }
    },
  },
})

const MainNavigator = createStaticNavigation(MainNativeStack);

export default MainNavigator;