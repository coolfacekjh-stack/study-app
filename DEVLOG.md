# 📖 오늘의 개발 로그 — 2026. 7. 9.

> React(Vite) + Supabase 학습 기록 관리 앱 전체 개발 과정 기록  
> AI(Claude)와 대화형 방식으로 처음 설계부터 GitHub 배포까지 완성

---

## 🕐 전체 개발 흐름

```
설계 → 컴포넌트 → CRUD → CSS → localStorage
  → 리팩토링 → Supabase DB → 회원인증 → RLS → GitHub → 점검/문서화
```

---

## 1️⃣ 프로젝트 설계

**목표:** React(Vite) 기반 학습 기록 관리 앱 구조 설계

**결정 사항:**
- `components/` → UI 컴포넌트
- `hooks/` → 커스텀 훅 (로직 재사용)
- `services/` → 데이터 처리 레이어 (localStorage ↔ Supabase 교체 용이)
- 초보자가 이해하기 쉬운 역할 분리 구조

**생성된 구조:**
```
src/
├── components/   StudyForm, StudyList, StudyItem
├── hooks/        useStudyRecords
├── services/     localStorageService, supabaseService
└── App.jsx
```

---

## 2️⃣ 컴포넌트 구현

| 컴포넌트 | 역할 |
|----------|------|
| `StudyForm` | 학습 기록 추가/수정 입력 폼 |
| `StudyList` | 전체 목록 렌더링 |
| `StudyItem` | 개별 카드 (수정/삭제 버튼) |

**props 구조:**
```
App → StudyForm (onAdd, onUpdate, editTarget, onCancel)
App → StudyList (studies, onDelete, onEdit)
     StudyList → StudyItem (study, onDelete, onEdit)
```

---

## 3️⃣ CRUD 구현

| 기능 | 구현 방식 |
|------|-----------|
| CREATE | `setStudies([newRecord, ...prev])` |
| READ | `useEffect` → `getAll()` 호출 |
| UPDATE | `prev.map(s => s.id === id ? updated : s)` |
| DELETE | `prev.filter(s => s.id !== id)` |

**핵심:** 배열 상태 직접 변경 금지 → 새 배열 반환 (불변 업데이트)

---

## 4️⃣ 유효성 검사

```js
validate() {
  학습 주제: 빈 문자열 불가 (.trim())
  공부 시간: 1분 이상
  이해도: 1~5 범위
}
→ 에러 시 각 필드 아래 인라인 메시지 표시
→ 검증 실패 시 저장 중단 (return)
```

---

## 5️⃣ CSS 스타일링

- 카드형 디자인 (`.card`, `box-shadow`)
- 보라색 브랜드 컬러 (`#4f46e5`)
- hover 효과, 버튼 상태 처리
- 반응형 (`@media max-width: 480px`)
- **문제 해결:** Vite 기본 `index.css` 스타일 충돌 → 초기화

---

## 6️⃣ localStorage 연동

```js
// lazy initializer 패턴
const [studies, setStudies] = useState(() => getAll())

// useEffect로 자동 저장
useEffect(() => {
  localStorage.setItem('studies', JSON.stringify(studies))
}, [studies])
```

**오류 처리:** `JSON.parse()` 실패 시 `try/catch`로 빈 배열 반환

---

## 7️⃣ 커스텀 훅 리팩토링

```js
// Before: App.jsx에 CRUD 로직 전부
// After: useStudyRecords 훅으로 분리
const { studies, addStudy, updateStudy, deleteStudy } = useStudyRecords(userId)
```

**효과:** 컴포넌트는 UI만, 훅은 로직만 담당 → 역할 분리

---

## 8️⃣ Supabase DB 전환

| 단계 | 내용 |
|------|------|
| 패키지 설치 | `npm install @supabase/supabase-js` |
| 테이블 생성 | `supabase_setup.sql` 실행 |
| URL 수정 | 대시보드 URL → API URL로 수정 |
| 연결 테스트 | `count: 0` 응답 확인 |
| 서비스 교체 | `localStorageService` → `supabaseService` |

