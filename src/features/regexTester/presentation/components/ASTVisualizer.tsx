import React from "react";
import { View, Text, StyleSheet } from "react-native";
// Importa el tipo Node para tipar los nodos del AST
import type { Node } from "regexpp/ast";

// Props para el componente recursivo que representa cada nodo del AST
interface ASTNodeProps {
  node: Node;       // Nodo actual a mostrar
  depth?: number;   // Profundidad para controlar sangría visual
}

// Componente recursivo que muestra un nodo del AST y sus hijos
const ASTNode: React.FC<ASTNodeProps> = ({ node, depth = 0 }) => {
  // Obtiene los hijos del nodo, puede estar en 'elements' o 'alternatives'
  const children = (node as any).elements || (node as any).alternatives || [];

  return (
    <View style={[styles.node, { marginLeft: depth * 16 }]}>
      {/* Muestra el tipo del nodo y su valor 'raw' si existe */}
      <Text style={styles.nodeLabel}>
        {node.type} {("raw" in node ? `(${node.raw})` : "")}
      </Text>

      {/* Renderiza recursivamente los hijos incrementando la profundidad */}
      {children.length > 0 &&
        children.map((child: Node, index: number) => (
          <ASTNode key={index} node={child} depth={depth + 1} />
        ))}
    </View>
  );
};

// Componente principal que recibe la raíz del AST y la visualiza
export const ASTVisualizer: React.FC<{ root: Node | null }> = ({ root }) => {
  // Si no hay árbol (root es null), muestra mensaje de error
  if (!root) {
    return <Text style={styles.error}>No se pudo generar el AST.</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Título del visualizador */}
      <Text style={styles.title}>Árbol de Sintaxis Abstracta (AST)</Text>
      {/* Renderiza el nodo raíz, que a su vez renderiza todo el árbol */}
      <ASTNode node={root} />
    </View>
  );
};

// Estilos para el visualizador y nodos del árbol
const styles = StyleSheet.create({
  container: { padding: 10 },
  title: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
  node: { paddingVertical: 2 },
  nodeLabel: { fontSize: 14, color: "#333" },
  error: { color: "red", fontStyle: "italic" },
});
