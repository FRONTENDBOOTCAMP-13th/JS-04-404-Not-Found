/*
──────────── 슬롯 머신 로직 ────────────

📌 [트리거] : 버튼 클릭 (오늘 뽑기 진행)
  ├─ 효과음 재생 (버튼 누르는 소리)
  ├─ 배경음악 중지 (casinoMusic.pause())
  └─ 로컬스토리지에서 '오늘 이미 뽑았는지' 체크
      └─ 안 뽑았으면 진행되는 로직:
          ├─ 오박사 목소리 재생 (slotMusicPlay)
          ├─ 오박사 대사가 "피 피카츄~" 까지 딜레이
          ├─ 슬롯 머신 숫자 롤링 시작 (숫자 빠르게 변경하는 애니메이션)
          ├─ 실제 도감 번호 추출 & 화면 반영
          ├─ 도감 번호를 로컬스토리지에 저장
          ├─ 포켓몬 뽑기 팝업 & 효과음 재생
          └─ 이벤트 종료 후 배경음악 재생 재개

📌 [트리거] : 버튼 클릭 (오늘 이미 뽑기 완료)
  ├─ 효과음 재생 (버튼 누르는 소리)
  ├─ 배경음악 중지 (casinoMusic.pause())
  └─ "다음에 오려무나~" alert 창 띄우기
  
───────────────────────────────
*/

/* ───────────── 외부 함수 및 음원 import ───────────── */
import '../../common/total-time.ts'; // 누적 플레이 타임
import { addPokeNums } from '../../common/add-poke-nums';
import { toggleSound } from '../../common/toggle-sound.ts'; // 음악 켜기 / 끄기 기능
import { musicPlay } from '../../common/local-storage.ts'; // 현재 로컬스토리지의 음소거 상태
import { allowMusic } from '../../common/music.ts'; // 효과음 함수
import slotMusicMp3 from '/src/assets/music/slotmusic.mp3'; //오박사 목소리 배경음악
import slotBtnMusicMp3 from '/src/assets/music/btnbgm2.mp3'; // 슬롯 버튼 배경음악
import dogamgetMusicMp3 from '/src/assets/music/dogamget.mp3'; // 도감 포켓몬 뽑은뒤 배경음악
import casinoMp3 from '/src/assets/music/casino.mp3'; // 카지노 배경음악

/* ───────────── 효과음 & 배경음악 초기화 ───────────── */
const slotMusic = new Audio(slotMusicMp3); // 슬롯이 돌아갈때 효과음
const slotBtnMusic = new Audio(slotBtnMusicMp3); // 버튼 눌렀을때 효과음
const dogamgetMusic = new Audio(dogamgetMusicMp3); // 도감번호 받았을때 나오는 효과음
dogamgetMusic.volume = 0.3; // 해당음원 Sound 볼륨 조절

const casinoMusic = new Audio(casinoMp3); // 전체배경 효과음
casinoMusic.volume = 0.3; // 해당음원 Sound 볼륨 조절
allowMusic(casinoMusic, true); // 배경음악 호출

const pokeList: number[][] = [
  [
    1, 4, 7, 10, 13, 16, 19, 21, 23, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48, 50,
    52, 54, 56, 58, 60, 63, 66, 69, 72, 74, 77, 79, 81, 84, 86, 88, 90, 92, 96,
    98, 100, 102, 104, 109, 114, 116, 118, 120, 129, 133, 140, 147,
  ],
  [
    2, 5, 8, 11, 14, 17, 20, 24, 25, 28, 30, 33, 36, 40, 42, 44, 47, 49, 53, 55,
    61, 64, 67, 70, 75, 80, 82, 83, 85, 87, 89, 93, 95, 99, 101, 103, 105, 106,
    107, 108, 110, 111, 117, 119, 121, 122, 123, 124, 125, 126, 127, 128, 134,
    135, 136, 138, 141, 142, 148,
  ],
  [
    3, 6, 9, 12, 15, 18, 22, 26, 31, 34, 38, 45, 51, 57, 59, 62, 65, 68, 71, 73,
    76, 78, 91, 94, 97, 112, 113, 115, 130, 131, 132, 137, 139, 143, 149,
  ],
  [144, 145, 146, 150, 151, 777, 888],
];

