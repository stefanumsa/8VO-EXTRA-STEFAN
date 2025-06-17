// src/features/regexTester/presentation/components/ASTVisualizer.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { Node } from "regexpp/ast";

interface ASTNodeProps {
  node: Node;
  depth?: number;
}

const ASTNode: React.FC<ASTNodeProps> = ({ node, depth = 0 }) => {
  const children = (node as any).elements || (node as any).alternatives || [];

  return (
    <View style={[styles.node, { marginLeft: depth * 16 }]}>
      <Text style={styles.nodeLabel}>
        {node.type} {("raw" in node ? `(${node.raw})` : "")}
      </Text>
      {children.length > 0 &&
        children.map((child: Node, index: number) => (
          <ASTNode key={index} node={child} depth={depth + 1} />
        ))}
    </View>
  );
};

export const ASTVisualizer: React.FC<{ root: Node | null }> = ({ root }) => {
  if (!root) {
    return <Text style={styles.error}>No se pudo generar el AST.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Árbol de Sintaxis Abstracta (AST)</Text>
      <ASTNode node={root} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  title: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
  node: { paddingVertical: 2 },
  nodeLabel: { fontSize: 14, color: "#333" },
  error: { color: "red", fontStyle: "italic" },
});
