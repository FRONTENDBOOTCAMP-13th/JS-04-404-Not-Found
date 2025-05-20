// 누적 접속 시간
// stayTimeTracker.ts
let startTime = Date.now();
const domain = 'https://pokemon-cc.netlify.app';

function saveStayTime() {
  const currentTime = Date.now();
  const stayTime = currentTime - startTime;

  const prevTime = parseInt(localStorage.getItem('playTime') || '0', 10);
  const newTime = prevTime + Math.floor(stayTime / 1000); // 초 단위로 저장

  localStorage.setItem('playTime', newTime.toString());
}

// 이탈 시 실행
window.addEventListener('beforeunload', () => {
  if (window.location.origin.startsWith(domain)) {
    saveStayTime();
  }
});

// 누적 접속 시간

// const TOTAL_TIME_KEY = 'totalTime';
// let startTime = 0;
// let accumulatedTime = 0;

// // 누적 시간 불러오기
// function loadAccumulatedTime() {
//   const saved = localStorage.getItem(TOTAL_TIME_KEY);
//   return saved ? parseInt(saved, 10) : 0;
// }

// // 누적 시간 저장
// function saveAccumulatedTime(time: number) {
//   localStorage.setItem(TOTAL_TIME_KEY, time.toString());
// }

// // 타이머 시작
// function startTimer() {
//   startTime = Date.now();
// }

// // 타이머 정지 및 누적
// function stopTimer() {
//   if (startTime) {
//     accumulatedTime += Date.now() - startTime;
//     saveAccumulatedTime(accumulatedTime);
//     startTime = 0;
//   }
// }

// // 페이지 진입 시
// function onPageEnter() {
//   accumulatedTime = loadAccumulatedTime();
//   startTimer();
// }

// // 페이지 이탈 시
// function onPageLeave() {
//   stopTimer();
// }

// // 이벤트 등록
// window.addEventListener('pageshow', onPageEnter);
// window.addEventListener('focus', startTimer);
// window.addEventListener('blur', stopTimer);
// window.addEventListener('pagehide', onPageLeave);
// window.addEventListener('beforeunload', onPageLeave);

// // 누적 시간(초) 반환 함수
// export function getTotalTimeSeconds() {
//   if (startTime) {
//     // 현재 세션까지 합산
//     return Math.floor((accumulatedTime + (Date.now() - startTime)) / 1000);
//   }
//   return Math.floor(accumulatedTime / 1000);
// }
