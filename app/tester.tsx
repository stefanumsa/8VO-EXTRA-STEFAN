import React, { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, Alert, StyleSheet, Platform, Modal, TouchableOpacity, Text as RNText } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateAST } from '@/core/utils/ast';
import type { Node } from 'regexpp/ast';
import Button from "@/features/regexTester/presentation/components/atoms/Button/Button";
import Text from "@/features/regexTester/presentation/components/atoms/Text/Text";
import { useAppTheme } from '@/core/hooks/useAppTheme';
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store';
import { darkColors, lightColors } from '@/core/theme/colors';

export default function Tester() {
  const colors = useAppTheme();

  // Mover hooks dentro del componente
  const isDark = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = isDark ? darkColors : lightColors;

  // Estado para mostrar modal de explicación de tokens
  const [showTokenInfo, setShowTokenInfo] = useState(false);

  const examples = [
    {
      regex: '^(?!.*\\b(\\w+)\\b.*\\b\\1\\b)(?=.*[A-Z].*[A-Z])(?=.*\\d{2,})(?=.*[!@#\\$%\\^&\\*\\(\\)\\-_=\+\\[\\]\\{\\};:\'",.<>\\/\\?\\\\|`~]).{12,64}(?<!\\s)$',
      text: 'MyP@ssword2024!SecureKey'
    },
    { regex: '\\b\\w+\\b', text: 'Hola mundo, este es un texto de prueba 123.' },
    { regex: '\\d+', text: 'Números: 123, 456, 7890.' },
    { regex: '[aeiou]', text: 'Vocales en esta oración.' },
    { regex: '^Hola', text: 'Hola, ¿cómo estás? Hola de nuevo.' },
    { regex: '\\s+', text: 'Separar por espacios y tabulaciones.' },
    { regex: '\\b\\d{4}\\b', text: 'Año 2025 es un número de cuatro dígitos.' },
    { regex: 'colou?r', text: 'color y colour son válidos.' },
    { regex: '[A-Z][a-z]+', text: 'Nombres: Ana, Pedro, Carlos.' },
    { regex: '\\w+@\\w+\\.com', text: 'Correo: ejemplo@correo.com' },
    { regex: '(foo|bar)', text: 'foo y bar están en esta frase.' },
  ];

  const [regex, setRegex] = useState('');
  const [text, setText] = useState('');
  const [exampleIndex, setExampleIndex] = useState(0);
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ast, setAST] = useState<Node | null>(null);

  const cargarEjemplo = () => {
    const example = examples[exampleIndex];
    setRegex(example.regex);
    setText(example.text);
    setExampleIndex((prev) => (prev + 1) % examples.length);
  };

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
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        <Text style={[styles.label, { flex: 1 }]}>Expresión Regular:</Text>
        <TouchableOpacity
          onPress={() => setShowTokenInfo(true)}
          style={[styles.infoButton, { backgroundColor: colors.primary }]}
        >
          <RNText style={[styles.infoButtonText, { color: colors.text }]}>
            ¿Qué es un token?
          </RNText>
        </TouchableOpacity>
      </View>

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
  <Text style={[styles.text, { color: colors.text }]}>No hay coincidencias.</Text>
) : (
  <Text style={[styles.text, { color: colors.text }]}>
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
            color: colors.text,
          }}
        >
          {char}
        </Text>
      );
    })}
  </Text>
)}
      <View style={styles.buttonContainer}>
        <Button title="Probar con ejemplo" onPress={cargarEjemplo} />
      </View>

      {hasAnyInput && (
        <View style={styles.buttonContainer}>
          <Button title="Generar árbol AST" onPress={generarAST} />
        </View>
      )}

      {hasAnyInput && (
        <View style={styles.buttonContainer}>
          <Button title="Borrar expresión y texto" onPress={confirmClearFields} />
        </View>
      )}

      {ast && (
        <>
          <Text style={styles.titleAST}>Árbol de Sintaxis Abstracta (AST):</Text>
          <View style={{ paddingTop: 15 }}>
            <InteractiveNode node={ast} />
          </View>
        </>
      )}

      {/* Modal para explicación de tokens */}
      <Modal
        visible={showTokenInfo}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowTokenInfo(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.modalTitle}>Explicación de Tokens en Expresiones Regulares</Text>
            <Text style={styles.modalText}>
              <Text style={{ fontWeight: 'bold' }}>Definicion Formal:</Text>{'\n'}
              Un token es la unidad mínima que representa un significado léxico en la expresión regular, como un carácter simple, un metacarácter, un cuantificador, etc.{'\n\n'}

              <Text style={{ fontWeight: 'bold' }}>Ejemplos Detallados:</Text>{'\n'}
              - Caracteres literales: a, b, 1{'\n'}
              - Metacaracteres: ., *, +, ?{'\n'}
              - Clases de caracteres: [a-z], {'\\d'}, {'\\w'}{'\n'}
              - Cuantificadores: {'{1,3}'}, +, *{'\n'}
              - Grupos: (abc), (?:xyz){'\n'}
              - Anclas: ^, ${'\n\n'}

              <Text style={{ fontWeight: 'bold' }}>Como se Usan:</Text>{'\n'}
              Estos tokens se combinan para formar patrones complejos que permiten buscar, validar y manipular texto de manera poderosa y flexible.{'\n\n'}

              <Text style={{ fontWeight: 'bold' }}>Importancia:</Text>{'\n'}
              Conocer los tokens es fundamental para construir y entender expresiones regulares correctamente, además de interpretar el Árbol de Sintaxis Abstracta (AST) que representa la estructura de la expresión.
            </Text>
          </ScrollView>

          <TouchableOpacity
            onPress={() => setShowTokenInfo(false)}
            style={[styles.modalCloseButton, { backgroundColor: theme.primary }]}
          >
            <Text style={[styles.modalCloseButtonText, { color: theme.text }]}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    infoButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 30,
      elevation: 5,
      alignItems: 'center',
      marginBottom: 12,
    },
    infoButtonText: {
      fontWeight: 'bold',
      fontSize: 12,
    },
    modalContainer: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    scrollContent: {
      paddingBottom: 40,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    modalText: {
      fontSize: 16,
      lineHeight: 24,
    },
    modalCloseButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 30,
      elevation: 4,
      alignItems: 'center',
      marginTop: 12,
    },
    modalCloseButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
