import { z } from "zod/v4";

/**
 * package.json 텍스트 입력 유효성 검증 스키마
 */
export const packageJsonTextSchema = z.string().min(1, "package.json 내용을 입력해주세요");

/**
 * package.json 객체 유효성 검증 스키마
 */
export const packageJsonSchema = z.object({
  name: z.string().optional().default("unknown"),
  version: z.string().optional().default("0.0.0"),
  dependencies: z.record(z.string(), z.string()).optional().default({}),
  devDependencies: z.record(z.string(), z.string()).optional().default({}),
});

/** package.json 입력 타입 (optional 필드 허용) */
export type PackageJsonRawInput = z.input<typeof packageJsonSchema>;
/** package.json 파싱 결과 타입 (default 적용 후) */
export type PackageJsonInput = z.infer<typeof packageJsonSchema>;

/**
 * GitHub URL 유효성 검증 스키마
 * 지원 포맷: https://github.com/{owner}/{repo}
 */
export const githubUrlSchema = z
  .string()
  .url("유효한 URL을 입력해주세요")
  .regex(
    /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/,
    "GitHub 레포지토리 URL 형식이 올바르지 않습니다. (예: https://github.com/owner/repo)"
  );

/**
 * 의존성 파서 폼 입력 스키마
 */
export const dependencyParserFormSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("text"),
    packageJsonText: packageJsonTextSchema,
  }),
  z.object({
    mode: z.literal("github"),
    githubUrl: githubUrlSchema,
  }),
]);

export type DependencyParserFormInput = z.infer<typeof dependencyParserFormSchema>;
