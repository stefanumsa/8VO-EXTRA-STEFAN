import React, { useState } from 'react';
import {View,Modal,ScrollView,TouchableOpacity,StyleSheet,Alert,} from 'react-native';
import Text from '@/features/regexTester/presentation/components/atoms/Text/Text';
import { useASTStore } from '@/core/store/astStore';
import { useAppTheme } from '@/core/hooks/useAppTheme';
import { useRouter } from 'expo-router';

export default function ASTScreen() {
  const colors = useAppTheme();
  const router = useRouter();
  const { astHistory, clearASTHistory, removeAST } = useASTStore();
  const [selectedAST, setSelectedAST] = useState<{ regex: string; ast: any } | null>(null);

  const InteractiveNode = ({ node, depth = 0 }: { node: any; depth?: number }) => {
    const [expanded, setExpanded] = useState(true);
    const children =
      node.elements || node.alternatives || node.expressions || node.body || [];

    return (
      <View style={{ marginLeft: depth * 12, marginVertical: 4 }}>
        <Text
          onPress={() => setExpanded(!expanded)}
          style={[styles.nodeText, { color: colors.text }]}
        >
          {expanded ? '▼' : '▶'} {node.type} {node.raw ? `(${node.raw})` : ''}
        </Text>
        {expanded &&
          children.map((child: any, index: number) => (
            <InteractiveNode key={index} node={child} depth={depth + 1} />
          ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <Text style={[styles.title, { color: colors.text }]}>🌲Historial de AST🌲</Text>

        <TouchableOpacity
          onPress={() => router.push('/tester')}
          style={[styles.backButton, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>Ir al Tester</Text>
        </TouchableOpacity>

        {/* Aquí el botón solo aparece si hay ASTs */}
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
            <Text style={[styles.backButtonText, { color: colors.text }]}>Borrar todos los AST</Text>
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
                <Text style={[styles.itemText, { color: colors.text }]}>
                  {regex.length > 30 ? regex.slice(0, 30) + '...' : regex}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert('Eliminar AST', `¿Eliminar AST: "${regex}"?`, [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Eliminar', onPress: () => removeAST(regex) },
                  ])
                }
                style={styles.deleteButton}
              >
                <Text style={{ color: 'red', fontWeight: 'bold' }}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal para AST completo */}
      <Modal
        visible={selectedAST !== null}
        animationType="slide"
        onRequestClose={() => setSelectedAST(null)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>AST Completo</Text>
            {selectedAST && <InteractiveNode node={selectedAST.ast} />}
          </ScrollView>
          <TouchableOpacity
            onPress={() => setSelectedAST(null)}
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
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  noHistoryText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  itemButton: {
    padding: 12,
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemText: { fontSize: 16, fontFamily: 'monospace' },
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
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  modalContainer: { flex: 1, padding: 20 },
  modalContent: { paddingBottom: 40 },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  nodeText: { fontWeight: 'bold' },
  modalCloseButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  modalCloseButtonText: { fontSize: 16, fontWeight: 'bold' },
});
