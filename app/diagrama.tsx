import React, { useState } from 'react';
import { View, TextInput, ScrollView, Dimensions } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { parse } from 'regexp-tree';
import Text from '@/features/regexTester/presentation/components/atoms/Text/Text';
import Button from '@/features/regexTester/presentation/components/atoms/Button/Button';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface NodeData {
  type: string;
  value?: string;
  children?: NodeData[];
}

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

function renderNode(
  node: NodeData,
  x: number,
  y: number,
  level: number,
  index: number | string,
  parentX: number | null,
  lines: any[],
  nodes: any[]
): void {
  const nodeX = x;
  const nodeY = y + level * 100;

  nodes.push(
    <React.Fragment key={`node-${index}`}>
      <Circle cx={nodeX} cy={nodeY} r={25} fill="#aee1f9" />
      <SvgText x={nodeX} y={nodeY + 5} fontSize="12" fill="black" textAnchor="middle">
        {node.value || node.type}
      </SvgText>
    </React.Fragment>
  );

  if (parentX !== null) {
    lines.push(
      <Line
        key={`line-${index}`}
        x1={parentX}
        y1={nodeY - 100}
        x2={nodeX}
        y2={nodeY - 25}
        stroke="black"
      />
    );
  }

  if (node.children) {
    const spacing = 120;
    const totalWidth = (node.children.length - 1) * spacing;
    node.children.forEach((child, i) => {
      const childX = x - totalWidth / 2 + i * spacing;
      renderNode(child, childX, y + 100, level + 1, `${index}-${i}`, nodeX, lines, nodes);
    });
  }
}

export default function Diagrama() {
  const [regex, setRegex] = useState('');
  const [tree, setTree] = useState<NodeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generarDiagrama = () => {
    try {
      // ✅ Envolver la expresión si no tiene delimitadores
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

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 }}>
        Diagrama Visual de Expresión Regular
      </Text>

      <TextInput
        placeholder="Ingresa una expresión regular"
        value={regex}
        onChangeText={setRegex}
        style={{ borderWidth: 1, padding: 10, borderRadius: 10, marginBottom: 12 }}
      />

      <Button title="Generar Diagrama" onPress={generarDiagrama} />

      {error && (
        <Text style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>{error}</Text>
      )}

      {tree && !error && (
        <ScrollView horizontal style={{ marginTop: 20 }}>
          <Svg height={600} width={SCREEN_WIDTH * 2}>
            {(() => {
              const lines: any[] = [];
              const nodes: any[] = [];
              renderNode(tree, SCREEN_WIDTH, 40, 0, 0, null, lines, nodes);
              return [...lines, ...nodes];
            })()}
          </Svg>
        </ScrollView>
      )}
    </ScrollView>
  );
}
