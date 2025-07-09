import React, { useState } from 'react';
import {View,ScrollView,StyleSheet,TouchableOpacity,Alert,Modal,Text as RNText,} from 'react-native';
import * as Clipboard from 'expo-clipboard'; // Módulo para copiar texto al portapapeles
import Button from "@/features/regexTester/presentation/components/atoms/Button/Button";
import Text from "@/features/regexTester/presentation/components/atoms/Text/Text";
import { useAppTheme } from '@/core/hooks/useAppTheme'; // Hook personalizado para obtener colores del tema
import { useHistoryStore } from '@/core/store'; // Estado global con Zustand para el historial
import { useRouter } from 'expo-router'; // Navegación entre pantallas

export default function History(): JSX.Element {
  const colors = useAppTheme();
  const { history, clearHistory, removeFromHistory } = useHistoryStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<null | typeof history[0]>(null);
  const styles = createStyles(colors);
  const router = useRouter();

  // Copia un texto al portapapeles y muestra una alerta
  const copyToClipboard = (text: string, label?: string) => {
    Clipboard.setString(text);
    Alert.alert('Copiado', `${label ?? 'Texto'} copiado al portapapeles`);
  };

  const openDetailsModal = (item: typeof history[0]) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  // Formatea el timestamp para mostrarlo en formato legible (español)
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📜 Historial de expresiones </Text>

        <View style={{ marginBottom: 12 }}>
          <Button title="Ir a Tester" onPress={() => router.push('/tester')} />
        </View>

        {history.length > 0 && (
          <View style={styles.buttonContainer}>
            <Button title="Borrar historial." onPress={clearHistory} />
          </View>
        )}

        {history.length === 0 ? (
          <Text style={styles.noHistoryText}>No hay expresiones guardadas aún.</Text>
        ) : (
            // Lista de elementos del historial
          history.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <TouchableOpacity onPress={() => openDetailsModal(item)}>
                <Text style={styles.itemText}>{item.regex}</Text>
                <Text style={styles.timestampText}>{formatTimestamp(item.timestamp)}</Text>
              </TouchableOpacity>

              {/* Botones para copiar o eliminar */}
              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  onPress={() => copyToClipboard(item.regex, 'Expresión')}
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

      {/* Modal de detalles */}
      {selectedItem && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setModalVisible(false)}
        >
          <ScrollView contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalTitle}>🧾 Detalles de la expresión</Text>

            <Text style={styles.label}>Expresión:</Text>
            <Text style={styles.modalText}>{selectedItem.regex}</Text>
            <Button
              title="Copiar expresión"
              onPress={() => copyToClipboard(selectedItem.regex, 'Expresión')}
            />

            <Text style={styles.label}>Texto analizado:</Text>
            <Text style={styles.modalText}>{selectedItem.text}</Text>
            <Button
              title="Copiar texto"
              onPress={() => copyToClipboard(selectedItem.text, 'Texto')}
            />

            <Text style={styles.label}>Resultado:</Text>
            <Text style={styles.modalText}>{selectedItem.result}</Text>
            <Button
              title="Copiar resultado"
              onPress={() => copyToClipboard(selectedItem.result, 'Resultado')}
            />

            <Text style={[styles.label, { marginTop: 20 }]}>Fecha de guardado:</Text>
            <Text style={styles.timestampText}>{formatTimestamp(selectedItem.timestamp)}</Text>

            <View style={{ marginTop: 20 }}>
              <Button title="Volver" onPress={() => setModalVisible(false)} />
            </View>
          </ScrollView>
        </Modal>
      )}
    </>
  );
}

// Estilos dinámicos según colores del tema
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
      backgroundColor: colors.card,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    itemText: {
      fontFamily: 'monospace',
      color: colors.text,
      marginBottom: 4,
    },
    timestampText: {
      fontSize: 12,
      color: colors.text,
      fontStyle: 'italic',
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
    modalContainer: {
      padding: 20,
      backgroundColor: colors.background,
      flexGrow: 1,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 16,
      color: colors.text,
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 8,
      color: colors.text,
      fontFamily: 'monospace',
    },
    label: {
      fontWeight: 'bold',
      marginTop: 12,
      marginBottom: 4,
      color: colors.text,
    },
  });
