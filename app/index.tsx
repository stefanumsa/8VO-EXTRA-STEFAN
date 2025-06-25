import { View } from 'react-native';
import Text from "@/features/regexTester/presentation/components/atoms/Text/Text";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
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
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            fontWeight: '600',
            color: '#333',
            lineHeight: 26,
          }}
        >
          Esta Aplicación fue Creada por{' '}
          <Text>
            Stefan Oebels Sánchez
          </Text>
          .{'\n'}
          Certificación de Software - Extraordinario.{'\n'}
          Si da click en el apartado de <Text style={{ fontStyle: 'italic' }}>"Pagina Principal"</Text> podrá acceder a las pestañas.
        </Text>
      </View>
    </View>
  );
}
