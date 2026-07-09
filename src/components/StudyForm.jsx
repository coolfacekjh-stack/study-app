// src/components/StudyForm.jsx
// 학습 기록 추가 / 수정 폼 컴포넌트

import { useState, useEffect } from 'react'

// 폼 초기값
const initialForm = {
  subject: '',   // 학습 주제
  duration: '',  // 공부 시간 (분)
  level: 3,      // 이해도 1~5
  memo: '',      // 메모
}

function StudyForm({ onAdd, onUpdate, editTarget, onCancel }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({}) // 유효성 검사 에러 메시지

  // ✅ 수정 대상이 바뀌면 폼에 필요한 필드만 채우기
  // (id, createdAt은 폼 입력 항목이 아니므로 제외)
  useEffect(() => {
    if (editTarget) {
      const { subject, duration, level, memo } = editTarget
      setForm({ subject, duration, level, memo })
    } else {
      setForm(initialForm)
    }
  }, [editTarget])

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // ✅ 유효성 검사 함수
  const validate = () => {
    const newErrors = {}

    if (!form.subject.trim()) {
      newErrors.subject = '학습 주제를 입력해 주세요.'
    }

    if (!form.duration || Number(form.duration) < 1) {
      newErrors.duration = '공부 시간은 1분 이상이어야 합니다.'
    }

    if (Number(form.level) < 1 || Number(form.level) > 5) {
      newErrors.level = '이해도는 1~5 사이여야 합니다.'
    }

    return newErrors
  }

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors) // 에러 있으면 화면에 표시 후 저장 중단
      return
    }

    // 검증 통과 시 저장
    setErrors({})
    if (editTarget) {
      // 수정 모드: id만 포함 (created_at은 DB에서 자동 관리)
      onUpdate({ ...form, id: editTarget.id })
    } else {
      // 추가 모드
      onAdd(form)
    }
    setForm(initialForm) // 폼 초기화
  }

  return (
    <section className="card">
      <h2 className="form-title">
        {editTarget ? '✏️ 학습 기록 수정' : '📝 학습 기록 추가'}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* 학습 주제 */}
        <div className="form-group">
          <label>학습 주제 *</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="예) React useState 학습"
            className={errors.subject ? 'invalid' : ''}
          />
          {errors.subject && <span className="error-msg">{errors.subject}</span>}
        </div>

        {/* 공부 시간 */}
        <div className="form-group">
          <label>공부 시간 (분) *</label>
          <input
            type="number"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="예) 60"
            min="1"
            className={errors.duration ? 'invalid' : ''}
          />
          {errors.duration && <span className="error-msg">{errors.duration}</span>}
        </div>

        {/* 이해도 */}
        <div className="form-group">
          <label>이해도 (1~5) *</label>
          <input
            type="number"
            name="level"
            value={form.level}
            onChange={handleChange}
            min="1"
            max="5"
            className={errors.level ? 'invalid' : ''}
          />
          {errors.level && <span className="error-msg">{errors.level}</span>}
        </div>

        {/* 메모 */}
        <div className="form-group">
          <label>메모</label>
          <textarea
            name="memo"
            value={form.memo}
            onChange={handleChange}
            placeholder="오늘 배운 내용을 간단히 적어보세요"
            rows={3}
          />
        </div>

        {/* 저장 버튼 */}
        <button type="submit" className="btn-primary">
          {editTarget ? '✅ 수정 완료' : '💾 저장'}
        </button>

        {/* 수정 모드일 때만 취소 버튼 표시 */}
        {editTarget && (
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
          >
            ✖ 취소
          </button>
        )}
      </form>
    </section>
  )
}

export default StudyForm