**오류:** `VITE_SUPABASE_URL`에 대시보드 URL 입력 → API URL 형식으로 수정

---

## 9️⃣ 회원가입 / 로그인 (Supabase Auth)

**추가 파일:**

| 파일 | 역할 |
|------|------|
| `authService.js` | signUp / signIn / signOut |
| `useAuth.js` | onAuthStateChange() 구독 |
| `AuthForm.jsx` | 로그인/회원가입 전환 폼 |
| `Header.jsx` | 이메일 + 로그아웃 버튼 |

**App.jsx 분기:**
```
authLoading → 로딩 화면
!user       → AuthForm
user        → 앱 본문 (StudyForm + StudyList)
```

---

## 🔟 RLS 데이터 분리 버그 수정

**버그:** 다른 계정으로 로그인해도 전체 데이터가 보임

**원인 분석:**
```
앱 시작 → useStudyRecords useEffect 즉시 실행
→ 인증 세션 없이 Supabase 요청
→ RLS: auth.uid() = null → 필터 미적용 → 전체 반환
```

**해결:**
```js
// Before
const { studies } = useStudyRecords()

// After
const { studies } = useStudyRecords(user?.id)
// userId 없으면 조회 안 함, userId 변경 시 재조회
```

---

## 1️⃣1️⃣ 수정 취소 버튼 추가

**테스트 시나리오 점검 중 발견:** 수정 모드에서 취소 기능 없음

**수정 내용:**
```jsx
// StudyForm.jsx
{editTarget && (
  <button type="button" className="btn-cancel" onClick={onCancel}>
    ✖ 취소
  </button>
)}

// App.jsx
<StudyForm onCancel={() => setEditTarget(null)} />
```

---

## 1️⃣2️⃣ GitHub 배포

| 단계 | 내용 |
|------|------|
| 보안 점검 | `.gitignore`에 `.env`, `.git_disabled` 추가 |
| 초기화 | `git init` |
| 커밋 | `git add . && git commit` |
| 레포 생성 | `gh repo create study-app --public` |
| Push | `git push origin master` |

**GitHub:** `https://github.com/coolfacekjh-stack/study-app`

---

## 1️⃣3️⃣ 점검 및 문서화

| 점검 항목 | 결과 |
|-----------|------|
| 완성도 체크리스트 (11개) | 10✅ 1⚠️ |
| 기능 테스트 시나리오 (9개) | 9/9 ✅ |
| Supabase 보안 점검 (6개) | 5✅ 1⚠️ |

**생성된 문서:**

| 파일 | 내용 |
|------|------|
| `README.md` | 전체 프로젝트 설명 |
| `AI_PROMPTS.md` | AI 프롬프트 기록 |
| `AI_REVIEW.md` | AI 생성 결과 검토표 |
| `ERRORS.md` | 오류 해결 기록 (12건) |
| `SUPABASE_GUIDE.md` | Supabase 연동 가이드 |
| `SUPABASE_REVIEW.md` | Supabase 설계/보안 기록표 |
| `CHECKLIST.md` | 완성도 체크리스트 |
| `DEVLOG.md` | 오늘의 개발 로그 (이 파일) |

---

## 📊 오늘 배운 핵심 개념

| 개념 | 핵심 포인트 |
|------|-------------|
| React 상태 불변 업데이트 | 배열 직접 수정 금지 → map/filter/spread 사용 |
| 커스텀 훅 | UI와 로직 분리 → 재사용성 향상 |
| Controlled Component | form 값을 state로 관리 |
| 서비스 레이어 분리 | DB 교체 시 서비스 파일만 수정 |
| Supabase RLS | `auth.uid() = user_id` → 계정별 데이터 격리 |
| 환경 변수 | `.env` + `import.meta.env` + `.gitignore` 보안 처리 |
| useEffect 의존성 | `[userId]` → 로그인 후에만 조회 |

---

## 💡 다음에 도전할 것

- [ ] Vercel 배포 (GitHub Actions 연동)
- [ ] 카테고리 / 날짜 필터
- [ ] 통계 페이지 (Chart.js)
- [ ] 다크 모드
- [ ] Google 소셜 로그인
