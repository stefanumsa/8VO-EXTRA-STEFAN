import { RegExpParser } from 'regexpp'; // Importa el parser de expresiones regulares desde regexpp
import type { Pattern } from 'regexpp/ast'; // Importa el tipo 'Pattern' que representa la raíz del AST

// Función que genera el AST (Árbol de Sintaxis Abstracta) de una expresión regular
export function generateAST(pattern: string): Pattern | null {
  try {
    const parser = new RegExpParser();     // Crea una nueva instancia del parser
    return parser.parsePattern(pattern);   // Intenta parsear el patrón como un objeto tipo 'Pattern' (AST)
  } catch (error) {
    console.error('Error al generar AST:', error);     // Si hay un error al parsear (expresión inválida), lo muestra en consola
    return null; // Devuelve null si falla
  }
}
