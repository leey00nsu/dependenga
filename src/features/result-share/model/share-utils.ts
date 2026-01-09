import type { Dependency } from "@/entities/dependency/model/types";
import { encodeDependencies, SHARE_QUERY_LIMIT, SHARE_QUERY_PARAM } from "@/shared/lib/share-query";

export interface ShareEncoding {
  encoded: string;
  length: number;
  tooLong: boolean;
}

export function getShareEncoding(dependencies: Dependency[]): ShareEncoding {
  const encoded = encodeDependencies(dependencies);
  const length = encoded.length;
  return {
    encoded,
    length,
    tooLong: length > SHARE_QUERY_LIMIT,
  };
}

export function buildShareQuery(dependencies: Dependency[]): ShareEncoding & { query: string } {
  const encoding = getShareEncoding(dependencies);
  return {
    ...encoding,
    query: `${SHARE_QUERY_PARAM}=${encoding.encoded}`,
  };
}

export function buildShareUrl(dependencies: Dependency[], origin?: string): ShareEncoding & { url: string } {
  const encoding = buildShareQuery(dependencies);
  const base = origin ?? "";
  return {
    ...encoding,
    url: `${base}/result?${encoding.query}`,
  };
}
