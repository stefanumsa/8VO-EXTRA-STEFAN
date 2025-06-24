import React, { useState } from 'react';
import { View, TextInput, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateAST } from 'src/core/utils/ast';
import type { Node } from 'regexpp/ast';
import Button from "@/features/regexTester/presentation/components/atoms/Button/Button";
import Text from "@/features/regexTester/presentation/components/atoms/Text/Text";

export default function Tester() {
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
        <Text onPress={() => setExpanded(!expanded)} style={{ fontWeight: 'bold', color: '#000000' }}>
          {expanded ? '▼' : '▶'} {node.type}{' '}
          {'raw' in node && (node as any).raw ? `(${(node as any).raw})` : ''}
        </Text>
        {expanded && children.map((child, index) => (
          <InteractiveNode key={index} node={child} depth={depth + 1} />
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: 'bold', marginBottom: 12 }}>
        Visualizador de Expresiones Regulares
      </Text>

      <Text style={{ fontWeight: 'bold' }}>Expresión Regular:</Text>
      <Text><Text style={{ fontWeight: 'bold' }}>Ejemplo</Text>: \b(\w+)\s+\1\b</Text>
      <TextInput
        value={regex}
        onChangeText={setRegex}
        placeholder="Ejemplo: \b(\w+)\s+\1\b"
        style={{ borderWidth: 2, padding: 10, borderRadius: 10, marginBottom: 12 }}
      />

      <Text style={{ fontWeight: 'bold' }}>Texto a analizar:</Text>
      <Text>
        <Text style={{ fontWeight: 'bold' }}>Ejemplo</Text>: Este es un un ejemplo para detectar palabras palabras duplicadas
      </Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Este es un un ejemplo para detectar palabras palabras duplicadas"
        multiline
        style={{ borderWidth: 2, padding: 10, height: 70, textAlignVertical: 'top', borderRadius: 10, marginBottom: 12 }}
      />

      {hasAnyInput && (
        <View style={{ marginBottom: 12 }}>
        <Button title="Probar expresión" onPress={testRegex} />
      </View>
      )}

      {hasAnyInput && (
        <View style={{ marginBottom: 12 }}>
          <Button title="Limpiar campos" onPress={confirmClearFields} />
        </View>
      )}

      <Text style={{ fontWeight: 'bold' }}>Resultado:</Text>
      {error ? (
        <Text style={{ color: 'red' }}>{error}</Text>
      ) : matches.length === 0 ? (
        <Text>No hay coincidencias.</Text>
      ) : (
        <Text>
          {text.split('').map((char, i) => {
            const isMatched = matches.some(
              (match) =>
                match.index !== undefined &&
                i >= match.index &&
                i < match.index + match[0].length
            );
            return (
              <Text key={i} style={{ backgroundColor: isMatched ? 'yellow' : 'transparent' }}>
                {char}
              </Text>
            );
          })}
        </Text>
      )}

      {ast && (
        <>
          <Text style={{ fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>
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
