-- ============================================================
-- study_records 테이블 재생성 (회원 기능 포함 버전)
-- Supabase SQL Editor에서 전체 복사 후 실행하세요
-- ============================================================

-- 기존 테이블 삭제
drop table if exists study_records;

-- 테이블 새로 생성 (user_id 컬럼 추가)
create table study_records (
  id         bigint      generated always as identity primary key,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  subject    text        not null,
  duration   integer     not null check (duration >= 1),
  level      integer     not null check (level between 1 and 5),
  memo       text,
  created_at timestamptz default now()
);

-- RLS 활성화 (본인 데이터만 접근 가능)
alter table study_records enable row level security;

-- 본인 데이터만 조회
create policy "Users can view own records"
  on study_records for select
  using (auth.uid() = user_id);

-- 본인 데이터만 추가
create policy "Users can insert own records"
  on study_records for insert
  with check (auth.uid() = user_id);

-- 본인 데이터만 수정
create policy "Users can update own records"
  on study_records for update
  using (auth.uid() = user_id);

-- 본인 데이터만 삭제
create policy "Users can delete own records"
  on study_records for delete
  using (auth.uid() = user_id);

-- 생성 확인
select column_name, data_type
from information_schema.columns
where table_name = 'study_records'
order by ordinal_position;
