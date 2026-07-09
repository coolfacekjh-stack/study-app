// src/components/Header.jsx
// 앱 상단 헤더 — 로그인 사용자 이메일 + 로그아웃 버튼 포함

import { signOut } from '../services/authService'

function Header({ user }) {
  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="header">
      <div className="header-content">
        <div>
          <h1 className="header-title">📚 학습 기록 관리</h1>
          <p className="header-subtitle">오늘 배운 내용을 기록하고 꾸준히 성장해 보세요.</p>
        </div>

        {/* 로그인 상태일 때만 사용자 정보 + 로그아웃 버튼 표시 */}
        {user && (
          <div className="header-user">
            <span className="user-email">👤 {user.email}</span>
            <button className="btn-logout" onClick={handleSignOut}>
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
