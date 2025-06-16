import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';

export default function Tester() {
  const [regex, setRegex] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [error, setError] = useState<string | null>(null);

  const testRegex = (pattern: string, flags: string, input: string) => {
    try {
      const re = new RegExp(pattern, flags);
      const allMatches = [...input.matchAll(re)];
      setMatches(allMatches);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setMatches([]);
    }
  };

  React.useEffect(() => {
    testRegex(regex, flags, text);
  }, [regex, flags, text]);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 20,textAlign: 'center', marginBottom: 12 }}>Visualizador de Expresiones Regulares</Text>

      <Text style={{ marginBottom: 4 }}>Expresión Regular:</Text>
      <TextInput
        value={regex}
        onChangeText={setRegex}
        placeholder="Ejemplo: \\d+"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 12 }}
      />

      <Text style={{ marginBottom: 4 }}>Bandera (flags):</Text>
      <TextInput
        value={flags}
        onChangeText={setFlags}
        placeholder="Ejemplo: gi"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 12 }}
      />

      <Text style={{ marginBottom: 4 }}>Texto a analizar:</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Ejemplo: Hola 123, prueba 456"
        multiline
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          height: 100,
          textAlignVertical: 'top',
          marginBottom: 12,
        }}
      />

      <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Resultado:</Text>
      {error ? (
        <Text style={{ color: 'red' }}>{error}</Text>
      ) : matches.length === 0 ? (
        <Text>No hay coincidencias.</Text>
      ) : (
        <Text>
          {text.split('').map((char, i) => {
            const isMatched = matches.some(
              (match) => match.index !== undefined &&
                i >= match.index &&
                i < match.index + match[0].length
            );
            return (
              <Text
                key={i}
                style={{ backgroundColor: isMatched ? 'yellow' : 'transparent' }}
              >
                {char}
              </Text>
            );
          })}
        </Text>
      )}
    </ScrollView>
  );
}
