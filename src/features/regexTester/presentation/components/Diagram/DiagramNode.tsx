import React, { useState } from 'react';
import { Circle, Line, Text as SvgText } from 'react-native-svg';
import { NodeData } from './types';

interface Props {
  node: NodeData;
  x: number;
  y: number;
  level: number;
  index: string;
  parentX: number | null;
  colors: {
    nodeFill: string;
    nodeText: string;
    lineStroke: string;
  };
}

const DiagramNode: React.FC<Props> = ({ node, x, y, level, index, parentX, colors }) => {
  const [expanded, setExpanded] = useState(true);
  const nodeX = x;
  const nodeY = y + level * 100;

  const handlePress = () => {
    setExpanded(!expanded);
  };

  const spacing = 120;
  const totalWidth = (node.children?.length || 1 - 1) * spacing;

  const children = expanded && node.children ? node.children.map((child, i) => {
    const childX = x - totalWidth / 2 + i * spacing;
    return (
      
      <DiagramNode
        key={`${index}-${i}`}
        node={child}
        x={childX}
        y={y + 100}
        level={level + 1}
        index={`${index}-${i}`}
        parentX={nodeX}
        colors={colors}
      />
    );
  }) : null;

  return (
    <>
      {parentX !== null && (
        <Line
          x1={parentX}
          y1={nodeY - 100}
          x2={nodeX}
          y2={nodeY - 25}
          stroke={colors.lineStroke}
        />
      )}
      <Circle cx={nodeX} cy={nodeY} r={25} fill={colors.nodeFill} onPress={handlePress} />
      <SvgText
        x={nodeX}
        y={nodeY + 5}
        fontSize="12"
        fill={colors.nodeText}
        textAnchor="middle"
        onPress={handlePress}
      >
        {node.value || node.type}
      </SvgText>
      {children}
    </>
  );
};

export default DiagramNode;
