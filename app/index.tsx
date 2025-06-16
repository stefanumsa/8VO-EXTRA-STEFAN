import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20 }}>Esta Aplicacion fue Creada por Stefan Oebels Sanchez.</Text>
      <Text style={{ marginBottom: 20 }}>Certificacion de Software - Extraordinario.</Text>
      <Text style={{ marginBottom: 20 }}>Si da click en el apartado de "menú" podra acceder a las pestañas.</Text>
    </View>
  );
}
