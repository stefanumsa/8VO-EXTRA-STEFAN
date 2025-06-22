import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, SafeAreaView,  Alert } from 'react-native';
import { generateAST } from 'src/core/utils/ast';
import type { Node } from 'regexpp/ast';
import Button from "@/features/regexTester/presentation/components/atoms/Button/Button";

export default function Tester() {
  const [regex, setRegex] = useState('');
  const [flags, setFlags] = useState('');
  const [text, setText] = useState('');
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ast, setAST] = useState<Node | null>(null);
  const [historial, setHistorial] = useState<string[]>([]); // Nuevo estado para historial

  const testRegex = (pattern: string, flags: string, input: string) => {
    try {
      const re = new RegExp(pattern, flags);
      const allMatches = [...input.matchAll(re)];
      setMatches(allMatches);
      setError(null);

      const tree = generateAST(pattern);
      setAST(tree);
    } catch (e: any) {
      setError(e.message);
      setMatches([]);
      setAST(null);
    }
  };

  useEffect(() => {
    testRegex(regex, flags, text);
  }, [regex, flags, text]);

  const handleGuardarExpresion = () => {
    if (!regex.trim()) {
      Alert.alert('Error', 'La expresión regular no puede estar vacía.');
      return;
    }

    const expresionCompleta = `/${regex}/${flags}`;
    setHistorial((prev) => [expresionCompleta, ...prev]);
    Alert.alert('Guardado', `Expresión guardada: ${expresionCompleta}`);
  };

  const InteractiveNode = ({
    node,
    depth = 0,
  }: {
    node: Node;
    depth?: number;
  }): JSX.Element => {
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
          style={{
            fontWeight: 'bold',
            color: '#1d4ed8',
          }}
        >
          {expanded ? '▼' : '▶'} {node.type}{' '}
          {'raw' in node && (node as any).raw ? `(${(node as any).raw})` : ''}
        </Text>
        {expanded &&
          children.map((child, index) => (
            <InteractiveNode key={index} node={child} depth={depth + 1} />
          ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text
          style={{
            fontSize: 20,
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: 12,
          }}
        >
          Visualizador de Expresiones Regulares
        </Text>

        <Text style={{ fontWeight: 'bold' }}>Expresión Regular:</Text>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>Ejemplo</Text>: \b(\w+)\s+\1\b
        </Text>
        <TextInput
          value={regex}
          onChangeText={setRegex}
          placeholder="Ejemplo: \b(\w+)\s+\1\b"
          style={{ borderWidth: 1, padding: 10, marginBottom: 12 }}
        />

        <Text style={{ fontWeight: 'bold' }}>Bandera:</Text>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>Ejemplo</Text>: gi
        </Text>
        <TextInput
          value={flags}
          onChangeText={setFlags}
          placeholder="Ejemplo: gi"
          style={{ borderWidth: 1, padding: 10, marginBottom: 12 }}
        />

        <Text style={{ fontWeight: 'bold' }}>Texto a analizar:</Text>
        <Text>
          <Text style={{ fontWeight: 'bold' }}>Ejemplo</Text>: Este es un un
          ejemplo para detectar palabras palabras duplicadas
        </Text>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Ejemplo: Este es un un ejemplo para detectar palabras palabras duplicadas"
          multiline
          style={{
            borderWidth: 1,
            padding: 10,
            height: 100,
            textAlignVertical: 'top',
            marginBottom: 12,
          }}
        />

        {}
        <View style={{ marginBottom: 16 }}>
          <Button title="Guardar Expresión" onPress={handleGuardarExpresion} />
        </View>

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
                <Text
                  key={i}
                  style={{
                    backgroundColor: isMatched ? 'yellow' : 'transparent',
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
            <Text
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: 20,
              }}
            >
              Árbol de Sintaxis Abstracta (AST):
            </Text>
            <View style={{ paddingTop: 10 }}>
              <InteractiveNode node={ast} />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
