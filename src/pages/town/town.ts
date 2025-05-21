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
import frontRed from '../../assets/town/front.png';
import backRed from '../../assets/town/back.png';
import rightRed from '../../assets/town/right.png';
import leftRed from '../../assets/town/left.png';

// ST: 캐릭터 움직임
const red = document.querySelector('.red-character') as HTMLElement; // 캐릭터 요소
const redH: number = red.clientHeight; // 캐릭터 요소 높이
const redW: number = red.clientWidth; // 캐릭터 요소 너비

const townImg = document.querySelector('.town') as HTMLElement; // 맵 전체 요소
const townH: number = townImg.clientHeight; // 맵 높이
const townW: number = townImg.clientWidth; // 맵 너비

// area 정보 파싱 (원본 좌표 저장)
const areaElements = Array.from(
  document.querySelectorAll('area'),
) as HTMLAreaElement[];
const areaRectsRaw = areaElements
  .map(area => {
    const coords = area.coords.split(',').map(Number);
    // shape이 rect일 때만 처리
    if (area.shape === 'rect' && coords.length === 4) {
      const [x1, y1, x2, y2] = coords;
      return {
        element: area,
        href: area.href,
        id: area.id,
        x1,
        y1,
        x2,
        y2,
      };
    }
    return null;
  })
  .filter(Boolean) as Array<{
  element: HTMLAreaElement;
  href: string;
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}>;

// 이미지맵 원본 크기 (html에서 확인 필요, 예: 980px)
const TOWN_IMG_ORIGINAL_WIDTH: number = 980;
const TOWN_IMG_ORIGINAL_HEIGHT: number = 980;

// red의 중심 좌표 구하기
function getRedCenter() {
  return {
    x: currentLeft + redW / 2,
    y: currentTop + redH / 2,
  };
}

// red가 area와 겹치는지 체크 (동적으로 좌표 변환)
function checkAreaCollision() {
  const { x, y } = getRedCenter();
  // 실제 이미지 크기
  const img = document.querySelector('.town-img') as HTMLImageElement;
  const scaleX: number = img.width / TOWN_IMG_ORIGINAL_WIDTH;
  const scaleY: number = img.height / TOWN_IMG_ORIGINAL_HEIGHT;

  for (const area of areaRectsRaw) {
    // 현재 이미지 크기에 맞게 좌표 변환
    const left: number = Math.min(area.x1, area.x2) * scaleX + img.offsetLeft;
    const right: number = Math.max(area.x1, area.x2) * scaleX + img.offsetLeft;
    const top: number = Math.min(area.y1, area.y2) * scaleY + img.offsetTop;
    const bottom: number = Math.max(area.y1, area.y2) * scaleY + img.offsetTop;
    if (x >= left && x <= right && y >= top && y <= bottom) {
      // userInfo 영역이면 모달 오픈
      if (area.id === 'userInfo' || (area.href && area.href.endsWith('#'))) {
        if (userInfoModal && userInfoModal.classList.contains('d-none')) {
          openModal(userInfoModal);
        }
        return true;
      }
      // 그 외에는 페이지 이동
      if (area.href && !area.href.endsWith('#')) {
        window.location.href = area.href;
        return true;
      }
    }
  }
  return false;
}

let currentDirection: string = ''; // 현재 방향 상태 저장
let currentTop: number = parseInt(getComputedStyle(red).top, 10); // 위에서부터의 현재 위치
let currentLeft: number = parseInt(getComputedStyle(red).left, 10); // 왼쪽에서부터의 현재 위치

const moveAmount: number = townH / 98; // 이동시킬 픽셀 단위
const prevTop: number = currentTop;
const prevLeft: number = currentLeft;

window.addEventListener('keydown', e => {
  // 이동 전 위치 저장
  switch (e.key) {
    case 'ArrowUp':
      if (currentDirection !== 'up') {
        red.style.background = `url(${backRed}) no-repeat center / cover`;
        currentDirection = 'up';
      }
      if (currentTop <= redH / 2) return;
      currentTop -= moveAmount;
      red.style.top = `${currentTop}px`;
      // area 충돌 시 이동 취소
      if (checkAreaCollision()) {
        currentTop = prevTop;
        red.style.top = `${currentTop}px`;
      }
      break;

    case 'ArrowDown':
      if (currentDirection !== 'down') {
        red.style.background = `url(${frontRed}) no-repeat center / cover`;
        currentDirection = 'down';
      }
      if (townH - currentTop <= redH / 2) return;
      currentTop += moveAmount;
      red.style.top = `${currentTop}px`;
      if (checkAreaCollision()) {
        currentTop = prevTop;
        red.style.top = `${currentTop}px`;
      }
      break;

    case 'ArrowRight':
      if (currentDirection !== 'right') {
        red.style.background = `url(${rightRed}) no-repeat center / cover`;
        currentDirection = 'right';
      }
      if (townW - currentLeft <= redW / 2) return;
      currentLeft += moveAmount;
      red.style.left = `${currentLeft}px`;
      if (checkAreaCollision()) {
        currentLeft = prevLeft;
        red.style.left = `${currentLeft}px`;
      }
      break;

    case 'ArrowLeft':
      if (currentDirection !== 'left') {
        red.style.background = `url(${leftRed}) no-repeat center / cover`;
        currentDirection = 'left';
      }
      if (currentLeft <= redW / 2) return;
      currentLeft -= moveAmount;
      red.style.left = `${currentLeft}px`;
      if (checkAreaCollision()) {
        currentLeft = prevLeft;
        red.style.left = `${currentLeft}px`;
      }
      break;
  }
});

