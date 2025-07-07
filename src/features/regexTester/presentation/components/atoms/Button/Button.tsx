import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
// Importa useSelector para acceder al estado global de Redux
import { useSelector } from 'react-redux';
// Importa el tipo RootState para tipar el selector
import { RootState } from '@/core/store';
// Importa los esquemas de colores para modo claro y oscuro
import { darkColors, lightColors } from '@/core/theme/colors';

// Define las props que recibe el botón: texto y función al presionar
interface ButtonProps {
  title: string;
  onPress: () => void;
}

// Componente botón que adapta sus colores según el tema activo en Redux
export default function Button({ title, onPress }: ButtonProps) {
  // Obtiene si el tema es oscuro desde el estado global
  const isDark = useSelector((state: RootState) => state.theme.isDarkMode);
  // Selecciona la paleta de colores según el modo actual
  const theme = isDark ? darkColors : lightColors;

  return (
    // Botón táctil con estilo dinámico según tema y evento onPress
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.primary }]}
      onPress={onPress}
    >
      {/* Texto del botón con color dinámico */}
      <Text style={[styles.text, { color: theme.text }]}>{title}</Text>
    </TouchableOpacity>
  );
}

// Estilos base del botón y texto
const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    elevation: 5,          
    alignItems: 'center',  // Centra el texto horizontalmente
  },
  text: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
