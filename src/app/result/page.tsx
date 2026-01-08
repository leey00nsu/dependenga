import { ResultView } from "@/widgets/result/ui/result-view";
import { decodeDependencies, SHARE_QUERY_PARAM } from "@/shared/lib/share-query";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ResultPage({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const resolvedParams = searchParams ? await Promise.resolve(searchParams) : undefined;
  const raw = resolvedParams?.[SHARE_QUERY_PARAM];
  const encoded = Array.isArray(raw) ? raw[0] : raw;
  let errorMessage: string | null = null;
  let dependencies: ReturnType<typeof decodeDependencies> | null = null;

  if (!encoded) {
    return <ResultView parsedResult={null} />;
  }

  try {
    dependencies = decodeDependencies(encoded);
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "공유 데이터 복원에 실패했습니다.";
  }

  if (!dependencies) {
    return <ResultView parsedResult={null} errorMessage={errorMessage} />;
  }

  return (
    <ResultView
      parsedResult={{ name: "shared", version: "0.0.0", dependencies }}
    />
  );
}
