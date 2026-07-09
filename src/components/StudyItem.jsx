// src/components/StudyItem.jsx
// 개별 학습 기록 카드 컴포넌트

function StudyItem({ study, onDelete, onEdit }) {
  // ✅ id도 구조분해로 추출 → 아래에서 study.id 대신 id 사용 (일관성)
  const { id, subject, duration, level, memo, createdAt, created_at } = study

  // 이해도 숫자를 이모지로 변환
  const levelEmoji = ['😕', '🙂', '😊', '😄', '🤩'][Number(level) - 1] || '😊'

  // ✅ Supabase는 created_at, localStorage는 createdAt 사용 — 둘 다 대응
  const dateValue = createdAt || created_at
  const formattedDate = dateValue
    ? new Date(dateValue).toLocaleDateString('ko-KR')
    : '날짜 없음'

  return (
    <div className="card study-item">
      {/* 학습 주제 */}
      <h3 className="item-subject">{subject}</h3>

      {/* 메타 정보 (공부시간 / 이해도 / 날짜) */}
      <p className="study-meta">
        ⏱ {duration}분 &nbsp;|&nbsp;
        이해도: {levelEmoji} {level}/5 &nbsp;|&nbsp;
        📅 {formattedDate}
      </p>

      {/* 메모 (있을 때만 표시) */}
      {memo && <p className="study-memo">💬 {memo}</p>}

      {/* 수정 / 삭제 버튼 */}
      <div className="item-actions">
        <button
          className="btn-edit"
          onClick={() => onEdit(study)}  // ✅ 수정: 해당 study 전체를 전달
        >
          ✏️ 수정
        </button>
        <button
          className="btn-danger"
          onClick={() => onDelete(id)}  // ✅ 구조분해한 id 변수 사용 (일관성)
        >
          🗑 삭제
        </button>
      </div>
    </div>
  )
}

export default StudyItem
