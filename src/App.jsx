// src/App.jsx
// 앱 최상위 컴포넌트 - 로그인 여부에 따라 화면 분기

import { useState } from 'react'
import Header from './components/Header'
import StudyForm from './components/StudyForm'
import StudyList from './components/StudyList'
import AuthForm from './components/AuthForm'
import { useStudyRecords } from './hooks/useStudyRecords'
import { useAuth } from './hooks/useAuth'
import './App.css'

function App() {
  const { user, authLoading } = useAuth()  // 로그인 상태
  // ✅ user.id를 전달 → 로그인 후에만 데이터 조회 (RLS 정상 적용)
  const { studies, loading, addStudy, updateStudy, deleteStudy } = useStudyRecords(user?.id)
  const [editTarget, setEditTarget] = useState(null)

  const handleEdit = (study) => {
    setEditTarget(study)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleUpdate = (updatedData) => {
    updateStudy(updatedData)
    setEditTarget(null)
  }

  // 인증 초기 확인 중
  if (authLoading) {
    return (
      <div className="loading-screen">
        <p>⏳ 로딩 중...</p>
      </div>
    )
  }

  // 로그인 안 된 경우 → 인증 폼 표시
  if (!user) {
    return (
      <>
        <Header user={null} />
        <AuthForm />
      </>
    )
  }

  // 로그인 된 경우 → 앱 본문 표시
  return (
    <>
      <Header user={user} />
      <main className="app-container">
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
            ⏳ 데이터를 불러오는 중...
          </div>
        )}
        <StudyForm
          onAdd={addStudy}
          onUpdate={handleUpdate}
          editTarget={editTarget}
        />
        <StudyList
          studies={studies}
          onDelete={deleteStudy}
          onEdit={handleEdit}
        />
      </main>
    </>
  )
}

export default App
