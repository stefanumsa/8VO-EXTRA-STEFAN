import { useRegexTesterViewModel } from "../viewmodel/useRegexTesterViewModel";
import { Input } from "../components/atoms/Input/Input";
import { ASTVisualizer } from "../components/ASTVisualizer";

export default function TesterPage() {
  const { expression, onExpressionChange, ast } = useRegexTesterViewModel();

  return (
    <Template>
      <Input value={expression} onChangeText={onExpressionChange} />
      <ASTVisualizer ast={ast} />
    </Template>
  );
}
