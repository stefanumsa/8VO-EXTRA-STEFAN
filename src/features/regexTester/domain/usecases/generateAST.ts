import { RegExpParser } from "regexpp";
import type { Pattern } from "regexpp/ast";

export function generateAST(pattern: string): Pattern | null {
  try {
    const parser = new RegExpParser();
    const ast = parser.parsePattern(pattern, 0, pattern.length, false);
    return ast;
  } catch (error) {
    console.error("Error al generar AST:", error);
    return null;
  }
}
