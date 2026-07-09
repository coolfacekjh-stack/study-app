# 🐛 오류 해결 기록표

> 이 프로젝트 개발 중 실제로 발생한 오류를 시간 순서대로 정리했습니다.

---

## 실제 발생 오류 기록

| # | 발생 시점 | 오류 | 원인 | 해결 방법 |
|---|-----------|------|------|-----------|
| 1 | CSS 작성 후 | 화면이 깨지고 레이아웃 이상 | Vite 기본 `index.css`의 `#root` 고정 너비, `h1` 56px 스타일이 앱 CSS와 충돌 | `index.css` 내용을 최소 리셋 코드만 남기고 초기화 |
| 2 | 수정 기능 구현 후 | 수정 시 폼에 `id`, `createdAt` 불필요한 필드 포함 | `setForm(editTarget)` 시 객체 전체를 복사 | `useEffect`에서 `{ subject, duration, level, memo }`만 추출 |
| 3 | Supabase 연결 시도 | 앱 실행 오류 — 패키지 없음 | `@supabase/supabase-js` 미설치 상태 | `npm install @supabase/supabase-js` 실행 |
| 4 | Supabase 연결 시도 | INSERT 실패: `Could not find the 'duration' column` | `.env`의 `VITE_SUPABASE_URL`에 대시보드 URL 입력 (`https://supabase.com/dashboard/...`) | API URL 형식으로 수정 (`https://vveieloewjgitridbxas.supabase.co`) |
| 5 | Supabase 테이블 확인 | `study_records` 테이블에 `id`, `created_at`만 존재 | Supabase에서 테이블 생성 시 기본 컬럼만 추가됨 | `supabase_setup.sql` 실행 — `subject`, `duration`, `level`, `memo`, `user_id` 컬럼 추가 |
| 6 | localStorage 코드 검토 | 앱이 JSON 파싱 오류로 크래시 가능성 | `localStorage` 데이터 손상 시 `JSON.parse()` 예외 미처리 | `getAll()` 함수에 `try/catch` 추가, 오류 시 빈 배열 반환 |
| 7 | 수정 기능 구현 후 | 수정 저장 시 `created_at` undefined 전달 | `onUpdate({ ...form, id: editTarget.id, createdAt: editTarget.createdAt })` — Supabase는 `created_at`(스네이크 케이스) 사용 | `createdAt` 전달 제거 (Supabase가 자동 관리) |
| 8 | 날짜 표시 | 학습 카드에 날짜가 "날짜 없음"으로 표시 | Supabase는 `created_at` 반환, 코드는 `createdAt`만 처리 | `const dateValue = createdAt \|\| created_at` 으로 양쪽 대응 |
| 9 | 회원 기능 구현 후 | 다른 계정으로 로그인해도 모든 데이터 보임 | `useStudyRecords` 훅이 앱 마운트 즉시 실행 → 인증 세션 없이 Supabase 요청 → RLS 미적용 | `useStudyRecords(userId)` 파라미터 추가, `userId` 없으면 조회 안 함 |
| 10 | GitHub push 준비 | `.env` 파일이 gitignore에 없음 | Vite 기본 `.gitignore`에 `.env` 미포함 | `.gitignore`에 `.env`, `.env.local`, `.env.production` 추가 |
| 11 | 첫 번째 git commit 후 | `.git_disabled/` 폴더 전체가 커밋됨 | 이전 프로젝트의 `.git` 폴더가 `.git_disabled`로 이름 변경된 채 남아 있었음 | `git rm -r --cached .git_disabled` 후 `.gitignore`에 추가, 정리 커밋 |
| 12 | git commit 실행 | `fatal: not a git repository` | `cd study-app` 후 명령 실행 시 경로 인식 실패 | 절대 경로 `cd "C:\Users\coolf\.claude\ICT7.6\study-app"` 사용 |

---

## 자주 발생하는 React CRUD 오류 참고

| # | 오류 | 원인 | 해결 방법 |
|---|------|------|-----------|
| 1 | `Warning: Each child in a list should have a unique "key" prop` | `map()` 렌더링 시 `key` prop 미지정 | `<StudyItem key={study.id} ...>` — 고유 id를 key로 지정 |
| 2 | 저장 버튼 클릭 시 페이지 새로고침 | `<form>` 기본 submit 동작 | `handleSubmit`에서 `e.preventDefault()` 추가 |
| 3 | 삭제 후에도 목록에서 항목이 사라지지 않음 | `filter()` 이후 `setStudies()` 호출 누락 또는 id 타입 불일치 | 함수형 업데이트 확인, id 타입 통일 |
| 4 | `useEffect` 무한 루프 | 의존성 배열에 매 렌더링마다 새로 생성되는 객체 포함 | 원시값만 의존성 배열에 사용 |
| 5 | `Cannot read properties of null (reading 'id')` | `editTarget`이 `null`인 상태에서 `editTarget.id` 접근 | 옵셔널 체이닝 `editTarget?.id` 또는 조건 분기 사용 |
| 6 | 수정 완료 후 폼이 초기화 안 됨 | `handleSubmit` 이후 `setForm(initialForm)` 누락 | 수정/추가 분기 후 항상 `setForm(initialForm)` 실행 |
| 7 | props로 전달한 함수가 `undefined` | 중간 컴포넌트에서 props 전달 누락 | `<StudyItem onDelete={onDelete} onEdit={onEdit} ...>` 전달 확인 |
