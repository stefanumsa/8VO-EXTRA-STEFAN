import { ScrollView, View } from 'react-native';
import Text from "@/features/regexTester/presentation/components/atoms/Text/Text";

export default function HomeScreen() {
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#f9f9f9',
      }}
    >
      <View
        style={{
          backgroundColor: '#ffffff',
          padding: 24,
          borderRadius: 12,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 6,
          elevation: 3,
          maxWidth: 480,
          marginBottom: 24,
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            fontWeight: '600',
            color: '#000000',
            lineHeight: 26,
          }}
        >
          Esta aplicación fue creada por{' '}
          <Text style={{ fontWeight: 'bold' }}>Stefan Oebels Sánchez</Text>.{'\n'}
          Certificación de Software - Extraordinario.{'\n'}
          Si da click en el apartado de{' '}
          <Text style={{ fontStyle: 'italic' }}>"Página Principal"</Text>, podrá acceder a las diferentes pestañas.
        </Text>
      </View>

      <View style={{ width: '100%', maxWidth: 480 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#000000' }}>
          Tester
        </Text>
        <Text style={{ marginBottom: 16, lineHeight: 22, color: '#000000' }}>
          En esta pantalla el usuario puede ingresar una expresión regular y un texto de prueba.
          Al hacer clic en "Probar", se mostrarán las coincidencias encontradas junto con el árbol de sintaxis abstracta (AST) generado.
        </Text>

        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#000000' }}>
          Historial
        </Text>
        <Text style={{ marginBottom: 16, lineHeight: 22, color: '#000000' }}>
          Aquí se mostrarán todas las expresiones regulares que el usuario ha utilizado. Se puede consultar el historial completo o eliminarlo si se desea.
        </Text>

        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#000000' }}>
          Diagrama
        </Text>
        <Text style={{ marginBottom: 16, lineHeight: 22, color: '#000000' }}>
          Permite generar un diagrama de ferrocarril a partir de una expresión regular. Este diagrama ayuda a visualizar gráficamente la estructura de la expresión.
        </Text>
      </View>
    </ScrollView>
  );
}
