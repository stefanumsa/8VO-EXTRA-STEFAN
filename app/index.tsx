import { router } from "expo-router";
import { View, Text, Button } from "react-native";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Pantalla Principal</Text>
      <Button title="Ir al Tester" onPress={() => router.push("/tester")} />
      <Button title="Ver Historial" onPress={() => router.push("/history")} />
    </View>
  );
}
