import React, { useState, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Button from "@/features/regexTester/presentation/components/atoms/Button/Button";
import Text from "@/features/regexTester/presentation/components/atoms/Text/Text";

export default function History() {
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

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 }}>
        Historial de Expresiones Usadas
      </Text>

      {history.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <Button title="Borrar historial" onPress={clearHistory} />
        </View>
      )}

      {history.length === 0 ? (
        <Text>No hay expresiones guardadas aún.</Text>
      ) : (
        history.map((item, index) => (
          <View
            key={index}
            style={{
              marginBottom: 10,
              padding: 10,
              borderRadius: 8,
              backgroundColor: '#f0f0f0',
              borderLeftWidth: 4,
              borderLeftColor: '#007bff',
            }}
          >
            <Text style={{ fontFamily: 'monospace', color: '#333' }}>{item}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}
