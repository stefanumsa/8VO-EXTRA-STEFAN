import { useSelector } from 'react-redux';
import { RootState } from '@/core/store';
import { darkColors, lightColors } from '@/core/theme/colors';

export const useAppTheme = () => {
  const isDark = useSelector((state: RootState) => state.theme.isDarkMode);
  return isDark ? darkColors : lightColors;
};
