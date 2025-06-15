import React, { useState } from 'react';
import { View, TextInput, Text, ScrollView } from 'react-native';
import { useRegexTester } from '../hooks/useRegexTester';
import { MatchResult } from '../components/MatchResult';

export default function RegexTesterScreen() {
  const [regex, setRegex] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');

  const { matches, error } = useRegexTester(regex, flags, text);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text>Expresión Regular:</Text>
      <TextInput
        value={regex}
        onChangeText={setRegex}
        placeholder="Ej: \\d+"
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />

      <Text>Bandera (flags):</Text>
      <TextInput
        value={flags}
        onChangeText={setFlags}
        placeholder="Ej: g, i, m"
        style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
      />

      <Text>Texto a analizar:</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        multiline
        placeholder="Ej: Prueba 123 con varios números 456"
        style={{ borderWidth: 1, padding: 8, height: 100, textAlignVertical: 'top' }}
      />

      <Text style={{ marginTop: 16, fontWeight: 'bold' }}>Resultado:</Text>
      {error ? (
        <Text style={{ color: 'red' }}>{error}</Text>
      ) : (
        <MatchResult text={text} matches={matches} />
      )}
    </ScrollView>
  );
}
