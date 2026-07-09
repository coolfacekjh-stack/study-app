// src/components/StudyList.jsx
// 학습 기록 목록 컨테이너 컴포넌트

import StudyItem from './StudyItem'

function StudyList({ studies, onDelete, onEdit }) {
  // ✅ 목록이 비어있을 때 안내 메시지 표시
  if (studies.length === 0) {
    return (
      <section className="card empty-state">
        <p>📭 등록된 학습기록이 없습니다.</p>
      </section>
    )
  }

  return (
    <section>
      <h2 className="list-title">📋 학습 기록 목록 ({studies.length}건)</h2>

      {/* ✅ studies 배열을 map()으로 순회하며 StudyItem 렌더링 */}
      {studies.map((study) => (
        <StudyItem
          key={study.id}       // React 리스트 렌더링에 필수
          study={study}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </section>
  )
}

export default StudyList
