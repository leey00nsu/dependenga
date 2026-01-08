import { ResultView } from "@/widgets/result/ui/result-view";
import { decodeDependencies, SHARE_QUERY_PARAM } from "@/shared/lib/share-query";

type SearchParams = Record<string, string | string[] | undefined>;

export default function ResultPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const raw = searchParams?.[SHARE_QUERY_PARAM];
  const encoded = Array.isArray(raw) ? raw[0] : raw;

  if (!encoded) {
    return <ResultView parsedResult={null} />;
  }

  try {
    const dependencies = decodeDependencies(encoded);
    return (
      <ResultView
        parsedResult={{ name: "shared", version: "0.0.0", dependencies }}
      />
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "공유 데이터 복원에 실패했습니다.";
    return <ResultView parsedResult={null} errorMessage={message} />;
  }
}
