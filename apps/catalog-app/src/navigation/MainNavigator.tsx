import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CatalogScreen from '../screens/CatalogScreen';

export type MainStackParamList = {
  Catalog: undefined;
};

const Main = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <Main.Navigator
      screenOptions={{
        headerShown: false,
      }} initialRouteName='Catalog'>
      <Main.Screen name="Catalog" component={CatalogScreen} options={{ title: 'Catálogo' }} />
    </Main.Navigator>
  );
};

export default MainNavigator;