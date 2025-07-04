import { Drawer } from 'expo-router/drawer'; // Componente de navegación lateral tipo Drawer
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from '../src/core/store'; // Redux store y tipo del estado global
import { useEffect } from 'react';
import { StatusBar, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setDarkMode, toggleTheme } from '../src/core/store/slices/themeSlice'; // Acciones de Redux
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { darkColors, lightColors } from '../src/core/theme/colors'; // Paletas de colores

/**
 * Componente que define el layout base de la app.
 * Contiene la configuración del Drawer (menú lateral), el manejo de tema oscuro y el icono de alternancia.
 */
function DrawerLayout(): JSX.Element {
  const isDark = useSelector((state: RootState) => state.theme.isDarkMode); // Lee el estado global del tema
  const dispatch = useDispatch();
  const theme = isDark ? darkColors : lightColors;

  /**
   * Al iniciar la app, intenta recuperar de AsyncStorage el valor persistido de `isDarkMode`.
   * Si existe, lo aplica en el estado global de Redux.
   */
  useEffect(() => {
    AsyncStorage.getItem('isDarkMode').then((value) => {
      if (value !== null) {
        dispatch(setDarkMode(JSON.parse(value))); 
      }
    });
  }, []);

  return (
    <>
      {/* Cambia el color de la barra de estado según el tema */}
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Drawer de navegación lateral con configuración dinámica basada en el tema */}
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: theme.primary },
          headerTintColor: theme.text,
          drawerStyle: { backgroundColor: theme.primary },
          drawerActiveTintColor: theme.text,
          drawerInactiveTintColor: theme.text,

          // Ícono a la derecha del header para alternar entre temas
          headerRight: () => (
            <Pressable
              onPress={() => dispatch(toggleTheme())}
              style={{ marginRight: 16 }}
              accessibilityLabel="Alternar tema"
            >
              <MaterialCommunityIcons
                name={isDark ? 'weather-sunny' : 'moon-waning-crescent'}
                size={24}
                color={theme.text}
              />
            </Pressable>
          ),
        }}
      >
        {/* Rutas principales del drawer */}
        <Drawer.Screen name="index" options={{ title: 'Página Principal' }} />
        <Drawer.Screen name="tester" options={{ title: 'Tester' }} />
        <Drawer.Screen name="history" options={{ title: 'Historial' }} />
        <Drawer.Screen name="diagrama" options={{ title: 'Diagrama' }} />
      </Drawer>
    </>
  );
}

/**
 * LayoutWrapper es el componente raíz que envuelve la app con el Provider de Redux.
 * Esto asegura que el store esté disponible en toda la aplicación.
 */
export default function LayoutWrapper(): JSX.Element {
  return (
    <Provider store={store}>
      <DrawerLayout />
    </Provider>
  );
}
