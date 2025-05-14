import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

import introMusicSrc from '/src/assets/music/intro-music.mp3';

// index 페이지 안내 dialog
const introNoti = document.querySelector('.music-noti') as HTMLElement;
const musicOk = document.querySelector('.music-ok') as HTMLElement;
const musicCancle = document.querySelector('.music-cancle') as HTMLElement;

// intro-music 오디오 객체 생성
const introMusic = new Audio(introMusicSrc);
introMusic.volume = 0.5;

// intro-slide
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

musicOk?.addEventListener('click', () => {
  if (introNoti) {
    introNoti.style.opacity = '0';
    setTimeout(() => {
      introNoti.style.display = 'none';
    }, 1000);
  }
  introMusic.play();
  introSwiper.autoplay.start();
});

musicCancle?.addEventListener('click', () => {
  if (introNoti) {
    introNoti.style.opacity = '0';
    setTimeout(() => {
      introNoti.style.display = 'none';
    }, 1000);
  }
  introSwiper.autoplay.start();
});
