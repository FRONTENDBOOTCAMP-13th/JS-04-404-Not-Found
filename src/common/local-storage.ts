// ** local storage

// userName : localStorage의 userName 값
/*
start 페이지에서 받는 유저 이름 정보를 반환
위 정보가 있을 경우 다시 접속시 start 페이지 건너뜀
위 정보를 게임내에서 이름으로 사용
*/

export function userName(): string | null {
  return localStorage.getItem('userName');
}

// musicPlay : localStorage의 musicPlay 값
/*
로컬 스토리지에 저장되어있는 음소거/재생 값을 반환
true 일 경우 모든 페이지 배경음악 및 효과음 ON
false 일 경우 모든 페ㅐ이지 배경음악 및 효과음 OFF
*/
export function musicPlay(): string | null {
  return localStorage.getItem('musicPlay');
}

// myPokemon : 내가 획득한 포켓몬의 도감번호 배열
/*
뽑기, 슬롯에서 얻은 도감 번호 추가되어 저장되어 있는 배열을 반환
초기 값을 빈 배열로 넣어 놓았음
*/
if (!localStorage.getItem('myPokemon')) {
  localStorage.setItem('myPokemon', '[]');
}
export function myPokemon() {
  return JSON.parse(localStorage.getItem('myPokemon') || '[]');
}

// playTime : 총 접속 시간
/*
초 단위로 저장된 값을 반환
*/
export function playTime(): number {
  return Number(localStorage.getItem('playTime'));
}

// 1초마다 playTime 값을 증가시키는 함수
setInterval(() => {
  const current = Number(localStorage.getItem('playTime')) || 0;
  localStorage.setItem('playTime', String(current + 1));
}, 1000);
