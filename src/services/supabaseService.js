// src/services/supabaseService.js
// 학습 기록 CRUD — Supabase 연동 (user_id 포함)

import { supabase } from './authService'

const TABLE = 'study_records'

// READ: 로그인한 사용자의 기록만 불러오기 (RLS가 자동 필터링)
export const getAll = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('불러오기 실패:', error.message)
    return []
  }
  return data
}

// CREATE: user_id는 Supabase RLS에서 auth.uid()로 자동 처리
export const create = async (record) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ ...record, user_id: user.id }])
    .select()
    .single()

  if (error) {
    console.error('추가 실패:', error.message)
    return null
  }
  return data
}

// UPDATE
export const update = async (id, updatedData) => {
  // user_id는 변경 불가 — 제외하고 전송
  const { user_id, created_at, ...safeData } = updatedData

  const { data, error } = await supabase
    .from(TABLE)
    .update(safeData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('수정 실패:', error.message)
    return null
  }
  return data
}

// DELETE
export const remove = async (id) => {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id)

  if (error) {
    console.error('삭제 실패:', error.message)
    return false
  }
  return true
}
