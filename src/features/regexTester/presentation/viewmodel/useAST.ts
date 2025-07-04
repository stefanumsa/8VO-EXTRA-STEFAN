import { useState } from "react"; // Importa el hook useState de React para manejar estado local
import { generateAST } from "../../domain/usecases/generateAST"; // Importa la función para generar el AST de una expresión regular
import type { Pattern } from "regexpp/ast"; // Importa el tipo 'Pattern' que representa el AST generado


/**
 * Hook personalizado para manejar el estado del AST de una expresión regular.
 * Recibe un patrón (string) y ofrece el AST y una función para generarlo.
 */ 
export function useAST(pattern: string) {
  const [ast, setAST] = useState<Pattern | null>(null);

  const parse = () => {
    const result = generateAST(pattern);
    setAST(result);
  };

  return { ast, parse };
}
