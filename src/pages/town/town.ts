import '../../common/total-time.ts'; // 누적 플레이 타임
import { toggleSound } from '../../common/toggle-sound.ts'; // 음악 켜기 / 끄기 기능
import {
  musicPlay,
  userName,
  myPokemon,
  playTime,
} from '../../common/local-storage.ts'; // 현재 로컬스토리지의 음소거 상태
import { allowMusic } from '../../common/music.ts';
import townMusicSrc from '/src/assets/music/town-music.mp3';
import soundOn from '/src/assets/common/sound-on.png'; // sound-on 이미지
import soundOff from '/src/assets/common/sound-off.png'; // sound-off 이미지

// 페이지가 이동될 때 userInfoModal 닫기
window.addEventListener('beforeunload', () => {
  userInfoModal?.classList.add('d-none');
});

// town-music 오디오 객체 생성 및 음악 재생
const townMusic = new Audio(townMusicSrc);
townMusic.volume = 0.3;
allowMusic(townMusic, true);

// 이미지맵 리사이저 cdn 실행 스크립트 입니다.
declare function imageMapResize(): void;
imageMapResize();

// ST : 모달창 관련 ------------------
const userInfo = document.querySelector('#userInfo'); // userInfo 와 연결되어있는 영역
const userInfoModal = document.querySelector('#userInfoModal'); // userinfo 모달창 영역
const userInfoModalCloseBtn = document.querySelector('#userInfoModalCloseBtn'); //userinfo 닫기 버튼

// 모달창 열기함수
function openModal(modal: Element) {
  modal.classList.remove('d-none');
  if (modal === userInfoModal) {
    // 접속시간 text로 넣기
    updatePlayTimeText();
  }
}

// 모달창 닫기 함수
function closeModal(modal: Element) {
  modal.classList.add('d-none');
}

// 특정 이벤트에 모달창 열기함수가 실행되는 함수.
function openModalEvent(target: Element, modal: Element) {
  target.addEventListener('click', e => {
    e.preventDefault();
    openModal(modal);
  });
  target.addEventListener('touchstart', e => {
    e.preventDefault();
    openModal(modal);
  });
}

// 특정 이벤트에 모달창 닫기함수가 실행되는 함수.
function closeModalEvent(target: Element, modal: Element) {
  target.addEventListener('click', e => {
    e.preventDefault();
    closeModal(modal);
  });
  target.addEventListener('touchstart', e => {
    e.preventDefault();
    closeModal(modal);
  });
}

// 이벤트 부여
if (userInfo && userInfoModal) {
  openModalEvent(userInfo, userInfoModal);
}
if (userInfoModalCloseBtn && userInfoModal) {
  closeModalEvent(userInfoModalCloseBtn, userInfoModal);
}

// ED : 모달창 관련 ------------------

// ST : 뒤로가기, 음소거 버튼 ------------------
const backBtn = document.querySelector('.back-btn') as HTMLElement;
const toggleSoundBtn = document.querySelector('.toggle-sound') as HTMLElement;
const toggleSoundText = document.querySelector(
  '.toggle-sound > span',
) as HTMLElement;

// 버튼 및 span의 텍스트 초기화
if (musicPlay() === 'true') {
  toggleSoundBtn.style.backgroundImage = `url(${soundOn})`;
  toggleSoundText.innerHTML = '전체 소리 끄기 버튼';
} else {
  toggleSoundBtn.style.backgroundImage = `url(${soundOff})`;
  toggleSoundText.innerHTML = '전체 소리 켜기 버튼';
}

// 뒤로가기
backBtn.addEventListener('click', () => {
  window.history.back();
});

// 음소거/재생
toggleSoundBtn.addEventListener('click', () => {
  const soundState: string | null = musicPlay();
  toggleSound(townMusic);
  if (soundState === 'true') {
    toggleSoundBtn.style.backgroundImage = `url(${soundOff})`;
    toggleSoundText.innerHTML = '전체 소리 켜기 버튼';
  } else {
    toggleSoundBtn.style.backgroundImage = `url(${soundOn})`;
    toggleSoundText.innerHTML = '전체 소리 끄기 버튼';
  }
});

