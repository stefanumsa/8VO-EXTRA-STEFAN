import React, { useState } from 'react';
import { View, TextInput, ScrollView, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { G } from 'react-native-svg';
import { parse } from 'regexp-tree';
import DiagramNode from '@/features/regexTester/presentation/components/Diagram/DiagramNode';
import { NodeData } from '@/features/regexTester/presentation/components/Diagram/types';
import Text from '@/features/regexTester/presentation/components/atoms/Text/Text';
import Button from '@/features/regexTester/presentation/components/atoms/Button/Button';
import { useAppTheme } from '@/core/hooks/useAppTheme';
import { useRouter } from 'expo-router';

const SCREEN_WIDTH = Dimensions.get('window').width;

function transformAST(node: any): NodeData {
  if (!node) return { type: 'null' };

  switch (node.type) {
    case 'Char':
      return { type: 'Char', value: node.value };
    case 'CharacterClass':
      return {
        type: 'CharacterClass',
        value: `[${node.expressions.map((e: any) => e.raw).join('')}]`
      };
    case 'Alternative':
    case 'Disjunction':
    case 'Group':
    case 'CapturingGroup':
    case 'Repetition':
    case 'Assertion':
    case 'Expression':
    case 'RegExp':
    case 'Quantifier':
      const children =
        node.body?.map?.(transformAST) ||
        node.expressions?.map?.(transformAST) ||
        node.alternatives?.map?.(transformAST) ||
        node.elements?.map?.(transformAST) ||
        (node.expression ? [transformAST(node.expression)] : []);
      return {
        type: node.type,
        value: node.quantifier?.kind || node.raw || undefined,
        children: children?.filter(Boolean),
      };
    case 'Range':
      return { type: 'Range', value: `${node.from.value}-${node.to.value}` };
    case 'Anchor':
      return { type: 'Anchor', value: node.kind };
    default:
      console.warn(`Tipo de nodo no manejado: ${node.type}`);
      return { type: node.type };
  }
}

export default function Diagrama() {
  const colors = useAppTheme();
  const router = useRouter();
  const [regex, setRegex] = useState('');
  const [tree, setTree] = useState<NodeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const hasAnyInput = regex.trim() !== '';

  const generarDiagrama = () => {
    try {
      const safeRegex = regex.startsWith('/') ? regex : `/${regex}/`;
      const ast = parse(safeRegex).body;
      const treeData = transformAST(ast);
      setTree(treeData);
      setError(null);
    } catch (e: any) {
      console.error('Error al analizar la expresión:', e);
      setTree(null);
      setError('Esta expresión usa elementos no compatibles con el diagrama.');
    }
  };

  const limpiarCampo = () => {
    setRegex('');
    setTree(null);
    setError(null);
    setZoom(1);
  };

  const styles = createStyles(colors);

  const svgColors = {
    nodeFill: colors.nodeFill || '#8398ba',
    nodeText: colors.text,
    lineStroke: colors.lineStroke || '#2c3e50',
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📈Diagrama Visual de Expresión Regular</Text>

      <TouchableOpacity
        onPress={() => router.push('/tester')}
        style={[styles.backButton, { backgroundColor: colors.primary }]}
      >
        <Text style={[styles.backButtonText, { color: colors.text }]}>Ir al Tester</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Ingresa una expresión regular"
        placeholderTextColor={colors.text}
        value={regex}
        onChangeText={setRegex}
        style={styles.input}
      />

      <View style={styles.buttonsRow}>
        {hasAnyInput && (
          <View style={styles.buttonWrapper}>
            <Button title="Generar Diagrama" onPress={generarDiagrama} />
          </View>
        )}
        {hasAnyInput && (
          <View style={styles.buttonWrapper}>
            <Button title="Limpiar Campo" onPress={limpiarCampo} />
          </View>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {tree && !error && (
        <>
          <View style={styles.zoomControls}>
            <TouchableOpacity
              style={[styles.zoomButton, { backgroundColor: colors.primary }]}
              onPress={() => setZoom(prev => Math.min(prev + 0.2, 3))}
            >
              <Text style={{ color: colors.text, fontSize: 18 }}>＋</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.zoomButton, { backgroundColor: colors.primary }]}
              onPress={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
            >
              <Text style={{ color: colors.text, fontSize: 18 }}>－</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.diagramWrapper}>
            <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Svg
                  height={600}
                  width={SCREEN_WIDTH * 2}
                  style={{ backgroundColor: colors.background }}
                >
                  <G scale={zoom} originX={SCREEN_WIDTH} originY={0}>
                    <DiagramNode
                      node={tree}
                      x={SCREEN_WIDTH}
                      y={40}
                      level={0}
                      index="0"
                      parentX={null}
                      colors={svgColors}
                    />
                  </G>
                </Svg>
              </ScrollView>
            </ScrollView>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: colors.background,
      flexGrow: 1,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 12,
      color: colors.text,
    },
    input: {
      borderWidth: 2,
      padding: 10,
      borderRadius: 10,
      marginBottom: 12,
      borderColor: colors.text,
      color: colors.text,
    },
    buttonsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    buttonWrapper: {
      flex: 1,
      marginHorizontal: 4,
    },
    error: {
      color: colors.error,
      marginTop: 10,
      textAlign: 'center',
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
    backButtonText: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    zoomControls: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
      marginTop: 20,
      marginBottom: 10,
    },
    zoomButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
      elevation: 3,
    },
    diagramWrapper: {
      height: 600,
      borderWidth: 2,
      borderColor: 'gray',
      borderRadius: 10,
      overflow: 'hidden',
    },
  });
