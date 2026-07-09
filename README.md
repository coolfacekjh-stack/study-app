# 📚 학습 기록 관리 앱

React(Vite) + Supabase 기반의 학습 기록 CRUD 관리 애플리케이션입니다.  
회원가입/로그인 기능을 포함하며, 계정별로 학습 기록이 독립적으로 관리됩니다.

---

## 🌐 GitHub
```
https://github.com/coolfacekjh-stack/study-app
```

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 🔐 회원가입 / 로그인 | 이메일 + 비밀번호 인증 (Supabase Auth) |
| 🔒 계정별 데이터 분리 | 로그인한 계정의 기록만 조회 가능 (RLS) |
| ➕ 추가 (Create) | 학습 주제 / 공부시간 / 이해도 / 메모 입력 후 저장 |
| 📋 조회 (Read) | 내 학습 기록 목록 최신순 출력 |
| ✏️ 수정 (Update) | 수정 버튼 클릭 시 폼에 기존 데이터 자동 채움 |
| 🗑 삭제 (Delete) | 삭제 버튼 클릭 시 즉시 제거 |
| ✅ 유효성 검사 | 필수값 / 범위 초과 시 에러 메시지 표시 |
| 📭 빈 목록 처리 | 기록 없을 때 안내 메시지 출력 |
| 📱 반응형 | 모바일(480px 이하)에서도 최적화된 레이아웃 |

---

## 🛠 사용 기술

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 19 |
| 빌드 도구 | Vite |
| 언어 | JavaScript (JSX) |
| 스타일 | CSS |
| 데이터베이스 | Supabase (PostgreSQL) |
| 인증 | Supabase Auth |
| 상태 관리 | React useState, useEffect |
| 커스텀 훅 | useStudyRecords, useAuth |

---

## 📦 설치 방법

```bash
# 저장소 클론
git clone https://github.com/coolfacekjh-stack/study-app.git
cd study-app

# 패키지 설치
npm install
```

---

## ⚙️ 환경 변수 설정

`.env.example`을 복사해 `.env` 파일을 생성하고 Supabase 키를 입력합니다:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> ⚠️ `.env` 파일은 절대 GitHub에 올리지 마세요. (`.gitignore`에 포함됨)

---

## 🗃️ Supabase 테이블 생성

Supabase SQL Editor에서 `supabase_setup.sql` 내용을 실행하세요:

```sql
create table study_records (
  id         bigint      generated always as identity primary key,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  subject    text        not null,
  duration   integer     not null check (duration >= 1),
  level      integer     not null check (level between 1 and 5),
  memo       text,
  created_at timestamptz default now()
);

alter table study_records enable row level security;

-- 본인 기록만 CRUD 가능하도록 정책 설정
create policy "Users can view own records"   on study_records for select using (auth.uid() = user_id);
create policy "Users can insert own records" on study_records for insert with check (auth.uid() = user_id);
create policy "Users can update own records" on study_records for update using (auth.uid() = user_id);
create policy "Users can delete own records" on study_records for delete using (auth.uid() = user_id);
```

---

## ▶️ 실행 방법

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

