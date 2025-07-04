import { useRegexTesterViewModel } from "../viewmodel/useRegexTesterViewModel"; // Importa el hook personalizado para manejar el estado del tester de regex
import { Input } from "../components/atoms/Input/Input"; // Importa el componente Input para capturar la expresión regular
import { ASTVisualizer } from "../components/ASTVisualizer"; // Importa el componente para visualizar el AST generado


/**
 * Componente principal de la página Tester.
 * Renderiza un input para la expresión y el visualizador del AST.
 */
export default function TesterPage() {
  const { expression, onExpressionChange, ast } = useRegexTesterViewModel();

  return (
    <Template>
      <Input value={expression} onChangeText={onExpressionChange} />
      <ASTVisualizer ast={ast} />
    </Template>
  );
}
