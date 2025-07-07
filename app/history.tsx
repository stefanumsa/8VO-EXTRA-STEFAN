import React from 'react';
import { View, ScrollView, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Button from "@/features/regexTester/presentation/components/atoms/Button/Button";
import Text from "@/features/regexTester/presentation/components/atoms/Text/Text";
import { useAppTheme } from '@/core/hooks/useAppTheme';
import { useHistoryStore } from '@/core/store';

export default function History(): JSX.Element {
  const colors = useAppTheme();
  const { history, clearHistory } = useHistoryStore(); // Zustand store
  const styles = createStyles(colors);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📜 Historial de expresiones 📜</Text>

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
