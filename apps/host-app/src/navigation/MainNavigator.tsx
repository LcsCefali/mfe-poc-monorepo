import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabsNavigator from './TabsNavigator';

const MainNativeStack = createNativeStackNavigator({
  screens: {
    Tabs: {
      screen: TabsNavigator,
      options: {
        headerShown: false
      }
    }
  }
});

const MainNavigator = createStaticNavigation(MainNativeStack);

export default MainNavigator;
