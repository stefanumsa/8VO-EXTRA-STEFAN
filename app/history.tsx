import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import Button from "@/features/regexTester/presentation/components/atoms/Button/Button";
import Text from "@/features/regexTester/presentation/components/atoms/Text/Text";
import { useAppTheme } from '@/core/hooks/useAppTheme';

/**
 * Componente de pantalla que muestra el historial de expresiones regulares
 * guardadas previamente en AsyncStorage. Permite al usuario consultarlas
 * o eliminarlas por completo.
 */
export default function History(): JSX.Element {
  const colors = useAppTheme(); // Obtiene el esquema de colores según el tema actual
  const [history, setHistory] = useState<string[]>([]); // Estado local que almacena el historial

  /**
   * Carga el historial desde AsyncStorage al enfocar la pantalla.
   */
  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('regex_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error('Error al cargar el historial:', error);
    }
  };

  /**
   * Hook que ejecuta `loadHistory()` cada vez que esta pantalla obtiene el foco.
   * Es útil si el usuario navega de regreso desde otra pantalla.
   */
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  /**
   * Borra el historial del almacenamiento local y actualiza el estado.
   */
  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('regex_history');
      setHistory([]);
    } catch (error) {
      console.error('Error al borrar el historial:', error);
    }
  };

  const styles = createStyles(colors);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Historial de Expresiones Usadas</Text>

      {/* Mostrar botón solo si hay historial */}
      {history.length > 0 && (
        <View style={styles.buttonContainer}>
          <Button title="Borrar historial" onPress={clearHistory} />
        </View>
      )}

      {/* Mostrar mensaje si no hay historial */}
      {history.length === 0 ? (
        <Text style={styles.noHistoryText}>No hay expresiones guardadas aún.</Text>
      ) : (
        history.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

/**
 * Función que genera estilos dinámicos con tipado estricto.
 * Utiliza los colores proporcionados por el tema actual.
 */
const createStyles = (colors: {
  background: string;
  card: string;
  text: string;
  primary: string;
}): {
  container: StyleProp<ViewStyle>;
  title: StyleProp<TextStyle>;
  buttonContainer: StyleProp<ViewStyle>;
  noHistoryText: StyleProp<TextStyle>;
  itemContainer: StyleProp<ViewStyle>;
  itemText: StyleProp<TextStyle>;
} =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: colors.background,
      flexGrow: 1,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 12,
      color: colors.text,
    },
    buttonContainer: {
      marginBottom: 16,
    },
    noHistoryText: {
      color: colors.text,
      fontSize: 16,
      textAlign: 'center',
    },
    itemContainer: {
      marginBottom: 10,
      padding: 10,
      borderRadius: 8,
      backgroundColor: colors.card,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    itemText: {
      fontFamily: 'monospace',
      color: colors.text,
    },
  });
