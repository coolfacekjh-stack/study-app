// src/hooks/useStudyRecords.js
// 학습 기록 CRUD — userId가 확인된 후에만 데이터 로드 (RLS 적용 보장)

import { useState, useEffect } from 'react'
import { getAll, create, update, remove } from '../services/supabaseService'

export function useStudyRecords(userId) {
  const [studies, setStudies] = useState([])
  const [loading, setLoading] = useState(false)

  // ✅ userId가 있을 때만 데이터 불러오기 (로그인 후 RLS가 정확히 동작)
  useEffect(() => {
    if (!userId) {
      setStudies([]) // 로그아웃 시 목록 초기화
      return
    }

    const fetchStudies = async () => {
      setLoading(true)
      const data = await getAll()
      setStudies(data)
      setLoading(false)
    }
    fetchStudies()
  }, [userId]) // userId가 바뀔 때마다 재조회 (로그인/로그아웃/계정 전환)

  // CREATE
  const addStudy = async (formData) => {
    const newRecord = await create(formData)
    if (newRecord) {
      setStudies((prev) => [newRecord, ...prev])
    }
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
    if (success) {
      setStudies((prev) => prev.filter((s) => s.id !== id))
    }
  }

  return { studies, loading, addStudy, updateStudy, deleteStudy }
}
