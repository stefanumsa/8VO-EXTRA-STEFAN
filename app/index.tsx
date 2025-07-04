import React from 'react';
import { ScrollView, View, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Text from "@/features/regexTester/presentation/components/atoms/Text/Text"; // Componente atómico personalizado
import { useAppTheme } from '@/core/hooks/useAppTheme'; // Hook que obtiene el tema actual (claro/oscuro)

/**
 * Componente principal de la pantalla de bienvenida.
 * Muestra una introducción general y explica la funcionalidad de cada pestaña de la app.
 */
export default function HomeScreen(): JSX.Element {
  const colors = useAppTheme();               // Hook que retorna los colores activos del tema
  const styles = createStyles(colors);        // Estilos dinámicos basados en el tema

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.paragraph}>
          Esta aplicación fue creada por{' '}
          <Text style={styles.bold}>Stefan Oebels Sánchez</Text>.{'\n'}
          Certificación de Software - Extraordinario.{'\n'}
          Si da click en el apartado de{' '}
          <Text style={styles.italic}>"Página Principal"</Text>, podrá acceder a las diferentes pestañas. 
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>--Tester--</Text>
        <Text style={styles.paragraph}>
          En esta pantalla el usuario puede ingresar una expresión regular y un texto de prueba.
          Al hacer clic en "Probar Expresión", se mostrarán las coincidencias encontradas junto con el árbol de sintaxis abstracta (AST) generado.{'\n'}{'\n'}
        </Text>

        <Text style={styles.subtitle}>--Historial--</Text>
        <Text style={styles.paragraph}>
          Aquí se mostrarán todas las expresiones regulares que el usuario ha utilizado. 
          Se puede consultar el historial completo o eliminarlo si se desea. {'\n'}{'\n'}
        </Text>

        <Text style={styles.subtitle}>--Diagrama--</Text>
        <Text style={styles.paragraph}>
          Permite generar un diagrama de ferrocarril a partir de una expresión regular. 
          Este diagrama ayuda a visualizar gráficamente la estructura de la expresión.
        </Text>
      </View>
    </ScrollView>
  );
}

//Función para generar estilos dinámicos según el tema actual.
 
const createStyles = (colors: {
  background: string;
  card: string;
  text: string;
}): {
  container: StyleProp<ViewStyle>;
  card: StyleProp<ViewStyle>;
  paragraph: StyleProp<TextStyle>;
  bold: StyleProp<TextStyle>;
  italic: StyleProp<TextStyle>;
  section: StyleProp<ViewStyle>;
  subtitle: StyleProp<TextStyle>;
} =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
      backgroundColor: colors.background,
    },
    card: {
      backgroundColor: colors.card,
      padding: 24,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 3,
      maxWidth: 480,
      marginBottom: 24,
    },
    paragraph: {
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      lineHeight: 26,
    },
    bold: {
      fontWeight: 'bold',
      color: colors.text,
    },
    italic: {
      fontStyle: 'italic',
      color: colors.text,
    },
    section: {
      width: '100%',
      maxWidth: 480,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      color: colors.text,
    },
  });
