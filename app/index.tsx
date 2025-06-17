import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>
        Esta Aplicación fue Creada por Stefan Oebels Sánchez.{"\n"}
        Certificación de Software - Extraordinario.{"\n"}
        Si da click en el apartado de "Pagina Principal" podrá acceder a las pestañas.
      </Text>
    </View>
  );
}
