import { useState } from "react"; // Importa useState para manejar estado local en React
import { generateAST } from "../../domain/usecases/generateAST"; // Importa la función que genera el AST desde una expresión regular


/**
 * Hook personalizado que maneja el estado para un tester de expresiones regulares.
 * Controla la expresión actual y su AST generado.
 */
export const useRegexTesterViewModel = () => {
  const [expression, setExpression] = useState("");
  const [ast, setAst] = useState(null);

  const onExpressionChange = (newExp: string) => {
    setExpression(newExp);
    const tree = generateAST(newExp);
    setAst(tree);
  };

  return { expression, onExpressionChange, ast };
};
