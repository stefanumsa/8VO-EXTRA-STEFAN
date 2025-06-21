import { useState } from "react";
import { generateAST } from "../../domain/usecases/generateAST";

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