// ST : 뒤로가기, 음소거 버튼 ------------------
const backBtn = document.querySelector('.back-btn') as HTMLElement;
const toggleSoundBtn = document.querySelector('.toggle-sound') as HTMLElement;
const toggleSoundText = document.querySelector(
  '.toggle-sound > span',
) as HTMLElement;

// 버튼 및 span의 텍스트 초기화
if (musicPlay() === 'true') {
  toggleSoundBtn.style.backgroundImage = `url('/src/assets/common/sound-on.png')`;
  toggleSoundText.innerHTML = '전체 소리 끄기 버튼';
} else {
  toggleSoundBtn.style.backgroundImage = `url('/src/assets/common/sound-off.png')`;
  toggleSoundText.innerHTML = '전체 소리 켜기 버튼';
}

// 뒤로가기
backBtn.addEventListener('click', () => {
  window.history.back();
});

// 음소거/재생
toggleSoundBtn.addEventListener('click', () => {
  const soundState: string | null = musicPlay();
  toggleSound(casinoMusic);
  if (soundState === 'true') {
    toggleSoundBtn.style.backgroundImage = `url('/src/assets/common/sound-off.png')`;
    toggleSoundText.innerHTML = '전체 소리 켜기 버튼';
  } else {
    toggleSoundBtn.style.backgroundImage = `url('/src/assets/common/sound-on.png')`;
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

/* ───────────── DOM 엘리먼트 정의 ───────────── */
const slotbtn = document.querySelector<HTMLButtonElement>('#slotBtn'); // 슬롯 머신 버튼
const slotNum = document.querySelectorAll('.slot-num'); // 슬롯머신 숫자 모든 li
const pokeGetModal = document.getElementById('pokeGet');
const cardGetBtn = document.getElementById('cardGetBtn'); //카드 획득하기 버튼

/* ───────────── 로컬스토리지 정의 ───────────── */
// const slotPlay = localStorage.getItem('musicPlay');
// console.log(musicPlay);

/* ───────────── 오박사 목소리 재생 함수 ───────────── */
async function slotMusicPlay() {
  await delay(500);
  allowMusic(slotMusic, false);
}

/* ───────────── 버튼 애니메이션 효과 함수 ───────────── */
function btndown(btn: HTMLButtonElement) {
  btn.style.transform = 'translateY(3px) scale(0.98)';
}

// 버튼 눌렀을때 원래 모양으로 돌아오는 변수
function btnup(btn: HTMLButtonElement) {
  btn.style.transform = 'translateY(0px) scale(1)';
}

/* ───────────── 슬롯 버튼 이벤트 바인딩 ───────────── */
function btnEvent(btn: HTMLButtonElement) {
  btn.addEventListener('mousedown', e => {
    //마우스 눌렀을때
    e.preventDefault();
    btndown(btn);
    allowMusic(slotBtnMusic, false); // 버튼 눌렀을때 나오는음악
    casinoMusic.pause(); //배경음악 일시정지
  });
  btn.addEventListener('touchstart', e => {
    //손꼬락 으로 눌렀을떄
    e.preventDefault();
    btndown(btn);
    allowMusic(slotBtnMusic, false); // 버튼 눌렀을때 나오는음악
    casinoMusic.pause(); //배경음악 일시정지
  });
  btn.addEventListener('mouseleave', e => {
    //마우스로 꾸욱 눌렀을떄
    e.preventDefault();
    btnup(btn);
  });
  btn.addEventListener('mouseup', e => {
    //마우스 뗐을때
    e.preventDefault();
    btnup(btn);
    /*여기 아래에 버튼 눌럿을때 슬롯 돌아가는 이벤트 및 모션 추가 */
    slotMachine(); // 슬롯머신 기능
  });
  btn.addEventListener('touchend', e => {
    //손꼬락 뗐을때
    e.preventDefault();
    btnup(btn);
    /*여기 아래에 버튼 눌럿을때 슬롯 돌아가는 이벤트 및 모션 추가 */
    slotMachine(); // 슬롯머신 기능
  });
}

/* ───────────── 버튼 이벤트 등록 ───────────── */
if (slotbtn) {
  btnEvent(slotbtn);
}

/* ───────────── 랜덤 숫자 생성기 ───────────── */
async function randomNumMake() {
  const randomNum = Math.floor(Math.random() * 10);
  return randomNum;
}

/* ───────────── 딜레이 함수 ───────────── */
async function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

/* ───────────── 슬롯 숫자 DOM 업데이트 함수 ───────────── */
function changeNum(num: number[]) {
  for (let i = 0; i < slotNum.length; i++) {
    // 각 li에 배열에든 3개의 숫자 순서대로 넣기
    slotNum[i].innerHTML = num[i].toString();
  }
}

/* ───────────── 슬롯 숫자 애니메이션 (랜덤 숫자 변경) ───────────── */
async function ranNumAni() {
  await delay(10); // 버튼 효과음이 끝날때 까지 딜레이
  const arr = [
    await randomNumMake(),
    await randomNumMake(),
    await randomNumMake(),
  ];

  changeNum(arr); // 슬롯 넘버를 변경하는 함수에 전달
}

/* ───────────── 슬롯 숫자 롤링 반복 함수 ───────────── */
async function ranNumRepeat(num1: number) {
  if (musicPlay() === 'true') {
    await delay(5000); // 오박사가 "피~ 피카츄~" 할 때 까지 딜레이
  }
  for (let i = 5; i <= num1; i += 5) {
    await ranNumAni();
  }
}

/* ───────────── 도감 번호 랜덤 추출기 ───────────── */
async function dogamNumMake() {
  const dogamArr: number[] = [];
  for (let i = 1; i <= 4; i++) {
    pokeList[0].forEach(a => {
      dogamArr.push(a);
    });
  }
  for (let i = 1; i <= 3; i++) {
    pokeList[1].forEach(a => {
      dogamArr.push(a);
    });
  }
  for (let i = 1; i <= 2; i++) {
    pokeList[2].forEach(a => {
      dogamArr.push(a);
    });
  }

  pokeList[3].forEach(a => {
    dogamArr.push(a);
  });

  const dogamNum = dogamArr[Math.floor(Math.random() * dogamArr.length)];
  addPokeNums(dogamNum); // 도감 번호 추가
  return dogamNum;
}
console.log('pokeList:', pokeList);
console.log('pokeList[0]:', pokeList[0]);
/* ───────────── 최종 도감 번호 슬롯 반영 함수 ───────────── */
async function yourPokemon(num: number) {
  const dogamNum = await dogamNumMake();
  await ranNumRepeat(num);
  /*
  도감 번호를 문자화로 변경 -> 3자리 문자인데 빈공간에 0 삽입 -> 한글자씩 쪼개서 -> 문자로 변환하여 배열로 저장
   */
  const arr: number[] = String(dogamNum).padStart(3, '0').split('').map(Number);
  // changeNum(arr); // 도감번호 화면에 반영
  const slotTime = Date.now();

  localStorage.setItem('lastSlot', slotTime.toString()); // 로컬스토리지에 저장

  return changeNum(arr);
}

/* ───────────── 슬롯 머신 실행함수 ───────────── */
async function slotMachine() {
  const clickBtnTime = Date.now(); //버튼누를때 시간체크
  const entryLastSlot = localStorage.getItem('lastSlot');

  if (
    entryLastSlot === null ||
    Number(clickBtnTime) - Number(entryLastSlot) > 24 * 60 * 60 * 1000
  ) {
    await slotMusicPlay(); // 버튼 음악 이후 오박사 목소리 재생
    await yourPokemon(1200); // 2초동안 슬롯이 돌아가고, 도감 번호를 뽑는 함수
    openGet();
  } else {
    await tomorryReturn();
    allowMusic(casinoMusic, true); // 배경음악 호출
  }
}
/* ───────────── 다시오려무나 팝업창 ───────────── */
async function tomorryReturn() {
  return new Promise<void>(resolve => {
    alert('내일 다시 오려무나~');
    resolve();
  });
}
/* ───────────── 포켓몬 get 화면 띄우기 ───────────── */
async function openGet() {
  await delay(1000);
  if (pokeGetModal !== null) {
    await pokeGetModal.classList.remove('d-none');
    void pokeGetModal.offsetWidth;
    await pokeGetModal.classList.add('active');
  }

  allowMusic(dogamgetMusic, false);
}
/* ───────────── 포켓몬 get 화면 닫기버튼 ───────────── */
function closeGet() {
  cardGetBtn?.addEventListener('click', () => {
    pokeGetModal?.classList.add('d-none');
    pokeGetModal?.classList.remove('active');
    allowMusic(casinoMusic, true); // 배경음악 호출
  });
}
closeGet();
