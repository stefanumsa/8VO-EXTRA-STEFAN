import React, { useState } from 'react';
import { View, TextInput, ScrollView, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateAST } from 'src/core/utils/ast';
import type { Node } from 'regexpp/ast';
import Button from "@/features/regexTester/presentation/components/atoms/Button/Button";
import Text from "@/features/regexTester/presentation/components/atoms/Text/Text";
import { useAppTheme } from '@/core/hooks/useAppTheme';

export default function Tester() {
  const colors = useAppTheme();

  const [regex, setRegex] = useState('');
  const [text, setText] = useState('');
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ast, setAST] = useState<Node | null>(null);

  const saveToHistory = async (pattern: string) => {
    try {
      const existing = await AsyncStorage.getItem('regex_history');
      const history = existing ? JSON.parse(existing) : [];
      if (!history.includes(pattern)) {
        history.unshift(pattern);
        await AsyncStorage.setItem('regex_history', JSON.stringify(history.slice(0, 20)));
      }
    } catch (err) {
      console.error('Error saving history:', err);
    }
  };

  const testRegex = () => {
    try {
      const re = new RegExp(regex, 'g'); 
      const allMatches = [...text.matchAll(re)];
      setMatches(allMatches);
      setError(null);

      const tree = generateAST(regex);
      setAST(tree);

      saveToHistory(regex);
    } catch (e: any) {
      setError(e.message);
      setMatches([]);
      setAST(null);
    }
  };

  const confirmClearFields = () => {
    Alert.alert(
      '¿Limpiar campos?',
      '¿Estás seguro de que deseas borrar la expresión y el texto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí',
          onPress: () => {
            setRegex('');
            setText('');
            setMatches([]);
            setAST(null);
            setError(null);
          },
        },
      ]
    );
  };

  const hasAnyInput = regex.trim() !== '' || text.trim() !== '';

  const InteractiveNode = ({ node, depth = 0 }: { node: Node; depth?: number }): JSX.Element => {
    const [expanded, setExpanded] = useState(true);
    const children: Node[] =
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
        {expanded && children.map((child, index) => (
          <InteractiveNode key={index} node={child} depth={depth + 1} />
        ))}
      </View>
    );
  };

  const styles = createStyles(colors);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Visualizador de Expresiones Regulares
      </Text>

      <Text style={styles.label}>Expresión Regular:</Text>
      <Text style={styles.example}><Text style={styles.labelBold}>Ejemplo</Text>: \b(\w+)\s+\1\b</Text>
      <TextInput
        value={regex}
        onChangeText={setRegex}
        placeholder="Ejemplo: \b(\w+)\s+\1\b"
        placeholderTextColor="#FFFFFF"
        style={styles.input}
      />

      <Text style={styles.label}>Texto a analizar:</Text>
      <Text style={styles.example}>
        <Text style={styles.labelBold}>Ejemplo</Text>: Este es un ejemplo para detectar palabras duplicadas en mayuscula.
      </Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Este es un ejemplo para detectar palabras duplicadas en mayuscula."
        multiline
        placeholderTextColor="#FFFFFF"
        style={[styles.input, styles.textArea]}
      />

      {hasAnyInput && (
        <View style={styles.buttonContainer}>
          <Button title="Probar expresión" onPress={testRegex} />
        </View>
      )}

      {hasAnyInput && (
        <View style={styles.buttonContainer}>
          <Button title="Limpiar campos" onPress={confirmClearFields} />
        </View>
      )}

      <Text style={styles.label}>Resultado:</Text>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : matches.length === 0 ? (
        <Text style={[styles.text, { color: '#000000' }]}>No hay coincidencias.</Text>
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

      {ast && (
        <>
          <Text style={styles.titleAST}>
            Árbol de Sintaxis Abstracta (AST):
          </Text>
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
    labelBold: {
      fontWeight: 'bold',
      color: colors.text,
    },
    example: {
      marginBottom: 8,
      color: colors.text,
    },
    input: {
      borderWidth: 2,
      padding: 10,
      borderRadius: 10,
      marginBottom: 12,
      borderColor: '#FFFFFF',
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
      color: colors.text,
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
    highlight: {
      backgroundColor: colors.highlight,
    },
  });
