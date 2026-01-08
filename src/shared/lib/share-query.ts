import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import type { Dependency } from "@/entities/dependency/model/types";

export const SHARE_QUERY_PARAM = "d";
export const SHARE_QUERY_LIMIT = 4000;

interface SharePayload {
  d: Dependency[];
}

export function encodeDependencies(dependencies: Dependency[]): string {
  const payload: SharePayload = { d: dependencies };
  const json = JSON.stringify(payload);
  return compressToEncodedURIComponent(json);
}

export function decodeDependencies(encoded: string): Dependency[] {
  const json = decompressFromEncodedURIComponent(encoded);
  if (!json) {
    throw new Error("공유 데이터 복원에 실패했습니다.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("공유 데이터 형식이 올바르지 않습니다.");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("공유 데이터 형식이 올바르지 않습니다.");
  }

  const payload = parsed as SharePayload;
  if (!Array.isArray(payload.d)) {
    throw new Error("공유 데이터 형식이 올바르지 않습니다.");
  }

  return payload.d;
}
