import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store';
import { darkColors, lightColors } from '@/core/theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
}

export default function Button({ title, onPress }: ButtonProps) {
  const isDark = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = isDark ? darkColors : lightColors;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.primary }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: theme.text }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    elevation: 5,
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
     fontSize: 18,
  },
});