// 모바일 버튼
const moLeft = document.querySelector('.left-arrow') as HTMLElement;
const moRight = document.querySelector('.right-arrow') as HTMLElement;
const moUp = document.querySelector('.up-arrow') as HTMLElement;
const moDown = document.querySelector('.down-arrow') as HTMLElement;

function moveRed(direction: 'up' | 'down' | 'left' | 'right') {
  switch (direction) {
    case 'up':
      if (currentDirection !== 'up') {
        red.style.background = `url(${backRed}) no-repeat center / cover`;
        currentDirection = 'up';
      }
      if (currentTop <= redH / 2) return;
      currentTop -= moveAmount;
      red.style.top = `${currentTop}px`;
      if (checkAreaCollision()) {
        currentTop += moveAmount;
        red.style.top = `${currentTop}px`;
      }
      break;
    case 'down':
      if (currentDirection !== 'down') {
        red.style.background = `url(${frontRed}) no-repeat center / cover`;
        currentDirection = 'down';
      }
      if (townH - currentTop <= redH / 2) return;
      currentTop += moveAmount;
      red.style.top = `${currentTop}px`;
      if (checkAreaCollision()) {
        currentTop -= moveAmount;
        red.style.top = `${currentTop}px`;
      }
      break;
    case 'right':
      if (currentDirection !== 'right') {
        red.style.background = `url(${rightRed}) no-repeat center / cover`;
        currentDirection = 'right';
      }
      if (townW - currentLeft <= redW / 2) return;
      currentLeft += moveAmount;
      red.style.left = `${currentLeft}px`;
      if (checkAreaCollision()) {
        currentLeft -= moveAmount;
        red.style.left = `${currentLeft}px`;
      }
      break;
    case 'left':
      if (currentDirection !== 'left') {
        red.style.background = `url(${leftRed}) no-repeat center / cover`;
        currentDirection = 'left';
      }
      if (currentLeft <= redW / 2) return;
      currentLeft -= moveAmount;
      red.style.left = `${currentLeft}px`;
      if (checkAreaCollision()) {
        currentLeft += moveAmount;
        red.style.left = `${currentLeft}px`;
      }
      break;
  }
}

// ** 모바일 움직임 **
// 반복 이동을 위한 interval id
let moveInterval: number | null = null;
const MOVE_INTERVAL_MS: number = 50; // 반복 이동 간격(ms)
function startMove(direction: 'up' | 'down' | 'left' | 'right') {
  if (moveInterval !== null) return;
  moveRed(direction); // 최초 1회 이동
  moveInterval = window.setInterval(() => moveRed(direction), MOVE_INTERVAL_MS);
}
function stopMove() {
  if (moveInterval !== null) {
    clearInterval(moveInterval);
    moveInterval = null;
  }
}

moUp.addEventListener('touchstart', e => {
  e.preventDefault();
  startMove('up');
});
moUp.addEventListener('touchend', stopMove);

moDown.addEventListener('touchstart', e => {
  e.preventDefault();
  startMove('down');
});
moDown.addEventListener('touchend', stopMove);

moLeft.addEventListener('touchstart', e => {
  e.preventDefault();
  startMove('left');
});
moLeft.addEventListener('touchend', stopMove);

moRight.addEventListener('touchstart', e => {
  e.preventDefault();
  startMove('right');
});
moRight.addEventListener('touchend', stopMove);

// ED: 캐릭터 움직임

// 페이지가 이동될 때 userInfoModal 닫기
window.addEventListener('beforeunload', () => {
  userInfoModal?.classList.add('d-none');
});

// town-music 오디오 객체 생성 및 음악 재생
const townMusic: HTMLAudioElement = new Audio(townMusicSrc);
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
