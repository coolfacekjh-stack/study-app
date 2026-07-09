# 🐛 React CRUD 프로젝트 — 오류 기록표

> 이 프로젝트 개발 중 실제로 발생했거나 자주 발생하는 오류를 개발 기록 형식으로 정리했습니다.

---

## 오류 기록

| # | 오류 | 원인 | 해결 방법 |
|---|------|------|-----------|
| 1 | `Warning: Each child in a list should have a unique "key" prop` | `map()` 렌더링 시 `key` prop 미지정 | `<StudyItem key={study.id} ...>` — 고유 id를 key로 지정 |
| 2 | 화면이 깨지고 레이아웃이 이상함 | Vite 기본 `index.css`의 `#root` 고정 너비, `h1` 56px 스타일이 앱 CSS와 충돌 | `index.css` 내용을 최소 리셋 코드만 남기고 제거 |
| 3 | 수정 버튼 클릭 후 폼에 데이터가 안 채워짐 | `editTarget` props가 `StudyForm`으로 전달되지 않았거나 `useEffect` 의존성 배열 누락 | `useEffect(() => { ... }, [editTarget])` — 의존성 배열에 `editTarget` 추가 확인 |
| 4 | 삭제 후에도 목록에서 항목이 사라지지 않음 | `filter()` 이후 `setStudies()` 호출 누락, 또는 id 타입 불일치 (`string` vs `number`) | `setStudies(prev => prev.filter(s => s.id !== id))` — 함수형 업데이트 확인, id 타입 통일 |
| 5 | 저장 버튼 클릭 시 페이지 새로고침 | `<form>` 기본 submit 동작 | `handleSubmit`에서 `e.preventDefault()` 추가 |
| 6 | 앱 새로고침 후 데이터 사라짐 | localStorage 저장 로직 미연결 | `useEffect(() => saveAll(studies), [studies])` 추가 |
| 7 | 앱 실행 시 localStorage 데이터 불러오기 실패 | `useState(getAll())`로 초기화 — 렌더링마다 재실행됨 | `useState(() => getAll())` — lazy initializer 함수 형태로 수정 |
| 8 | `JSON.parse` 오류로 앱 전체 크래시 | localStorage 데이터가 손상되거나 수동으로 잘못 수정된 경우 | `getAll()` 함수에 `try/catch` 추가, 오류 시 빈 배열 반환 |
| 9 | 수정 저장 시 `id`가 `undefined` | `setForm(editTarget)` 없이 폼만 제출 — `editTarget.id` 접근 불가 | `onUpdate({ ...form, id: editTarget.id, createdAt: editTarget.createdAt })` — 명시적으로 id 전달 |
| 10 | 빈 학습 주제로 저장됨 | 유효성 검사 미적용 | `validate()` 함수로 `subject.trim()` 체크, 실패 시 `return`으로 저장 중단 |
| 11 | 이해도에 0 또는 음수 입력 가능 | `<input type="number">` 속성만으로 범위 제한 불충분 | `validate()`에서 `Number(level) < 1 \|\| Number(level) > 5` 조건 검사 추가 |
| 12 | 수정 완료 후 폼이 초기화 안 됨 | `handleSubmit` 이후 `setForm(initialForm)` 누락 | 수정/추가 분기 처리 후 `setForm(initialForm)` 항상 실행 |
| 13 | props로 전달한 `onDelete`가 `undefined` | `StudyList`에서 `StudyItem`으로 props 전달 누락 | `<StudyItem onDelete={onDelete} onEdit={onEdit} ...>` — props 전달 확인 |
| 14 | `Cannot read properties of null (reading 'id')` | `editTarget`이 `null`인 상태에서 `editTarget.id` 접근 | `if (editTarget)` 조건 분기 후 접근, 또는 옵셔널 체이닝 `editTarget?.id` 사용 |
| 15 | 공부 시간에 소수점 입력 가능 | `<input type="number">` 기본 동작 | `step="1"` 속성 추가 또는 `Math.floor()` 처리 |
| 16 | `App.jsx`가 너무 길어 가독성 저하 | CRUD 함수, 상태, UI 모두 한 파일에 집중 | CRUD 로직을 `hooks/useStudyRecords.js`로 분리 (관심사 분리) |
| 17 | `useEffect` 무한 루프 | `useEffect` 의존성 배열에 매 렌더링마다 새로 생성되는 객체/함수 포함 | 의존성 배열에 원시값(배열, 문자열 등)만 사용, 함수는 `useCallback` 또는 훅 외부로 이동 |
| 18 | 수정 모드에서 새 항목 추가 버튼 없음 | `editTarget` 상태 초기화 방법 미제공 | 취소 버튼 추가 또는 빈 폼 클릭 시 `setEditTarget(null)` 호출 |
| 19 | 화면 스크롤이 폼으로 이동 안 됨 | `handleEdit` 함수에 스크롤 로직 없음 | `window.scrollTo({ top: 0, behavior: 'smooth' })` 추가 |
| 20 | 다크 모드에서 카드 배경이 어두워짐 | Vite 기본 `index.css`의 `@media (prefers-color-scheme: dark)` 스타일 잔존 | `index.css` 초기화 후 `App.css`에서 명시적 `background: #ffffff` 지정 |
