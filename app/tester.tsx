import React, { useState, useEffect } from 'react';
import {View,TextInput,ScrollView,Alert,StyleSheet,Platform,Modal,TouchableOpacity,Text as RNText,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateAST } from '@/core/utils/ast';
import type { Node } from 'regexpp/ast';
import Button from '@/features/regexTester/presentation/components/atoms/Button/Button';
import Text from '@/features/regexTester/presentation/components/atoms/Text/Text';
import { useAppTheme } from '@/core/hooks/useAppTheme';
import { useSelector } from 'react-redux';
import { RootState } from '@/core/store';
import { darkColors, lightColors } from '@/core/theme/colors';
import { useHistoryStore } from '@/core/store';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { router } from 'expo-router';
import { useASTStore } from '@/core/store/astStore';




export default function Tester() {
  const colors = useAppTheme();
  const isDark = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = isDark ? darkColors : lightColors;
  const { history, addToHistory, clearHistory } = useHistoryStore();
  const [showASTModal, setShowASTModal] = useState(false);
  const [showTokenInfo, setShowTokenInfo] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [regex, setRegex] = useState('');
  const [text, setText] = useState('');
  const [exampleIndex, setExampleIndex] = useState(0);
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ast, setAST] = useState<Node | null>(null);
  const { astList } = useASTStore();
  


  const examples = [
    {
      regex:
        '^(?!.*\\b(\\w+)\\b.*\\b\\1\\b)(?=.*[A-Z].*[A-Z])(?=.*\\d{2,})(?=.*[!@#\\$%\\^&\\*\\(\\)\\-_=\+\\[\\]\\{\\};:\'",.<>\\/\\?\\\\|`~]).{12,64}(?<!\\s)$',
      text: 'MyP@ssword2024!SecureKey',
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

  useEffect(() => {
    AsyncStorage.removeItem('regex-history').catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const re = new RegExp(regex, 'g');
      const allMatches = [...text.matchAll(re)];
      setMatches(allMatches);
      setError(null);
    } catch {
      setMatches([]);
      setError('Expresión inválida');
    }
  }, [regex, text]);

  const { addAST } = useASTStore();

const generarAST = () => {
  try {
    const tree = generateAST(regex);
    setAST(tree);
   addToHistory({
  regex,
  text,
  result: matches.map((m) => m[0]).join(', '),
  timestamp: new Date().toISOString(), 
});



    // Guardar en el store Zustand
    addAST({ regex, ast: tree });

    setError(null);

    Alert.alert('AST generado', 'El AST se generó con éxito.', [
      {
        text: 'Ver AST',
        onPress: () => router.push('/ast'), // Navegar a la pestaña AST
      },
      {
        text: 'Cerrar',
        style: 'cancel',
      },
    ]);
  } catch {
    setAST(null);
    setError('No se pudo generar el AST');
  }
};

  const confirmClearFields = () => {
    if (Platform.OS === 'web') {
      clearFields();
    } else {
      Alert.alert('¿Limpiar campos?', '¿Estás seguro que deseas limpiar los campos?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí', onPress: clearFields },
      ]);
    }
  };

  const clearFields = () => {
    setRegex('');
    setText('');
    setMatches([]);
    setAST(null);
    setError(null);
  };

  const exportAST = async () => {
    Alert.alert('DEBUG', 'Se presionó el botón Exportar AST');

    if (!ast) {
      Alert.alert('Advertencia', 'No hay AST generado aún.');
      return;
    }

    if (Platform.OS === 'web') {
      Alert.alert('No disponible en Web', 'La exportación solo funciona en un dispositivo o emulador.');
      return;
    }

    const safeStringify = (obj: any, space = 2) => {
      const seen = new WeakSet();
      return JSON.stringify(obj, function (key, value) {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return '[Circular]';
          }
          seen.add(value);
        }
        return value;
      }, space);
    };

    const fileUri = FileSystem.documentDirectory + 'ast.json';

    try {
      const json = safeStringify(ast);
      await FileSystem.writeAsStringAsync(fileUri, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      Alert.alert('Éxito', 'AST exportado como archivo JSON.');

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('No disponible', 'Compartir no es compatible en este dispositivo.');
        return;
      }

      await Sharing.shareAsync(fileUri);
    } catch (err) {
      console.error('Error al compartir archivo:', err);
      Alert.alert('Error', 'No se pudo exportar el archivo.');
    }
  };

  const cargarEjemplo = () => {
    const example = examples[exampleIndex];
    setRegex(example.regex);
    setText(example.text);
    setExampleIndex((prev) => (prev + 1) % examples.length);
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
        {expanded &&
          children.map((child: any, index: number) => (
            <InteractiveNode key={index} node={child} depth={depth + 1} />
          ))}
      </View>
    );
  };

