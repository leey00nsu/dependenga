/**
 * 단일 의존성 정보를 나타냅니다.
 */
export interface Dependency {
  /** 패키지명 (예: "react", "lodash") */
  name: string;
  /** 명시된 버전 (예: "^16.1.1", "~2.0.0") */
  version: string;
  /** devDependency 여부 */
  isDev: boolean;
}

/**
 * 파싱된 package.json 정보를 나타냅니다.
 */
export interface ParsedPackage {
  /** 프로젝트명 */
  name: string;
  /** 프로젝트 버전 */
  version: string;
  /** 모든 의존성 목록 (dependencies + devDependencies) */
  dependencies: Dependency[];
}

/**
 * GitHub 레포지토리 URL에서 추출된 정보
 */
export interface GithubRepoInfo {
  /** 레포지토리 소유자 */
  owner: string;
  /** 레포지토리 이름 */
  repo: string;
  /** 브랜치명 (기본값: main) */
  branch?: string;
}
