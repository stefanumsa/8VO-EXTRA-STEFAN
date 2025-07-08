import React, { useState, useMemo } from 'react';
import {
  View,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Pressable,
  Text as RNText,
} from 'react-native';
import Text from '@/features/regexTester/presentation/components/atoms/Text/Text';
import { useASTStore } from '@/core/store/astStore';
import { useAppTheme } from '@/core/hooks/useAppTheme';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// Paleta de colores saturados con buen contraste para fondo claro/oscuro
const COLOR_PALETTE = [
  '#E63946',
  '#F4A261',
  '#2A9D8F',
  '#264653',
  '#E76F51',
  '#1D3557',
  '#F72585',
  '#3A86FF',
];

// Asigna colores a tipos de token, en orden
function assignColorsToTypes(types: string[]) {
  const map = new Map<string, string>();
  types.forEach((type, idx) => {
    map.set(type, COLOR_PALETTE[idx % COLOR_PALETTE.length]);
  });
  return map;
}

// Extrae todos los tipos únicos desde el AST
function extractTypesFromAST(node: any, typeSet = new Set<string>()): Set<string> {
  if (!node) return typeSet;
  if (typeof node !== 'object') return typeSet;

  if (node.type && typeof node.type === 'string') {
    typeSet.add(node.type);
  }

  // Propiedades típicas que contienen hijos en AST regexpp
  const childProps = ['elements', 'alternatives', 'expressions', 'body'];

  for (const prop of childProps) {
    if (Array.isArray(node[prop])) {
      node[prop].forEach((child: any) => extractTypesFromAST(child, typeSet));
    } else if (node[prop]) {
      extractTypesFromAST(node[prop], typeSet);
    }
  }
  return typeSet;
}