---

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── AuthForm.jsx        → 로그인 / 회원가입 폼
│   ├── Header.jsx          → 헤더 (이메일 + 로그아웃 버튼)
│   ├── StudyForm.jsx       → 학습 기록 추가 / 수정 폼
│   ├── StudyList.jsx       → 목록 컨테이너
│   └── StudyItem.jsx       → 개별 카드 (수정 / 삭제)
│
├── hooks/
│   ├── useAuth.js          → 로그인 상태 관리
│   └── useStudyRecords.js  → CRUD 로직 (userId 의존)
│
├── services/
│   ├── authService.js      → signUp / signIn / signOut
│   ├── supabaseService.js  → getAll / create / update / remove
│   └── localStorageService.js → (레거시) localStorage 버전
│
├── App.jsx                 → 인증 분기 + 전체 레이아웃
├── App.css                 → 전역 스타일
└── main.jsx                → 진입점
```

---

## 🤖 AI 활용 개발 과정 요약

이 프로젝트는 AI(Claude)와의 대화형 개발 방식으로 제작되었습니다.

| 단계 | 내용 |
|------|------|
| 1️⃣ 설계 | 프로젝트 구조 설계 (components / hooks / services 분리) |
| 2️⃣ 컴포넌트 생성 | Header, StudyForm, StudyList, StudyItem 기본 뼈대 생성 |
| 3️⃣ CRUD 구현 | 추가 / 수정 / 삭제 로직 및 유효성 검사 구현 |
| 4️⃣ CSS 작성 | 카드형 디자인, 반응형, hover 효과 |
| 5️⃣ localStorage 연동 | useEffect + lazy initializer 패턴 |
| 6️⃣ 리팩토링 | useStudyRecords 커스텀 훅 분리, Fragment 적용 |
| 7️⃣ Supabase 연동 | DB 전환, 패키지 설치, URL 수정, 연결 테스트 |
| 8️⃣ 회원가입/로그인 | Supabase Auth, useAuth 훅, AuthForm 컴포넌트 |
| 9️⃣ RLS 데이터 분리 | user_id 컬럼 + 정책 4개 설정, userId 의존성 버그 수정 |
| 🔟 GitHub 배포 | .gitignore 보안 설정, git init, gh CLI로 push |

자세한 프롬프트 기록은 [AI_PROMPTS.md](./AI_PROMPTS.md)를 참고하세요.

---

## 🐛 주요 오류 해결

| 오류 | 원인 | 해결 |
|------|------|------|
| Vite index.css 스타일 충돌 | `#root` 고정 너비 등 기본 CSS | index.css 초기화 |
| localStorage JSON.parse 크래시 | 손상 데이터 | try/catch 추가 |
| Supabase URL 오류 | 대시보드 URL 사용 | `project-id.supabase.co` 형식으로 수정 |
| 다른 계정 데이터 보임 | 인증 전 데이터 조회 | `useStudyRecords(user?.id)` userId 의존성 추가 |
| 폼 수정 시 id/createdAt 포함 | setForm(editTarget) 전체 복사 | 필요 필드만 추출 |
| .git_disabled 폴더 커밋 | gitignore 미설정 | gitignore 추가 후 git rm --cached |

자세한 오류 기록은 [ERRORS.md](./ERRORS.md)를 참고하세요.

---

## ☑️ 완성도 체크리스트

| 항목 | 결과 |
|------|------|
| 목록 조회, 추가, 수정, 삭제 포함 | ✅ |
| id와 필수 필드 명확 | ✅ |
| 파일 역할 분리 | ✅ |
| 컴포넌트 역할과 props 명확 | ✅ |
| 배열 상태 불변 업데이트 | ✅ |
| 빈 입력 / 잘못된 입력 처리 | ✅ |
| 빈 상태 메시지 | ✅ |
| 저장 구조 명확 (Supabase) | ✅ |
| API 키 보안 처리 | ✅ |
| README 실행 방법 + AI 기록 | ✅ |
| 과도한 구현 여부 | ⚠️ CRUD → Supabase → Auth 단계적 확장 (초보자 주의) |

---

## 🧪 기능 테스트 시나리오

| # | 테스트 항목 | 기대 결과 | 결과 |
|---|------------|-----------|------|
| 1 | 초기 화면 | 로그인 폼 → 로그인 후 목록/빈 상태 | ✅ |
| 2 | 항목 추가 | 목록에 새 항목 표시 | ✅ |
| 3 | 빈 입력 검증 | 에러 메시지 표시 | ✅ |
| 4 | 항목 수정 | 수정 내용 반영 | ✅ |
| 5 | 수정 취소 | 기존 값 유지 (✖ 취소 버튼) | ✅ |
| 6 | 항목 삭제 | 선택 항목 제거 | ✅ |
| 7 | 빈 상태 | 빈 상태 메시지 표시 | ✅ |
| 8 | 새로고침 | 데이터 유지 (Supabase 세션) | ✅ |
| 9 | Supabase 연결 | DB와 화면 동기화 | ✅ |

---

## 🔒 Supabase 보안 점검

| 항목 | 확인 질문 | 결과 |
|------|-----------|------|
| 키 구분 | anon 키만 사용, service_role 키 미노출 | ✅ |
| RLS | 테이블에 RLS 활성화 + 4개 정책 적용 | ✅ |
| Auth | 사용자별 데이터 완전 분리 (user_id + RLS) | ✅ |
| 권한 | "Allow all" 정책 없음, 본인 데이터만 CRUD | ✅ |
| GitHub | `.env` gitignore 처리, 코드에 키 하드코딩 없음 | ✅ |
| 캡처 | 대시보드 스크린샷 공유 시 민감 정보 노출 주의 | ⚠️ |

---

## 🔮 향후 개선 사항

- [ ] **Vercel 배포** : GitHub 연동으로 자동 배포
- [ ] **카테고리 필터** : 과목별 / 날짜별 필터링
- [ ] **통계 대시보드** : 총 공부 시간, 평균 이해도 차트
- [ ] **검색 기능** : 학습 주제 키워드 검색
- [ ] **다크 모드** : 시스템 다크 모드 감지 및 테마 전환

---

## 📄 라이선스

MIT
