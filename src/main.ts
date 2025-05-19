import './common/total-time.ts'; // 누적 플레이 타임

import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import { allowMusic } from '../src/common/music.ts';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

// intro-music 오디오 객체 생성
import introMusicSrc from '/src/assets/music/intro-music.mp3';
const introMusic = new Audio(introMusicSrc);
introMusic.volume = 0.5;

// index 페이지 안내 dialog
const introNoti = document.querySelector('.music-noti') as HTMLElement;
const musicOk = document.querySelector('.music-ok') as HTMLElement;
const musicCancle = document.querySelector('.music-cancle') as HTMLElement;

// ST :intro-slide
const introSwiper = new Swiper('.intro-slide', {
  modules: [Navigation, Autoplay],
  loop: true, // 무한 루프
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  speed: 1500,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});
introSwiper.autoplay.stop();
// ED :intro-slide

// ST : System mesage 클릭 이벤트
musicOk?.addEventListener('click', () => {
  if (introNoti) {
    introNoti.style.opacity = '0';
    setTimeout(() => {
      introNoti.style.display = 'none';
    }, 1000);
  }
  localStorage.setItem('musicPlay', 'true');
  allowMusic(introMusic, true);

  introSwiper.autoplay.start();
});

musicCancle?.addEventListener('click', () => {
  if (introNoti) {
    introNoti.style.opacity = '0';
    setTimeout(() => {
      introNoti.style.display = 'none';
    }, 1000);
  }
  localStorage.setItem('musicPlay', 'false');
  allowMusic(introMusic, false);
  introSwiper.autoplay.start();
});
// ED : System mesage 클릭 이벤트
