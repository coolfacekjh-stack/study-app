// src/services/localStorageService.js
// localStorage에 학습 기록을 저장하고 불러오는 함수 모음
// 나중에 Supabase로 전환할 때는 이 파일만 교체하면 됩니다.

const KEY = 'study-records' // localStorage에서 사용할 키 이름

// 전체 기록 불러오기
// ✅ try/catch 추가 — JSON.parse 실패 시 앱 크래시 방지
export const getAll = () => {
  try {
    const data = localStorage.getItem(KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('localStorage 데이터 읽기 실패:', error)
    return [] // 오류 발생 시 빈 배열 반환 (앱은 정상 동작 유지)
  }
}

// 전체 기록 저장 (배열 전체를 덮어씀)
export const saveAll = (records) => {
  localStorage.setItem(KEY, JSON.stringify(records))
}
