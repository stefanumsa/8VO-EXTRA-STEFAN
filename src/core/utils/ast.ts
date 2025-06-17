import { RegExpParser } from 'regexpp';
import type { Pattern } from 'regexpp/ast';

export function generateAST(pattern: string): Pattern | null {
  try {
    const parser = new RegExpParser();
    return parser.parsePattern(pattern);
  } catch (error) {
    console.error('Error al generar AST:', error);
    return null;
  }
}
