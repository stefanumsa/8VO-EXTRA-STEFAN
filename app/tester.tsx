import React, { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateAST } from '@/core/utils/ast';
import type { Node } from 'regexpp/ast';
import Button from "@/features/regexTester/presentation/components/atoms/Button/Button";
import Text from "@/features/regexTester/presentation/components/atoms/Text/Text";
import { useAppTheme } from '@/core/hooks/useAppTheme';
import { Platform } from 'react-native';



export default function Tester() {
  const colors = useAppTheme();

  const [regex, setRegex] = useState('');
  const [text, setText] = useState('');
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ast, setAST] = useState<Node | null>(null);

  useEffect(() => {
    try {
      const re = new RegExp(regex, 'g');
      const allMatches = [...text.matchAll(re)];
      setMatches(allMatches);
      setError(null);
    } catch (e: any) {
      setMatches([]);
      setError('Expresión inválida');
    }
  }, [regex, text]);

  const generarAST = () => {
    try {
      const tree = generateAST(regex);
      setAST(tree);
      saveToHistory(regex);
      setError(null);
    } catch (e: any) {
      setAST(null);
      setError('No se pudo generar el AST');
    }
  };

  const saveToHistory = async (pattern: string) => {
    try {
      const existing = await AsyncStorage.getItem('regex_history');
      const history = existing ? JSON.parse(existing) : [];
      if (!history.includes(pattern)) {
        history.unshift(pattern);
        await AsyncStorage.setItem('regex_history', JSON.stringify(history.slice(0, 20)));
      }
    } catch (err) {
      console.error('Error guardando en historial:', err);
    }
  };

  const confirmClearFields = () => {
  if (Platform.OS === 'web') {
    clearFields();
  } else {
    Alert.alert(
      '¿Limpiar campos?',
      '¿Estás seguro de que deseas borrar la expresión y el texto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí', onPress: () => clearFields() },
      ]
    );
  }
};

const clearFields = () => {
  setRegex('');
  setText('');
  setMatches([]);
  setAST(null);
  setError(null);
};


  const styles = createStyles(colors);

  const hasAnyInput = regex.trim() !== '' || text.trim() !== '';

  const InteractiveNode = ({ node, depth = 0 }: { node: Node; depth?: number }) => {
    const [expanded, setExpanded] = useState(true);
    const children =
      (node as any).elements ||
      (node as any).alternatives ||
      (node as any).expressions ||
      (node as any).body ||
      [];

    return (
      <View style={{ marginLeft: depth * 12, marginVertical: 4 }}>
        <Text
          onPress={() => setExpanded(!expanded)}
          style={[styles.nodeText, { color: colors.text }]}
        >
          {expanded ? '▼' : '▶'} {node.type}{' '}
          {'raw' in node && (node as any).raw ? `(${(node as any).raw})` : ''}
        </Text>
        {expanded && children.map((child: any, index: number) => (
          <InteractiveNode key={index} node={child} depth={depth + 1} />
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Visualizador de Expresiones Regulares</Text>

      <Text style={styles.label}>Expresión Regular:</Text>
      <Text style={styles.label}>Ejemplo: A[a-z]+[a-z]</Text>
      <Text style={styles.label}>Esta expresion detecta palabras que empiecen con "A" mayuscula. {'\n'}</Text>
      <TextInput
        value={regex}
        onChangeText={setRegex}
        style={styles.input}
        placeholder="Escribe una expresion regular..."
        placeholderTextColor={colors.text}
      />

      <Text style={styles.label}>Texto a analizar:</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        multiline
        style={[styles.input, styles.textArea]}
        placeholder="Escribe un texto..."
        placeholderTextColor={colors.text}
      />

      <Text style={styles.label}>Resultado: </Text>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : matches.length === 0 ? (
        <Text style={[styles.text, { color: '#000000' }]}>No hay coincidencias. </Text>
      ) : (
        <Text style={[styles.text, { color: '#000000' }]}>
          {text.split('').map((char, i) => {
            const isMatched = matches.some(
              (match) =>
                match.index !== undefined &&
                i >= match.index &&
                i < match.index + match[0].length
            );
            return (
              <Text
                key={i}
                style={{
                  backgroundColor: isMatched ? colors.highlight : 'transparent',
                  color: '#000000',
                }}
              >
                {char}
              </Text>
            );
          })}
        </Text>
      )}

      {hasAnyInput && (
        <View style={styles.buttonContainer}>
          <Button title="Generar AST" onPress={generarAST} />
        </View>
      )}

      {hasAnyInput && (
        <View style={styles.buttonContainer}>
          <Button title="Limpiar campos" onPress={confirmClearFields} />
        </View>
      )}

      {ast && (
        <>
          <Text style={styles.titleAST}>Árbol de Sintaxis Abstracta (AST):</Text>
          <View style={{ paddingTop: 10 }}>
            <InteractiveNode node={ast} />
          </View>
        </>
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
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: 12,
      color: colors.text,
    },
    label: {
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    input: {
      borderWidth: 2,
      padding: 10,
      borderRadius: 10,
      marginBottom: 12,
      borderColor: colors.text,
      color: colors.text,
    },
    textArea: {
      height: 70,
      textAlignVertical: 'top',
    },
    buttonContainer: {
      marginBottom: 12,
    },
    error: {
      color: colors.error,
      marginBottom: 12,
    },
    text: {
      flexWrap: 'wrap',
    },
    nodeText: {
      fontWeight: 'bold',
    },
    titleAST: {
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 20,
      color: colors.text,
    },
  });