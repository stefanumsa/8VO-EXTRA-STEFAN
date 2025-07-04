import { useSelector } from 'react-redux';
import { RootState } from '@/core/store';
import { darkColors, lightColors } from '@/core/theme/colors';


/**
 * Hook personalizado que devuelve el conjunto de colores correspondiente
 * al tema actual de la aplicación (oscuro o claro).
 */
export const useAppTheme = () => {
  const isDark = useSelector((state: RootState) => state.theme.isDarkMode);
  return isDark ? darkColors : lightColors;
};
