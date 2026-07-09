// src/components/AuthForm.jsx
// 로그인 / 회원가입 폼 컴포넌트

import { useState } from 'react'
import { signIn, signUp } from '../services/authService'

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)  // true=로그인, false=회원가입
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')    // 안내 메시지
  const [error, setError] = useState('')        // 에러 메시지
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (isLogin) {
        await signIn(email, password)
        // 로그인 성공 시 useAuth가 자동으로 user 상태 업데이트
      } else {
        await signUp(email, password)
        setMessage('📧 가입 확인 이메일을 발송했습니다. 이메일을 확인해 주세요!')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <h2 className="form-title">
          {isLogin ? '🔐 로그인' : '✏️ 회원가입'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6자 이상 입력"
              minLength={6}
              required
            />
          </div>

          {/* 에러 / 안내 메시지 */}
          {error   && <p className="error-msg"  style={{ marginBottom: 12 }}>{error}</p>}
          {message && <p className="success-msg">{message}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '처리 중...' : isLogin ? '🔐 로그인' : '✏️ 회원가입'}
          </button>
        </form>

        {/* 로그인 ↔ 회원가입 전환 */}
        <p className="auth-switch">
          {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
          <button
            className="btn-link"
            onClick={() => { setIsLogin(!isLogin); setError(''); setMessage('') }}
          >
            {isLogin ? ' 회원가입' : ' 로그인'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default AuthForm
