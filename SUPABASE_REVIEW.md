# 🗄️ Supabase 설계 / 보안 기록표

> 이 프로젝트에서 적용한 Supabase 설계 결정과 보안 설정을 정리했습니다.

---

## 📋 전체 요약

| 영역 | 설계 결정 | 보안 수준 |
|------|-----------|-----------|
| 테이블 구조 | user_id 기반 소유자 구분 | ✅ 적절 |
| RLS 정책 | CRUD 4개 정책 개별 설정 | ✅ 적절 |
| 인증 방식 | 이메일 + 비밀번호 (Supabase Auth) | ✅ 적절 |
| API 키 관리 | `.env` + `.gitignore` 처리 | ✅ 적절 |
| 클라이언트 관리 | 단일 인스턴스 공유 | ✅ 적절 |
| 데이터 흐름 | 로그인 후에만 조회 (userId 의존) | ✅ 적절 |

---

## 🗃️ 1. 테이블 설계

### study_records 테이블

| 컬럼 | 타입 | 제약 조건 | 설명 |
|------|------|-----------|------|
| `id` | bigint | PK, 자동 증가 | 레코드 고유 번호 |
| `user_id` | uuid | NOT NULL, FK → auth.users | 소유자 식별 |
| `subject` | text | NOT NULL | 학습 주제 |
| `duration` | integer | NOT NULL, ≥ 1 | 공부 시간 (분) |
| `level` | integer | NOT NULL, 1~5 | 이해도 |
| `memo` | text | 선택 | 메모 |
| `created_at` | timestamptz | default now() | 등록 시각 자동 |

**설계 결정 이유:**
- `user_id`를 `auth.users(id)`에 외래키로 연결 → 계정 삭제 시 데이터 자동 삭제 (`on delete cascade`)
- `created_at`은 DB에서 자동 관리 → 클라이언트에서 전송 불필요
- `duration`, `level`에 check 제약 → DB 수준에서 무결성 보장

---

## 🔒 2. RLS (Row Level Security) 정책

| 정책 이름 | 대상 작업 | 조건 | 설명 |
|-----------|-----------|------|------|
| `Users can view own records` | SELECT | `auth.uid() = user_id` | 본인 기록만 조회 |
| `Users can insert own records` | INSERT | `auth.uid() = user_id` | 본인 id로만 추가 |
| `Users can update own records` | UPDATE | `auth.uid() = user_id` | 본인 기록만 수정 |
| `Users can delete own records` | DELETE | `auth.uid() = user_id` | 본인 기록만 삭제 |

**RLS 적용 전/후 비교:**

| 상태 | 동작 |
|------|------|
| RLS 없음 | 모든 사용자가 전체 데이터 접근 가능 |
| `Allow all` 정책 | 인증 없이도 전체 데이터 접근 가능 (개발 초기) |
| **개인 정책 4개** | 로그인한 사용자는 본인 데이터만 접근 가능 ✅ |

---

## 🔐 3. 인증 설계

| 항목 | 설계 내용 | 이유 |
|------|-----------|------|
| 인증 방식 | 이메일 + 비밀번호 | 가장 기본적인 방식, 추후 소셜 로그인 확장 가능 |
| 비밀번호 최소 길이 | 6자 이상 | Supabase Auth 기본값 |
| 이메일 확인 | 가입 시 확인 메일 발송 | Supabase 기본 보안 설정 |
| 세션 유지 | 브라우저 새로고침 후에도 유지 | Supabase가 localStorage에 자동 저장 |
| 상태 감지 | `onAuthStateChange()` 구독 | 로그인/로그아웃 이벤트 실시간 반영 |
| 로그아웃 | `signOut()` 호출 | 세션 완전 제거 |

---

## 🔑 4. API 키 관리

| 항목 | 내용 | 보안 수준 |
|------|------|-----------|
| `anon` 키 사용 | 클라이언트에서 사용하는 공개 키 | ✅ RLS로 보호 |
| `service_role` 키 | 서버에서만 사용 (관리자 키) | ⚠️ 클라이언트 절대 사용 금지 |
| `.env` 파일 | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | ✅ .gitignore 처리 |
| `.env.example` | 키 없는 템플릿 파일 | ✅ GitHub에 업로드 가능 |

> **anon 키**는 RLS가 적용된 테이블에서는 안전합니다.  
> RLS 없이 `Allow all` 정책인 경우 anon 키로 전체 데이터 접근이 가능하므로 주의!

---

## ⚡ 5. Supabase 클라이언트 설계

### 초기 방식 (문제)
```js
// supabaseService.js — 클라이언트 중복 생성
const supabase = createClient(URL, KEY) // ← 여기
```
```js
// authService.js — 또 다른 클라이언트 생성
const supabase = createClient(URL, KEY) // ← 또 여기
```
→ 두 클라이언트의 세션이 공유되지 않아 **인증 세션 불일치 가능성**

### 개선된 방식 (단일 인스턴스)
```js
// authService.js — 단 하나만 생성
export const supabase = createClient(URL, KEY)

// supabaseService.js — import해서 공유
import { supabase } from './authService'
```
→ 동일한 세션을 모든 서비스에서 공유 → RLS 정상 동작 ✅

---

## 🔄 6. 데이터 흐름 설계

```
사용자 로그인
    ↓
useAuth.js — onAuthStateChange() 감지
    ↓
App.jsx — user 상태 업데이트
    ↓
useStudyRecords(user.id) — userId 전달
    ↓
useEffect([userId]) — userId 있을 때만 실행
    ↓
supabaseService.getAll() — 인증 세션 포함 요청
    ↓
Supabase RLS — auth.uid() = user_id 필터링
    ↓
본인 데이터만 반환
```

---

## 📊 7. 보안 체크리스트

| 항목 | 상태 | 설명 |
|------|------|------|
| RLS 활성화 | ✅ | 모든 정책 적용 완료 |
| anon 키만 사용 | ✅ | service_role 키 미노출 |
| .env gitignore | ✅ | API 키 GitHub 미노출 |
| 인증 전 데이터 조회 차단 | ✅ | userId 의존성으로 해결 |
| 타인 데이터 수정 불가 | ✅ | RLS UPDATE/DELETE 정책 |
| 비밀번호 최소 길이 | ✅ | 6자 이상 (Supabase 기본) |
| 이메일 확인 | ✅ | Supabase 기본 활성화 |
| HTTPS | ✅ | Supabase 기본 제공 |

---

## 🔮 향후 보안 개선 사항

| 항목 | 현재 | 개선 방향 |
|------|------|-----------|
| RLS 정책 | 개인 데이터 분리 | 관리자 역할(admin role) 추가 가능 |
| 인증 방식 | 이메일/비밀번호 | Google, GitHub 소셜 로그인 추가 |
| 비밀번호 정책 | 6자 이상 | 대소문자 + 특수문자 조합 강제 가능 |
| 이메일 확인 | 기본 설정 | 커스텀 이메일 템플릿 적용 가능 |
| 접근 로그 | 없음 | Supabase 대시보드 Logs 활용 가능 |
