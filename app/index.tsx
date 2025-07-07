import React from 'react';
import { ScrollView, View, StyleSheet, StyleProp, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import Text from "@/features/regexTester/presentation/components/atoms/Text/Text";
import { useAppTheme } from '@/core/hooks/useAppTheme';
import Card from "@/features/regexTester/presentation/components/atoms/Card/Card";


export default function HomeScreen(): JSX.Element {
  const colors = useAppTheme();
  const styles = createStyles(colors);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>¡Bienvenido a 8VO-EXTRA-STEFAN!</Text>

      <View style={styles.card}>
        <Text style={styles.paragraph}>
          Esta aplicación fue creada por{' '}
          <Text style={styles.bold}>Stefan Oebels Sánchez</Text>.{'\n'}
          Certificación de Software - Extraordinario.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🔍 Tester</Text>
        <Text style={styles.paragraph}>
          Aquí puedes ingresar una expresión regular y un texto para probarla en tiempo real.
          Al presionar <Text style={styles.bold}>"Generar árbol AST"</Text>, verás el árbol de sintaxis abstracta (AST) y tendras acceso a informacion sobre los <Text style={styles.bold}>"Tokens"</Text> .
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📜 Historial</Text>
        <Text style={styles.paragraph}>
          Consulta todas las expresiones que has usado anteriormente.
          Puedes eliminar el historial si quieres empezar desde cero.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📈 Diagrama</Text>
        <Text style={styles.paragraph}>
          Genera diagramas de ferrocarril para visualizar la estructura de tus expresiones regulares de forma gráfica.
        </Text>
      </View>

      
    </ScrollView>
  );
}

const createStyles = (colors: {
  background: string;
  card: string;
  text: string;
  primary: string;
}): {
  container: StyleProp<ViewStyle>;
  title: StyleProp<TextStyle>;
  card: StyleProp<ViewStyle>;
  paragraph: StyleProp<TextStyle>;
  bold: StyleProp<TextStyle>;
  sectionTitle: StyleProp<TextStyle>;
  button: StyleProp<ViewStyle>;
  buttonText: StyleProp<TextStyle>;
} =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 24,
      backgroundColor: colors.background,
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 24,
      color: colors.text,
      textAlign: 'center',
    },
    card: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 15,
      shadowColor: '#808080',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4,
      width: '100%',
      maxWidth: 480,
      marginBottom: 20,
    },
    paragraph: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 22,
      textAlign: 'justify',
    },
    bold: {
      fontWeight: 'bold',
      color: colors.text,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 10,
      color: colors.text,
    },
    button: {
      marginTop: 10,
      paddingVertical: 14,
      paddingHorizontal: 40,
      borderRadius: 30,
      elevation: 3,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
