import { Slot } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: '#1E90FF' },
        headerTintColor: '#FFFFFF',
        drawerStyle: { backgroundColor: '#1E90FF' },
        drawerActiveTintColor: '#FFFFFF',
        drawerInactiveTintColor: '#FFFFFF',
      }}
    >
      {/* Definimos cada pantalla del Drawer aquí */}
      <Drawer.Screen name="index" options={{ title: 'Menu' }} />
      <Drawer.Screen name="tester" options={{ title: 'Tester' }} />
      <Drawer.Screen name="history" options={{ title: 'Historial' }} />
    </Drawer>
  );
}
