import React, { useState } from 'react';
import { View, TextInput, ScrollView, Dimensions, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { parse } from 'regexp-tree'; // Librería para generar el AST de una expresión regular
import Text from '@/features/regexTester/presentation/components/atoms/Text/Text';
import Button from '@/features/regexTester/presentation/components/atoms/Button/Button';
import { useAppTheme } from '@/core/hooks/useAppTheme';

// Obtiene el ancho de pantalla para usarlo en el renderizado SVG
const SCREEN_WIDTH = Dimensions.get('window').width;

// Tipado personalizado para los nodos del AST
interface NodeData {
  type: string;
  value?: string;
  children?: NodeData[];
}

// Transforma el AST original de regexp-tree a un formato simplificado que usamos para dibujar
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

    // Tipos de nodos complejos que pueden contener hijos
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

    // Muestra advertencia si se encuentra un tipo no controlado
    default:
      console.warn(`Tipo de nodo no manejado: ${node.type}`);
      return { type: node.type };
  }
}

// Dibuja de forma recursiva los nodos del AST como círculos conectados con líneas
function renderNode(
  node: NodeData,
  x: number,
  y: number,
  level: number,
  index: number | string,
  parentX: number | null,
  lines: any[],
  nodes: any[],
  colors: { nodeFill: string; nodeText: string; lineStroke: string }
): void {
  const nodeX = x;
  const nodeY = y + level * 100;

  // Dibuja el nodo actual
  nodes.push(
    <React.Fragment key={`node-${index}`}>
      <Circle cx={nodeX} cy={nodeY} r={25} fill={colors.nodeFill} />
      <SvgText
        x={nodeX}
        y={nodeY + 5}
        fontSize="12"
        fill={colors.nodeText}
        textAnchor="middle"
      >
        {node.value || node.type}
      </SvgText>
    </React.Fragment>
  );

  // Dibuja línea desde el padre, si existe
  if (parentX !== null) {
    lines.push(
      <Line
        key={`line-${index}`}
        x1={parentX}
        y1={nodeY - 100}
        x2={nodeX}
        y2={nodeY - 25}
        stroke={colors.lineStroke}
      />
    );
  }

  // Llama recursivamente a los hijos del nodo actual
  if (node.children) {
    const spacing = 120;
    const totalWidth = (node.children.length - 1) * spacing;
    node.children.forEach((child, i) => {
      const childX = x - totalWidth / 2 + i * spacing;
      renderNode(child, childX, y + 100, level + 1, `${index}-${i}`, nodeX, lines, nodes, colors);
    });
  }
}

// Componente principal de la pantalla que muestra el input y diagrama SVG
export default function Diagrama() {
  const colors = useAppTheme(); // Obtiene colores según el tema

  const [regex, setRegex] = useState(''); // Valor del input de expresión regular
  const [tree, setTree] = useState<NodeData | null>(null); // AST generado
  const [error, setError] = useState<string | null>(null); // Mensaje de error si ocurre

  const hasAnyInput = regex.trim() !== ''; // Verifica si hay algo escrito

  // Genera el AST desde la expresión escrita y lo transforma para visualización
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

  // Limpia todo el estado (input, AST, errores)
  const limpiarCampo = () => {
    setRegex('');
    setTree(null);
    setError(null);
  };

  const styles = createStyles(colors);

  // Colores para nodos y líneas SVG
  const svgColors = {
    nodeFill: colors.nodeFill || '#6a7f9d',
    nodeText: colors.text,
    lineStroke: colors.lineStroke || '#2c3e50',
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Diagrama Visual de Expresión Regular
      </Text>

      <TextInput
        placeholder="Ingresa una expresión regular"
        placeholderTextColor={colors.text}
        value={regex}
        onChangeText={setRegex}
        style={styles.input}
      />

      {/* Botones para generar o limpiar */}
      <View style={styles.buttonsRow}>
        {hasAnyInput && (
          <View style={styles.buttonWrapper}>
            <Button title="Generar Diagrama." onPress={generarDiagrama} />
          </View>
        )}
        {hasAnyInput && (
          <View style={styles.buttonWrapper}>
            <Button title="Limpiar Campo." onPress={limpiarCampo} />
          </View>
        )}
      </View>

      {/* Mensaje de error si ocurre */}
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      {/* Renderiza el SVG solo si hay árbol y no hay error */}
      {tree && !error && (
        <ScrollView horizontal style={{ marginTop: 20 }}>
          <Svg height={600} width={SCREEN_WIDTH * 2}>
            {(() => {
              const lines: any[] = [];
              const nodes: any[] = [];
              renderNode(tree, SCREEN_WIDTH, 40, 0, 0, null, lines, nodes, svgColors);
              return [...lines, ...nodes];
            })()}
          </Svg>
        </ScrollView>
      )}
    </ScrollView>
  );
}

// Estilos con colores dinámicos según tema
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
  });
