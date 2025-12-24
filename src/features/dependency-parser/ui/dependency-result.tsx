import type { ParsedPackage, Dependency } from "@/entities/dependency/model/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

interface DependencyResultProps {
  /** 파싱 결과 */
  result: ParsedPackage;
}

function DependencyItem({ dependency }: { dependency: Dependency }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors">
      <span className="font-medium">{dependency.name}</span>
      <span className="text-sm text-muted-foreground font-mono">{dependency.version}</span>
    </div>
  );
}

/**
 * 의존성 파싱 결과를 표시하는 컴포넌트
 */
export function DependencyResult({ result }: DependencyResultProps) {
  const prodDeps = result.dependencies.filter((d) => !d.isDev);
  const devDeps = result.dependencies.filter((d) => d.isDev);

  return (
    <div className="space-y-6">
      {/* 프로젝트 정보 */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold">{result.name}</h2>
        <p className="text-sm text-muted-foreground">v{result.version}</p>
        <p className="text-sm text-muted-foreground">
          총 {result.dependencies.length}개의 의존성
        </p>
      </div>

      {/* Dependencies */}
      {prodDeps.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="size-2 rounded-full bg-green-500" />
              Dependencies ({prodDeps.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {prodDeps.map((dep) => (
              <DependencyItem key={dep.name} dependency={dep} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* DevDependencies */}
      {devDeps.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="size-2 rounded-full bg-blue-500" />
              DevDependencies ({devDeps.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {devDeps.map((dep) => (
              <DependencyItem key={dep.name} dependency={dep} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
