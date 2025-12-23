#!/bin/bash

# 새 기능 스펙 폴더 생성 스크립트
# 사용법: ./new-feature.sh F001 feature-name

set -e

FEATURE_ID=$1
FEATURE_NAME=$2

if [ -z "$FEATURE_ID" ] || [ -z "$FEATURE_NAME" ]; then
  echo "사용법: ./new-feature.sh <FEATURE_ID> <FEATURE_NAME>"
  echo "예시: ./new-feature.sh F001 dependency-parser"
  exit 1
fi

DOCS_DIR="$(dirname "$0")/.."
FEATURE_DIR="$DOCS_DIR/features/$FEATURE_ID-$FEATURE_NAME"

if [ -d "$FEATURE_DIR" ]; then
  echo "오류: $FEATURE_DIR 폴더가 이미 존재합니다."
  exit 1
fi

# 템플릿 복제
cp -r "$DOCS_DIR/features/feature-base" "$FEATURE_DIR"

# 플레이스홀더 치환
sed -i '' "s/{기능명}/$FEATURE_NAME/g" "$FEATURE_DIR"/*.md
sed -i '' "s/{번호}/${FEATURE_ID#F}/g" "$FEATURE_DIR"/*.md
sed -i '' "s/YYYY-MM-DD/$(date +%Y-%m-%d)/g" "$FEATURE_DIR"/*.md

echo "✅ 기능 폴더 생성 완료: $FEATURE_DIR"
echo ""
echo "다음 단계:"
echo "1. $FEATURE_DIR/spec.md 작성"
echo "2. 사용자 리뷰 요청"
echo "3. 승인 후 plan.md 작성"