return (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>🔍Tester de Expresiones Regulares🔍</Text>

    <View style={{ flexDirection: 'row', gap: 10 }}>
  <TouchableOpacity
    onPress={() => setShowTokenInfo(true)}
    style={[styles.infoButton, { backgroundColor: colors.primary }]}
  >
    <RNText style={[styles.infoButtonText, { color: colors.text }]}>❓</RNText>
  </TouchableOpacity>

  <TouchableOpacity
  onPress={() => router.push('/history')}
  style={[styles.infoButton, { backgroundColor: colors.primary }]}
>
  <RNText style={[styles.infoButtonText, { color: colors.text }]}>📜</RNText>
</TouchableOpacity>

  <TouchableOpacity
  onPress={() => router.push('/ast')}
  style={[styles.infoButton, { backgroundColor: colors.primary }]}
>
  <RNText style={[styles.infoButtonText, { color: colors.text }]}>🌲</RNText>
</TouchableOpacity>
</View>


    <Text style={styles.label}>Expresión Regular:</Text>
    <TextInput
      value={regex}
      onChangeText={setRegex}
      style={styles.input}
      placeholder="Escribe una expresión regular..."
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

    <Text style={styles.label}>Resultado:</Text>
    {error ? (
      <Text style={styles.error}>{error}</Text>
    ) : (
      <Text style={[styles.text, { color: colors.text }]}>
        {text.split('').map((char, i) => {
          const matched = matches.some(
            (m) => m.index !== undefined && i >= m.index && i < m.index + m[0].length
          );
          return (
            <Text
              key={i}
              style={{
                backgroundColor: matched ? colors.highlight : 'transparent',
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
      <Button title="Probar con un ejemplo" onPress={cargarEjemplo} />
    </View>

    {hasAnyInput && (
      <>
        <View style={styles.buttonContainer}>
          <Button title="Generar árbol AST" onPress={generarAST} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Borrar expresión y texto" onPress={confirmClearFields} />
        </View>
        {ast && (
          <View style={styles.buttonContainer}>
            <Button title="Exportar AST" onPress={exportAST} />
          </View>
        )}
      </>
    )}

    {/* Mostrar el AST */}
    {ast && (
      <>
        <Text style={styles.titleAST}>Árbol de Sintaxis Abstracta (AST)</Text>
        <InteractiveNode node={ast} />
      </>
    )}

    {/* Modal para explicación de tokens */}
    <Modal
      visible={showTokenInfo}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setShowTokenInfo(false)}
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Explicación de Expresiones Regulares
          </Text>

          <Text style={[styles.modalText, { color: colors.text }]}>
            <Text style={{ fontWeight: 'bold', color: colors.text }}>Definición Formal:</Text>
            {'\n'}
             Una expresión regular (regex o regexp) es una secuencia de caracteres que define un patrón de búsqueda. Se utiliza para encontrar, validar, o manipular cadenas de texto basándose en ese patrón.            {'\n\n'}

            <Text style={{ fontWeight: 'bold', color: colors.text }}>Ejemplos Detallados:</Text>
            {'\n'}
            - b[aeiou]bble	
            {'\n'}
            - go*gle
            {'\n'}
            - colou?r
            {'\n'}
            - gray|grey	
            {'\n'}
            - hello
            {'\n'}
            - [b-chm-pP]at|ot 
            {'\n\n'}

            <Text style={{ fontWeight: 'bold', color: colors.text }}>Como se Usan:</Text>
            {'\n'}
             Las expresiones regulares son patrones que se usan para buscar, validar o manipular texto. Primero defines un patrón que describe lo que quieres encontrar (como números, letras o símbolos), y luego aplicas ese patrón sobre un texto para comprobar si coincide, extraer partes específicas o reemplazar contenido.            {'\n\n'}

            <Text style={{ fontWeight: 'bold', color: colors.text }}>Importancia:</Text>
            {'\n'}
            - Validar entradas de usuario (emails, contraseñas, teléfonos, etc.).	
            {'\n'}
            - Buscar y extraer datos en texto (números, palabras clave).
            {'\n'}
            - Reemplazar palabras/patrones en texto.
            {'\n'}
            Dividir cadenas de texto.

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
    label: {
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    title: {
      fontSize: 20,
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: 12,
      color: colors.text,
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
      color: colors.highlight,
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
      fontSize: 16,
    },
    modalContainer: {
      flex: 1,
      padding: 20,
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
