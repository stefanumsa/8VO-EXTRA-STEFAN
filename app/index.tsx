import { router } from "expo-router";
import { View, Text, Button } from "react-native";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20 }}>Pantalla Principal</Text>

      <View style={{ marginBottom: 10, width: 200 }}>
        <Button title="Ir al Tester" onPress={() => router.push("/tester")} />
      </View>

      <View style={{ width: 200 }}>
        <Button title="Ver Historial" onPress={() => router.push("/history")} />
      </View>
    </View>
  );
}
