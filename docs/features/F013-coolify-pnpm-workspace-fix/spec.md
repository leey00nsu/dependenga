# Feature Spec: Coolify 배포 pnpm 워크스페이스 설정 보정

> 이 템플릿을 복제하여 새 기능 스펙을 작성합니다.
> 기술 스택은 여기서 다루지 않습니다. (plan.md에서 다룸)

---

## 개요

- **기능 ID**: F013
- **기능명**: Coolify 배포 pnpm 워크스페이스 설정 보정
- **작성일**: 2026-01-19
- **상태**: Approved

---

## 목적

Coolify 배포 환경에서 `pnpm install`이 실패하는 원인을 제거하여 안정적으로 빌드/배포가 수행되게 한다.

---

## 사용자 스토리

### US-1: 배포 환경 설치 실패 해소

**As a** 운영자  
**I want** Coolify 배포 환경에서 의존성 설치가 실패하지 않도록  
**So that** 자동 빌드/배포가 정상적으로 진행된다

**Acceptance Criteria:**
- [ ] Coolify에서 `pnpm install`이 실패하지 않는다
- [ ] 기존 로컬 개발 흐름에 영향을 주지 않는다

---

## 기능 요구사항

### FR-1: pnpm workspace 설정 보정

`pnpm-workspace.yaml`에 필수 필드를 추가해 설치 오류를 해소한다.

### FR-2: 기존 워크플로우 유지

로컬 개발 및 CI 흐름은 기존과 동일하게 유지한다.

---

## 비기능 요구사항

- **성능**: 해당 없음
- **보안**: 해당 없음
- **접근성**: 해당 없음

---

## 화면/플로우

- 해당 없음

---

## 엣지 케이스

- pnpm 버전이 변경되어도 workspace 설정이 유효해야 한다

---

## 스펙 외 (Out of Scope)

- Coolify 인프라 자체 설정 변경

---

## 관련 문서

- PRD: [dependenga-prd.md](../../prd/dependenga-prd.md)
- 관련 기능: F012 젠가 물리 빌드 오류 수정
