# Spec: 문서 구조 개선 (ADR 도입)

- Feature: F004-documentation-improvement
- Status: Approved
- Date: 2025-12-26

## 개요

프로젝트 문서 구조를 개선하여 기술 결정의 추적성과 일관성을 높입니다.

## 목표

1. **ADR (Architecture Decision Records) 도입**: `research.md` → `decisions.md`로 전환
2. **에이전트 규칙 강화**: 기술 결정 시 반드시 `decisions.md`에 기록
3. **기존 Feature 문서 마이그레이션**: F001, F002, F003의 문서 구조 통일

## 사용자 스토리

> 개발자는 과거에 왜 특정 기술/아키텍처를 선택했는지 빠르게 파악하고 싶다.

## 기능 요구 사항

1. `decisions.md` 템플릿 생성
2. `agents.md`에 ADR 규칙 추가
3. 기존 `research.md` 삭제 (빈 템플릿)
4. `feature-base`에서 `research.md` 제거

## 비기능 요구 사항

- 문서 형식 일관성
- 에이전트 자동 기록

## 완료 조건

- [x] `decisions.md` 템플릿이 `feature-base`에 존재
- [x] `research.md`가 `feature-base`에서 제거됨
- [x] `agents.md`에 ADR 규칙 섹션 존재
- [x] F001, F002, F003에서 `research.md` 삭제됨
- [x] `docs/db` 폴더 삭제됨
- [x] `agents.md`에 docs 표준 구조 섹션 존재

## 제외 사항

- 기존 decisions 내용 작성 (이미 구현된 Feature는 시간이 지나 결정 맥락 부족)
