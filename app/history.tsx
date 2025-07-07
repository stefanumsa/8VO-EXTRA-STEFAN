import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard'; // <-- Importa Clipboard
import Button from "@/features/regexTester/presentation/components/atoms/Button/Button";
import Text from "@/features/regexTester/presentation/components/atoms/Text/Text";
import { useAppTheme } from '@/core/hooks/useAppTheme';
import { useHistoryStore } from '@/core/store';
import { useRouter } from 'expo-router';

export default function History(): JSX.Element {
  const colors = useAppTheme();
  const { history, clearHistory, removeFromHistory } = useHistoryStore();
  const styles = createStyles(colors);
  const router = useRouter();

  // Función para copiar al portapapeles
  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Copiado', 'Expresión copiada al portapapeles');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📜 Historial de expresiones 📜</Text>

      <View style={{ marginBottom: 12 }}>
        <Button
          title="Ir a Tester"
          onPress={() => router.push('/tester')}
        />
      </View>

      {history.length > 0 && (
        <View style={styles.buttonContainer}>
          <Button title="Borrar historial." onPress={clearHistory} />
        </View>
      )}

      {history.length === 0 ? (
        <Text style={styles.noHistoryText}>No hay expresiones guardadas aún.</Text>
      ) : (
        history.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemText}>{item}</Text>
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                onPress={() => copyToClipboard(item)}
                style={[styles.copyButton, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>Copiar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeFromHistory(index)}
                style={[styles.deleteButton, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.deleteButtonText, { color: colors.text }]}>Eliminar</Text>
              </TouchableOpacity>
            </View>
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
  buttonsRow: StyleProp<ViewStyle>;
  copyButton: StyleProp<ViewStyle>;
  buttonText: StyleProp<TextStyle>;
  deleteButton: StyleProp<ViewStyle>;
  deleteButtonText: StyleProp<TextStyle>;
  backButton: StyleProp<ViewStyle>;
  backButtonText: StyleProp<TextStyle>;
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
      marginBottom: 8,
    },
    buttonsRow: {
      flexDirection: 'row',
      gap: 10,
    },
    copyButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontWeight: 'bold',
      fontSize: 14,
    },
    deleteButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    deleteButtonText: {
      fontWeight: 'bold',
      fontSize: 14,
    },
    backButton: {
      marginTop: 20,
      padding: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
    backButtonText: {
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
