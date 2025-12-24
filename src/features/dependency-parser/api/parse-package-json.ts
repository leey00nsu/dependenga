"use server";

import type { ParsedPackage } from "@/entities/dependency/model/types";
import { packageJsonSchema, dependencyParserFormSchema } from "@/features/dependency-parser/model/schemas";
import { parseDependencies } from "@/features/dependency-parser/lib/parse-dependencies";
import { fetchGithubPackageJson } from "@/shared/api/fetch-github-file";
import { z } from "zod/v4";

export type ParseResult =
  | { success: true; data: ParsedPackage }
  | { success: false; error: string };

/**
 * package.json 텍스트 또는 GitHub URL에서 의존성을 파싱합니다.
 *
 * @param formData - 파싱할 입력 데이터
 * @returns 파싱 결과 또는 에러
 */
export async function parsePackageJson(
  input: z.infer<typeof dependencyParserFormSchema>
): Promise<ParseResult> {
  // 입력 유효성 검증
  const validationResult = dependencyParserFormSchema.safeParse(input);
  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.issues[0]?.message ?? "입력 값이 올바르지 않습니다.",
    };
  }

  const validInput = validationResult.data;

  try {
    let jsonString: string;

    if (validInput.mode === "text") {
      jsonString = validInput.packageJsonText;
    } else {
      // GitHub URL에서 package.json 가져오기
      jsonString = await fetchGithubPackageJson(validInput.githubUrl);
    }

    // JSON 파싱
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonString);
    } catch {
      return {
        success: false,
        error: "JSON 형식이 올바르지 않습니다. package.json 내용을 확인해주세요.",
      };
    }

    // package.json 스키마 검증
    const packageJsonResult = packageJsonSchema.safeParse(parsed);
    if (!packageJsonResult.success) {
      return {
        success: false,
        error: "package.json 형식이 올바르지 않습니다.",
      };
    }

    // 의존성 파싱
    const result = parseDependencies(packageJsonResult.data);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: "알 수 없는 오류가 발생했습니다.",
    };
  }
}