// 640기준으로 뒤로가기, 음소거/재생 마우스 이벤트 등록/제거
function topBtnHover() {
  const winW: number = window.innerWidth;
  if (winW > 640) {
    backBtn.style.opacity = '0.7';
    toggleSoundBtn.style.opacity = '0.7';
    backBtn.addEventListener('mouseenter', () => {
      backBtn.style.opacity = '1';
    });
    backBtn.addEventListener('mouseleave', () => {
      backBtn.style.opacity = '0.7';
    });
    toggleSoundBtn.addEventListener('mouseenter', () => {
      toggleSoundBtn.style.opacity = '1';
    });
    toggleSoundBtn.addEventListener('mouseleave', () => {
      toggleSoundBtn.style.opacity = '0.7';
    });
  } else {
    backBtn.style.opacity = '1';
    toggleSoundBtn.style.opacity = '1';
  }
}

// 리사이즈 이벤트로 브라우저 사이즈 달라질 때마다 이벤트동작
window.addEventListener('resize', topBtnHover);
// 초기 동작
topBtnHover();

// ED : 뒤로가기, 음소거 버튼 ------------------

// ST : user-info-text 영역 ------------------

const userTitleText = document.querySelector('.user-title') as HTMLElement;
const userNameText = document.querySelector('.user-name') as HTMLElement;
const allPokemonText = document.querySelector('.all-pokemons') as HTMLElement;
const playTimeText = document.querySelector('.play-time') as HTMLElement;
const badgeGray = document.querySelectorAll(
  '.badge-gray',
) as NodeListOf<HTMLElement>;

// 관장 배지 조건
function updateUserBadge() {
  const allGymLeaders = [
    [74, 95],
    [120, 121],
    [25, 26, 100],
    [45, 71, 114],
    [89, 109, 110],
    [49, 64, 65, 122],
    [58, 59, 77, 78],
    [31, 34, 51, 111, 112],
  ];

  // myPokemon이 allGymeLeaders중에 포함하고 있는 지 여부에 따라 배지 획득 기능
  for (let i = 0; i < allGymLeaders.length; i++) {
    if (allGymLeaders[i].every(id => myPokemon().includes(id))) {
      badgeGray[i].style.filter = 'brightness(100%)';
    } else {
      badgeGray[i].style.filter = 'brightness(10%)';
    }
  }
}
updateUserBadge();

// 별칭 조건 및 설정
function updateUserTitle() {
  const pokemonCount = myPokemon().length;

  if (pokemonCount >= 151) {
    userTitleText.innerHTML = '13기 사랑해요♥';
  } else if (pokemonCount >= 145) {
    userTitleText.innerHTML = '킹갓제네럴 레드';
  } else if (pokemonCount >= 130) {
    userTitleText.innerHTML = '마스터 트레이너';
  } else if (pokemonCount >= 100) {
    userTitleText.innerHTML = '엘리트 트레이너';
  } else if (pokemonCount >= 70) {
    userTitleText.innerHTML = '중급 트레이너';
  } else if (pokemonCount >= 30) {
    userTitleText.innerHTML = '초급 트레이너';
  } else if (pokemonCount >= 5) {
    userTitleText.innerHTML = '트레이너 스쿨 학생';
  } else {
    userTitleText.innerHTML = '태초마을 지우';
  }
}
updateUserTitle();

// 플레이 타임 갱신해서 넣기 위한 함수
function updatePlayTimeText() {
  // 플레이 타임 분, 초로 변경
  const allSeconds: number = playTime();
  const minutes = Math.floor(allSeconds / 60);
  const seconds = allSeconds % 60;
  playTimeText.innerHTML = `${minutes}분 ${seconds}초`;
}
updatePlayTimeText();

userNameText.innerHTML = JSON.parse(userName() as string); // 유저 이름 텍스트
// 갱신 함수
function updateUserPokemon() {
  allPokemonText.innerHTML = JSON.parse(
    localStorage.getItem('myPokemon') || '[]',
  ).length.toString(); // 도감(잡은 포켓몬 수) 텍스트
}
updateUserPokemon();
// ED : user-info-text 영역 ------------------

// ST : 뒤로가기에서 업데이트 해야할 동작 ------------------
window.addEventListener('pageshow', event => {
  const navEntry = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined;

  const isBackOrReload = event.persisted || navEntry?.type === 'back_forward';

  if (isBackOrReload) {
    allowMusic(townMusic, true); // 또는 startMusic 등 해당 페이지의 음악
    updateUserPokemon();
    updateUserTitle();
    updateUserBadge();
  }
});
// ED : 뒤로가기에서 업데이트 해야할 동작 ------------------
