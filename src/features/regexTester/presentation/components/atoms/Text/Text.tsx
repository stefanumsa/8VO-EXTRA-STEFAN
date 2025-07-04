import React from 'react';
import { Text as RNText, StyleSheet, StyleProp, TextStyle } from 'react-native';
// Importa el tipo de las props personalizado
import { TextProps } from './types/types';

/**
 * Componente Text personalizado que permite variantes para estilos predefinidos.
 * @param children - contenido del texto
 * @param variant - tipo de estilo ('title', 'body', 'error'), por defecto 'body'
 * @param style - estilos adicionales que se puedan pasar
 */
const Text = ({ children, variant = 'body', style }: TextProps) => {
  // Renderiza el componente Text nativo con estilo basado en la variante y estilos extra
  return <RNText style={[styles[variant], style]}>{children}</RNText>;
};

export default Text;

// Definición de estilos para cada variante de texto
const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 18,
    color: '#000000', 
  },
  error: {
    fontSize: 12,
    color: 'red',
  },
});
