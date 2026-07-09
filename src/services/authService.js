// src/services/authService.js
// Supabase 인증 관련 함수 (회원가입, 로그인, 로그아웃, 현재 사용자)

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// 회원가입
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw new Error(error.message)
  return data
}

// 로그인
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  return data
}

// 로그아웃
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

// 현재 로그인한 사용자 가져오기
export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// 인증 상태 변화 감지 (로그인/로그아웃 이벤트)
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })
}
