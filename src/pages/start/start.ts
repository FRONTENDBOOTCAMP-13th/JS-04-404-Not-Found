export let userName = '';

import startMusicSrc from '/src/assets/music/start-music.mp3';

// start-music 오디오 객체 생성 및 음악 재생
const startMusic = new Audio(startMusicSrc);
startMusic.volume = 0.5;

const startWrap = document.querySelector('.start');
const textList = document.querySelectorAll('.text-list li');

// 텍스트 리스트 display none/block
let currentIndex = 0;
function showCurrentText() {
  textList.forEach((li, idx) => {
    (li as HTMLElement).style.display = idx === currentIndex ? 'block' : 'none';
  });
}
// 첫 li 보이도록 초기화
showCurrentText();

// 클릭 이벤트로 다음 텍스트 li 보이기
startWrap?.addEventListener('click', () => {
  if (currentIndex < textList.length - 1) {
    if (currentIndex === 2) {
      const userInput = document.getElementById('userName') as HTMLInputElement;
      const name = userInput.value.trim();

      userName = name;
      if (name !== '') {
        localStorage.setItem('userName', JSON.stringify(userName));
      }
      if (userName === '') {
        userInput.focus();
        return;
      }

      const callUser = document.querySelector('.call-user');
      if (callUser) {
        callUser.innerHTML = userName;
      }
    }
    currentIndex++;
    showCurrentText();
  } else {
    window.location.href = '/src/pages/town/town.html';
  }
});

// 3번째 li input에서 엔터키로도 다음으로 이동
const userInput = document.getElementById('userName') as HTMLInputElement;
if (userInput) {
  userInput.addEventListener('keydown', e => {
    if (currentIndex === 2 && e.key === 'Enter') {
      const name = userInput.value.trim();
      const callUser = document.querySelector('.call-user');

      userName = name;
      if (name !== '') {
        localStorage.setItem('userName', JSON.stringify(userName));
      }
      if (userName === '') {
        userInput.focus();
        return;
      }

      if (callUser) {
        callUser.innerHTML = userName;
      }
      currentIndex++;
      showCurrentText();
    }
  });
}
