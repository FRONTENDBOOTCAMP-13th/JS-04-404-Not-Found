import { allowMusic } from '../../common/music.ts';

const pressStart = document.querySelector('.press-start');

import homeMusicSrc from '/src/assets/music/home-music.mp3';
import selectMusicSrc from '/src/assets/music/select-music.mp3';

const selectMusic = new Audio(selectMusicSrc);
// home-music 오디오 객체 생성 및 음악 재생
const homeMusic = new Audio(homeMusicSrc);
homeMusic.volume = 0.5;
allowMusic(homeMusic, true);

// 마우스 올리고 내렸을 때 동작하는 함수
function mouseEnter() {
  pressStart?.classList.add('active'); // before 보이게
  allowMusic(selectMusic, false); // 효과음 1회
}
function mouseLeave() {
  pressStart?.classList.remove('active'); // before 보이지 않게
}

// 640기준으로 마우스 이벤트 등록/제거
function startHover() {
  const winW: number = window.innerWidth;
  if (winW > 640) {
    pressStart?.classList.remove('active');
    pressStart?.addEventListener('mouseenter', mouseEnter);
    pressStart?.addEventListener('mouseleave', mouseLeave);
  } else {
    pressStart?.removeEventListener('mouseenter', mouseEnter);
    pressStart?.removeEventListener('mouseleave', mouseLeave);
    pressStart?.classList.add('active');
  }
}

// 리사이즈 이벤트로 브라우저 사이즈 달라질 때마다 이벤트동작
window.addEventListener('resize', startHover);
// 초기 동작
startHover();

// 클릭 이벤트 - 로컬 스토리지에서 userName 있는지 확인 후 각자 페이지로 이동
pressStart?.addEventListener('click', () => {
  const isUser: string | null = localStorage.getItem('userName');
  if (isUser !== null && isUser !== '') {
    window.location.href = '/src/pages/town/town.html';
  } else {
    window.location.href = '/src/pages/start/start.html';
  }
});
