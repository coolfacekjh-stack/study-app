// src/hooks/useAuth.js
// 로그인 상태를 관리하는 커스텀 훅

import { useState, useEffect } from 'react'
import { getUser, onAuthStateChange } from '../services/authService'

export function useAuth() {
  const [user, setUser] = useState(null)       // 현재 로그인 사용자
  const [authLoading, setAuthLoading] = useState(true) // 초기 인증 확인 중

  useEffect(() => {
    // 앱 실행 시 현재 로그인 사용자 확인
    getUser().then((u) => {
      setUser(u)
      setAuthLoading(false)
    })

    // 로그인/로그아웃 이벤트 실시간 감지
    const { data: { subscription } } = onAuthStateChange((u) => {
      setUser(u)
      setAuthLoading(false)
    })

    // 컴포넌트 언마운트 시 구독 해제
    return () => subscription.unsubscribe()
  }, [])

  return { user, authLoading }
}
