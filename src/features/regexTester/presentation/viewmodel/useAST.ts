import { useState } from "react";
import { generateAST } from "../../domain/usecases/generateAST";
import type { Pattern } from "regexpp/ast";

export function useAST(pattern: string) {
  const [ast, setAST] = useState<Pattern | null>(null);

  const parse = () => {
    const result = generateAST(pattern);
    setAST(result);
  };

  return { ast, parse };
}
