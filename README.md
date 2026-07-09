# 📚 학습 기록 관리 앱

React(Vite) 기반의 학습 기록 CRUD 관리 애플리케이션입니다.

---

## 📌 프로젝트 소개

매일의 학습 내용을 기록하고 관리할 수 있는 웹 앱입니다.  
학습 주제, 공부 시간, 이해도, 메모를 입력하면 카드 형태로 저장되며,  
브라우저를 닫아도 localStorage에 데이터가 유지됩니다.

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| ➕ 추가 | 학습 주제 / 공부시간 / 이해도 / 메모 입력 후 저장 |
| ✏️ 수정 | 수정 버튼 클릭 시 폼에 기존 데이터 자동 채움 |
| 🗑 삭제 | 삭제 버튼 클릭 시 즉시 제거 |
| 💾 자동 저장 | 상태 변경 시 localStorage에 자동 동기화 |
| ✅ 유효성 검사 | 필수 항목 미입력 / 범위 초과 시 에러 메시지 표시 |
| 📭 빈 목록 처리 | 기록 없을 때 안내 메시지 출력 |
| 📱 반응형 | 모바일(480px 이하)에서도 최적화된 레이아웃 |

---

## 🛠 사용 기술

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 19 |
| 빌드 도구 | Vite 8 |
| 언어 | JavaScript (JSX) |
| 스타일 | CSS (CSS-in-class 방식) |
| 데이터 저장 | localStorage |
| 상태 관리 | React useState, useEffect |
| 커스텀 훅 | useStudyRecords |

---

## 📦 설치 방법

```bash
# 저장소 클론 또는 폴더로 이동
cd study-app

# 패키지 설치
npm install
```

---

## ▶️ 실행 방법

```bash
# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

---

## 📁 프로젝트 구조

```
src/
├── components/               # UI 컴포넌트
│   ├── Header.jsx              → 앱 상단 헤더
│   ├── StudyForm.jsx           → 학습 기록 입력 / 수정 폼
│   ├── StudyList.jsx           → 목록 컨테이너 (빈 목록 처리 포함)
│   └── StudyItem.jsx           → 개별 카드 (수정 / 삭제 버튼)
│
├── hooks/                    # 커스텀 훅
│   └── useStudyRecords.js      → CRUD 로직 분리 (관심사 분리)
│
├── services/                 # 데이터 레이어 (Supabase 확장 대비)
│   └── localStorageService.js  → localStorage getAll / saveAll
│
├── App.jsx                   # 최상위 컴포넌트 (UI 조합)
├── App.css                   # 전역 스타일
└── main.jsx                  # 앱 진입점
```

---

## 🤖 AI 활용 내용

이 프로젝트는 AI(Claude)와의 대화형 개발 방식으로 제작되었습니다.

- **요구사항 분석** : 학습 기록 앱의 기능 목록과 데이터 구조 설계
- **프로젝트 구조 설계** : 컴포넌트 분리, services 레이어, hooks 패턴 설계
- **컴포넌트 생성** : Header / StudyForm / StudyList / StudyItem 기본 JSX 생성
- **CRUD 구현** : 추가(addStudy), 수정(updateStudy), 삭제(deleteStudy) 로직 구현
- **유효성 검사** : 학습 주제 필수 / 공부시간 1분↑ / 이해도 1~5 범위 검증
- **CSS 작성** : 카드형 디자인, hover 효과, 반응형 레이아웃 생성
- **오류 수정** : Vite 기본 index.css 충돌 제거, localStorage JSON.parse 오류 처리
- **리팩토링** : CRUD 로직을 `useStudyRecords` 커스텀 훅으로 분리, Fragment 적용

자세한 AI 활용 과정은 [AI_PROMPTS.md](./AI_PROMPTS.md)를 참고하세요.

---

## 🐛 오류 해결 과정

### 1. Vite 기본 스타일 충돌
- **문제** : `index.css`의 `#root` 고정 너비, `h1/h2` 대형 폰트가 앱 스타일과 충돌
- **해결** : `index.css`를 최소 리셋 코드만 남기고 초기화, 실제 스타일은 `App.css`로 통합

### 2. 폼 수정 시 불필요한 필드 포함
- **문제** : `setForm(editTarget)` 시 `id`, `createdAt` 등 폼과 무관한 필드가 상태에 포함
- **해결** : `useEffect`에서 폼 관련 필드(`subject`, `duration`, `level`, `memo`)만 추출

### 3. localStorage 크래시 가능성
- **문제** : 손상된 JSON 데이터가 있을 경우 `JSON.parse()` 오류로 앱 전체가 중단될 수 있음
- **해결** : `try/catch`로 감싸고 오류 시 빈 배열 반환

---

## 🔮 향후 개선 사항

- [ ] **Supabase 연동** : `localStorageService.js` → `supabaseService.js` 교체로 DB 전환
- [ ] **카테고리 필터** : 과목별 / 날짜별 필터링 기능 추가
- [ ] **통계 대시보드** : 총 공부 시간, 평균 이해도 차트 표시
- [ ] **검색 기능** : 학습 주제 키워드 검색
- [ ] **페이지네이션** : 기록이 많아질 때 페이지 나누기
- [ ] **다크 모드** : 시스템 다크 모드 감지 및 테마 전환

---

## 📄 라이선스

MIT
