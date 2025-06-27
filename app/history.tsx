import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Button from "@/features/regexTester/presentation/components/atoms/Button/Button";
import Text from "@/features/regexTester/presentation/components/atoms/Text/Text";
import { useAppTheme } from '@/core/hooks/useAppTheme';

export default function History() {
  const colors = useAppTheme();

  const [history, setHistory] = useState<string[]>([]);

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

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

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
      <Text style={styles.title}>
        Historial de Expresiones Usadas
      </Text>

      {history.length > 0 && (
        <View style={styles.buttonContainer}>
          <Button title="Borrar historial" onPress={clearHistory} />
        </View>
      )}

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

const createStyles = (colors: any) =>
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
      backgroundColor: colors.card, // usa color de tarjeta del tema
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    itemText: {
      fontFamily: 'monospace',
      color: colors.text,
    },
  });