function TokenTypeLegend({
  types,
  typeColors,
}: {
  types: string[];
  typeColors: Map<string, string>;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tokenLegendContainer}
      contentContainerStyle={{ paddingHorizontal: 12 }}
    >
      {types.map((type) => (
        <View
          key={type}
          style={[styles.tokenBadge, { backgroundColor: typeColors.get(type) || '#333' }]}
        >
          <Text
            style={styles.tokenBadgeText}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {type}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

function InteractiveNode({
  node,
  typeColors,
  depth = 0,
}: {
  node: any;
  typeColors: Map<string, string>;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(true);

  const children =
    node.elements || node.alternatives || node.expressions || node.body || [];

  const typeText = typeof node.type === 'string' ? node.type : '';

  // Color del tipo de token
  const underlineColor = typeColors.get(typeText) || 'transparent';

  // Animación flecha expandir/colapsar
  const rotateAnim = useState(new Animated.Value(expanded ? 0 : 1))[0];

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [expanded, rotateAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-90deg'],
  });

  return (
    <View style={{ marginLeft: depth * 14, marginVertical: 6 }}>
      <Pressable onPress={() => setExpanded((e) => !e)}>
        <Animated.Text
          style={[
            styles.nodeText,
            {
              textDecorationLine: underlineColor !== 'transparent' ? 'underline' : 'none',
              textDecorationColor: underlineColor,
              color: underlineColor !== 'transparent' ? underlineColor : undefined,
              fontWeight: '700',
              fontSize: 15,
              marginBottom: 4,
            },
            { transform: [{ rotate: rotateInterpolate }] },
          ]}
        >
          {expanded ? '▼' : '▶'} {typeText} {node.raw ? `(${node.raw})` : ''}
        </Animated.Text>
      </Pressable>

      {expanded &&
        children.map((child: any, idx: number) => (
          <InteractiveNode
            key={idx}
            node={child}
            typeColors={typeColors}
            depth={depth + 1}
          />
        ))}
    </View>
  );
}

export default function ASTScreen() {
  const colors = useAppTheme();
  const router = useRouter();
  const { astHistory, clearASTHistory, removeAST } = useASTStore();
  const [selectedAST, setSelectedAST] = useState<{ regex: string; ast: any } | null>(null);

  // Nuevo estado para mostrar modal de info de tokens
  const [showTokenInfo, setShowTokenInfo] = useState(false);

  // Extraer tipos del AST actual y asignar colores
  const typeSet = useMemo(() => {
    if (!selectedAST?.ast) return new Set<string>();
    return extractTypesFromAST(selectedAST.ast);
  }, [selectedAST]);

  const types = Array.from(typeSet).sort((a, b) => a.localeCompare(b));
  const typeColors = useMemo(() => assignColorsToTypes(types), [types]);

  const exportASTToFile = async (ast: any, name: string) => {
    if (!ast) {
      Alert.alert('Advertencia', 'Este AST está vacío.');
      return;
    }

    const safeStringify = (obj: any, space = 2) => {
      const seen = new WeakSet();
      return JSON.stringify(
        obj,
        function (key, value) {
          if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) return '[Circular]';
            seen.add(value);
          }
          return value;
        },
        space
      );
    };

    const safeName = name.replace(/[^\w\s]/gi, '_').slice(0, 20);
    const fileUri = `${FileSystem.documentDirectory}${safeName}.json`;

    try {
      const json = safeStringify(ast);
      await FileSystem.writeAsStringAsync(fileUri, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('No disponible', 'Compartir no es compatible en este dispositivo.');
        return;
      }

      await Sharing.shareAsync(fileUri);
    } catch (err) {
      console.error('Error exportando AST:', err);
      Alert.alert('Error', 'No se pudo exportar este AST.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <Text style={[styles.title, { color: colors.text }]}>🌲Historial de AST🌲</Text>

        {/* Aquí agregamos el botón de info de tokens */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12, justifyContent: 'flex-end' }}>
          <TouchableOpacity
            onPress={() => setShowTokenInfo(true)}
            style={[styles.infoButton, { backgroundColor: colors.primary }]}
          >
            <RNText style={[styles.infoButtonText, { color: colors.text }]}>❓</RNText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/tester')}
          style={[styles.backButton, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>Ir al Tester</Text>
        </TouchableOpacity>

        {astHistory.length > 0 && (
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Confirmar', '¿Borrar todos los AST?', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Sí', onPress: clearASTHistory },
              ])
            }
            style={[styles.clearAllButton, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.backButtonText, { color: colors.text }]}>
              Borrar todos los AST
            </Text>
          </TouchableOpacity>
        )}

        

        {astHistory.length === 0 ? (
          <Text style={[styles.noHistoryText, { color: colors.text }]}>
            No hay AST generados aún.
          </Text>
        ) : (
          astHistory.map(({ regex, ast }, i) => (
            <View key={i} style={[styles.itemButton, { borderColor: colors.primary }]}>
              <TouchableOpacity onPress={() => setSelectedAST({ regex, ast })}>
                <Text style={[styles.itemText, { color: colors.text }]} numberOfLines={1} ellipsizeMode="middle">
                  {regex}
                </Text>
              </TouchableOpacity>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert('Eliminar AST', `¿Eliminar AST: "${regex}"?`, [
                      { text: 'Cancelar', style: 'cancel' },
                      { text: 'Eliminar', onPress: () => removeAST(regex) },
                    ])
                  }
                  style={styles.deleteButton}
                >
                  <Text style={{ color: 'red', fontWeight: '700' }}>Eliminar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => exportASTToFile(ast, regex)}
                  style={[styles.exportButton, { backgroundColor: colors.primary }]}
                >
                  <Text style={[styles.exportText, { color: colors.text }]}>Exportar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal con AST y leyenda de tipos */}
      <Modal
        visible={selectedAST !== null}
        animationType="slide"
        onRequestClose={() => setSelectedAST(null)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Tipos de Nodo</Text>
          {types.length === 0 ? (
            <Text style={[styles.noTokensText, { color: colors.text }]}>No se encontraron tipos.</Text>
          ) : (
            <TokenTypeLegend types={types} typeColors={typeColors} />
          )}

          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: colors.text, marginTop: 16 }]}>
              Árbol de Sintaxis Abstracta (AST)
            </Text>
            {selectedAST && (
              <InteractiveNode
                node={selectedAST.ast}
                typeColors={typeColors}
              />
            )}
          </ScrollView>

          <TouchableOpacity
            onPress={() => setSelectedAST(null)}
            style={[styles.modalCloseButton, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.modalCloseButtonText, { color: colors.text }]}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
  visible={showTokenInfo}
  animationType="slide"
  transparent={false}
  onRequestClose={() => setShowTokenInfo(false)}
>
  <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
    <ScrollView contentContainerStyle={styles.modalContent}>
      <Text style={[styles.modalTitle, { color: colors.text }]}>
        Explicación de Tokens en Expresiones Regulares
      </Text>

      <Text style={[styles.modalText, { color: colors.text }]}>
        <Text style={{ fontWeight: 'bold', color: colors.text }}>
          Definición Formal:
        </Text>
        {'\n'}
        Un token es la unidad mínima que representa un significado léxico en la expresión regular,
        como un carácter simple, un metacarácter, un cuantificador, etc.
        {'\n\n'}

        <Text style={{ fontWeight: 'bold', color: colors.text }}>
          Ejemplos Detallados:
        </Text>
        {'\n'}
        - Caracteres literales (literal characters): a, b, 1{'\n'}
        - Metacaracteres (metacharacters): ., *, +, ?{'\n'}
        - Clases de caracteres (character classes): [a-z], {'\\d'}, {'\\w'}{'\n'}
        - Cuantificadores (quantifiers):{'\n'}
          - {'`*`'}: 0 o más veces {'\n'}
          - {'`+`'}: 1 o más veces {'\n'}
          - {'`?`'}: 0 o 1 vez {'\n'}
          - {'`\\{n\\}`'}: exactamente n veces {'\n'}
          - {'`\\{n,\\}`'}: al menos n veces {'\n'}
          - {'`\\{n,m\\}`'}: entre n y m veces {'\n'}
        - Grupos (groups): (abc), (?:xyz){'\n'}
        - Anclas (anchors): ^, ${'\n\n'}

        <Text style={{ fontWeight: 'bold', color: colors.text }}>
          Cómo se Usan:
        </Text>
        {'\n'}
        Estos tokens se combinan para formar patrones complejos que permiten buscar, validar y manipular texto
        de manera poderosa y flexible. 
        {'\n\n'}

        <Text style={{ fontWeight: 'bold', color: colors.text }}>
          Importancia :
        </Text>
        {'\n'}
        Conocer los tokens es fundamental para construir y entender expresiones regulares correctamente,
        además de interpretar el Árbol de Sintaxis Abstracta (AST) que representa la estructura de la expresión.
        (Understanding tokens is fundamental for correctly building and interpreting regular expressions,
        as well as interpreting the Abstract Syntax Tree that represents their structure.)
      </Text>
    </ScrollView>

    <TouchableOpacity
      onPress={() => setShowTokenInfo(false)}
      style={[styles.modalCloseButton, { backgroundColor: colors.primary }]}
    >
      <Text style={[styles.modalCloseButtonText, { color: colors.text }]}>Cerrar</Text>
    </TouchableOpacity>
  </View>
</Modal>


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  noHistoryText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  noTokensText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 12,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 22,
  },
  itemButton: {
    padding: 12,
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    fontFamily: 'monospace',
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    elevation: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  clearAllButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    elevation: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff5f5',
  },
  exportButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportText: {
    fontWeight: '700',
    fontSize: 14,
  },
  modalContainer: { flex: 1, padding: 20 },
  scrollContent: {
    paddingBottom: 40,
  },
  modalContent: { paddingBottom: 40 },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  nodeText: { fontWeight: '700' },
  modalCloseButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  modalCloseButtonText: { fontSize: 16, fontWeight: '700' },
  tokenLegendContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tokenBadge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    maxWidth: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenBadgeText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  infoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  infoButtonText: {
    fontSize: 20,
    fontWeight: '700',
  },
});
