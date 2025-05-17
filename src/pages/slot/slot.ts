
import '../../common/total-time.ts'; // 누적 플레이 타임

import { addPokeNums } from '../../common/add-poke-nums';
// 효과음

import slotMusicMp3 from '/src/assets/music/slotmusic.mp3';
import slotBtnMusicMp3 from '/src/assets/music/btnbgm2.mp3';
import dogamgetMusicMp3 from '/src/assets/music/dogamget.mp3';
// 슬롯이 돌아갈때 효과음
const slotMusic = new Audio(slotMusicMp3);

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

/* ───────────── 오박사 목소리 재생 함수 ───────────── */
async function slotMusicPlay() {
  await delay(500);
  allowMusic(slotMusic, false);
}

/* ───────────── DOM 엘리먼트 정의 ───────────── */
const slotbtn = document.querySelector<HTMLButtonElement>('#slotBtn');

/* ───────────── 로컬스토리지 정의 ───────────── */
const musicPlay = localStorage.getItem('musicPlay');
console.log(musicPlay);

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
  const slotNum1 = document.querySelectorAll('.slot-num')[0]; // 숫자 첫번째칸
  const slotNum2 = document.querySelectorAll('.slot-num')[1]; // 숫자 두번째칸
  const slotNum3 = document.querySelectorAll('.slot-num')[2]; // 숫자 세번째칸

  slotNum1.innerHTML = num[0].toString(); // 내용갈아 치우기
  slotNum2.innerHTML = num[1].toString(); // 내용갈아 치우기
  slotNum3.innerHTML = num[2].toString(); // 내용갈아 치우기
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
  if (musicPlay === 'true') {
    await delay(5000); // 오박사가 "피~ 피카츄~" 할 때 까지 딜레이
  }
  for (let i = 5; i <= num1; i += 5) {
    await ranNumAni();
  }
}

/* ───────────── 도감 번호 랜덤 추출기 ───────────── */
async function dogamNumMake() {
  const dogamArr = [];
  for (let i = 1; i <= 3; i++) {
    for (let k = 1; k <= 143; k++) {
      dogamArr.push(k);
    }
    for (let k = 147; k <= 149; k++) {
      dogamArr.push(k);
    }
  }

  dogamArr.push(144, 145, 146, 777, 888); //특별번호 추가

  const dogamNum = dogamArr[Math.floor(Math.random() * dogamArr.length)];

  return dogamNum;
}

/* ───────────── 최종 도감 번호 슬롯 반영 함수 ───────────── */
async function yourPokemon(num: number) {
  const dogamNum = await dogamNumMake();
  await ranNumRepeat(num);
  /*
  도감 번호를 문자화로 변경 -> 3자리 문자인데 빈공간에 0 삽입 -> 한글자씩 쪼개서 -> 문자로 변환하여 배열로 저장
   */
  const arr: number[] = String(dogamNum).padStart(3, '0').split('').map(Number);
  changeNum(arr); // 도감번호 화면에 반영
  const slotTime = Date.now();
  allowMusic(dogamgetMusic, false);

  localStorage.setItem('todayGet', dogamNum.toString()); // 로컬스토리지에 저장
  localStorage.setItem('lastSlot', slotTime.toString()); // 로컬스토리지에 저장
  allowMusic(casinoMusic, true); // 배경음악 호출
  return dogamNum;
}

/* ───────────── 슬롯 머신 실행함수 ───────────── */
async function slotMachine() {
  const clickBtnTime = Date.now(); //버튼누를때 시간체크
  localStorage.setItem('clickBtnTime', clickBtnTime.toString()); // 로컬스토리지에 저장
  const entryLastSlot = localStorage.getItem('lastSlot');

  if (
    entryLastSlot === null ||
    Number(clickBtnTime) - Number(entryLastSlot) > 24 * 60 * 60 * 1000
  ) {
    await slotMusicPlay(); // 버튼 음악 이후 오박사 목소리 재생
    await yourPokemon(1400); // 2초동안 슬롯이 돌아가고, 도감 번호를 뽑는 함수
  } else {
    await tomorryReturn();
    allowMusic(casinoMusic, true); // 배경음악 호출
  }

  console.log(dogamNum);
  dogamgetMusic.currentTime = 0;
  // dogamgetMusic.play();
  addPokeNums(dogamNum); // 도감 번호 추가
  return dogamNum;
}
/* ───────────── 다시오려무나 팝업창 ───────────── */
async function tomorryReturn() {
  return new Promise<void>(resolve => {
    alert('내일 다시 오려무나~');
    resolve(); // 중요!! 여기서 Promise를 종료시켜야 다음으로 넘어감
  });
}
/* ─────────────
  ▼ canClick 플래그 (로컬스토리지 사용 예정)
  - true: 오늘 뽑기 가능
  - false: 오늘 이미 뽑기 완료
  - 현재는 기본값 true 로 예상
──────────────────────────── */
