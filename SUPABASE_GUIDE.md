# 🗄️ Supabase 연동 가이드

> localStorage에서 Supabase(실제 DB)로 전환하는 단계별 가이드입니다.

---

## 📋 전환 전후 비교

| 항목 | localStorage | Supabase |
|------|-------------|---------|
| 저장 위치 | 브라우저 | 클라우드 DB (PostgreSQL) |
| 데이터 유지 | 같은 브라우저에서만 | 어디서든 접근 가능 |
| 용량 제한 | 약 5MB | 500MB (무료 플랜) |
| 실시간 동기화 | ❌ | ✅ 가능 |
| 로그인/인증 | ❌ | ✅ 내장 |

---

## 🚀 1단계 — Supabase 프로젝트 생성

1. [https://supabase.com](https://supabase.com) 접속 → **Start your project** 클릭
2. GitHub 계정으로 로그인
3. **New project** → 프로젝트 이름 입력 (예: `study-app`)
4. 데이터베이스 비밀번호 설정 (기억해 두세요!)
5. 지역 선택: **Northeast Asia (Seoul)**
6. 프로젝트 생성 완료까지 약 1~2분 대기

---

## 🗃️ 2단계 — 테이블 생성

Supabase 대시보드 → **SQL Editor** → 아래 SQL 실행:

```sql
create table study_records (
  id         bigint generated always as identity primary key,
  subject    text        not null,
  duration   integer     not null,
  level      integer     not null check (level between 1 and 5),
  memo       text,
  created_at timestamptz default now()
);

-- 누구나 읽기/쓰기 가능하도록 허용 (개발용)
alter table study_records enable row level security;

create policy "Allow all" on study_records
  for all using (true) with check (true);
```

---

## 🔑 3단계 — API 키 확인

Supabase 대시보드 → **Settings** → **API** 탭에서 확인:

| 항목 | 위치 |
|------|------|
| `Project URL` | URL 섹션 |
| `anon public` 키 | Project API keys 섹션 |

---

## ⚙️ 4단계 — 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ `.env` 파일은 절대 Git에 올리지 마세요!  
> `.gitignore`에 `.env` 가 포함되어 있는지 확인하세요.

---

## 📦 5단계 — 패키지 설치

```bash
npm install @supabase/supabase-js
```

---

## 🔄 6단계 — import 경로 변경 (단 한 줄!)

`src/hooks/useStudyRecords.js` 파일에서:

```js
// ❌ Before (localStorage)
import { getAll, saveAll } from '../services/localStorageService'

// ✅ After (Supabase)
import { getAll, create, update, remove } from '../services/supabaseService'
```

---

## 🛠️ 7단계 — useStudyRecords.js 비동기 처리로 수정

Supabase는 **비동기(async/await)** 이므로 훅도 수정이 필요합니다:

```js
// src/hooks/useStudyRecords.js (Supabase 버전)
import { useState, useEffect } from 'react'
import { getAll, create, update, remove } from '../services/supabaseService'

export function useStudyRecords() {
  const [studies, setStudies] = useState([])

  // 앱 실행 시 Supabase에서 데이터 불러오기
  useEffect(() => {
    const fetchStudies = async () => {
      const data = await getAll()
      setStudies(data)
    }
    fetchStudies()
  }, [])

  // CREATE
  const addStudy = async (formData) => {
    const newRecord = await create(formData)
    if (newRecord) setStudies((prev) => [newRecord, ...prev])
  }

  // UPDATE
  const updateStudy = async (updatedData) => {
    const result = await update(updatedData.id, updatedData)
    if (result) {
      setStudies((prev) =>
        prev.map((s) => (s.id === result.id ? result : s))
      )
    }
  }

  // DELETE
  const deleteStudy = async (id) => {
    const success = await remove(id)
    if (success) setStudies((prev) => prev.filter((s) => s.id !== id))
  }

  return { studies, addStudy, updateStudy, deleteStudy }
}
```

---

## ✅ 전환 체크리스트

- [ ] Supabase 프로젝트 생성 완료
- [ ] `study_records` 테이블 생성 완료
- [ ] `.env` 파일에 URL과 KEY 입력
- [ ] `npm install @supabase/supabase-js` 실행
- [ ] `useStudyRecords.js` import 경로 및 비동기 처리 수정
- [ ] 브라우저에서 데이터 추가/수정/삭제 정상 동작 확인

---

## 🆓 Supabase 무료 플랜 제한

| 항목 | 무료 플랜 |
|------|-----------|
| DB 용량 | 500MB |
| 파일 저장소 | 1GB |
| 월 요청 수 | 500만 건 |
| 프로젝트 수 | 2개 |
| 비활성 일시정지 | 7일 미사용 시 자동 일시정지 |

> 학습 프로젝트 수준에서는 무료 플랜으로 충분합니다! 🎉
