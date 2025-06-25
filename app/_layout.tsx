import { Drawer } from 'expo-router/drawer';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from '../src/core/store';
import { useEffect } from 'react';
import { StatusBar, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setDarkMode, toggleTheme } from '../src/core/store/slices/themeSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { darkColors, lightColors } from '../src/core/theme/colors';

function DrawerLayout() {
  const isDark = useSelector((state: RootState) => state.theme.isDarkMode);
  const dispatch = useDispatch();
  const theme = isDark ? darkColors : lightColors;

  useEffect(() => {
    AsyncStorage.getItem('isDarkMode').then(value => {
      if (value !== null) {
        dispatch(setDarkMode(JSON.parse(value)));
      }
    });
  }, []);

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: theme.primary },
          headerTintColor: theme.text,
          drawerStyle: { backgroundColor: theme.primary },
          drawerActiveTintColor: theme.text,
          drawerInactiveTintColor: theme.text,
          headerRight: () => (
            <Pressable onPress={() => dispatch(toggleTheme())} style={{ marginRight: 16 }}>
              <MaterialCommunityIcons
                name={isDark ? 'weather-sunny' : 'moon-waning-crescent'}
                size={24}
                color={theme.text}
              />
            </Pressable>
          ),
        }}
      >
        <Drawer.Screen name="index" options={{ title: 'Página Principal' }} />
        <Drawer.Screen name="tester" options={{ title: 'Tester' }} />
        <Drawer.Screen name="history" options={{ title: 'Historial' }} />
        <Drawer.Screen name="diagrama" options={{ title: 'Diagrama' }} />
      </Drawer>
    </>
  );
}

export default function LayoutWrapper() {
  return (
    <Provider store={store}>
      <DrawerLayout />
    </Provider>
  );
}
