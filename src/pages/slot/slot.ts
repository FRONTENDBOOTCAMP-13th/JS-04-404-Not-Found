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
import soundOn from '/src/assets/common/sound-on.png'; // sound-on 이미지
import soundOff from '/src/assets/common/sound-off.png'; // sound-off 이미지
import oneStar from '/src/assets/slot/star1.png';
import twoStar from '/src/assets/slot/star2.png';
import threeStar from '/src/assets/slot/star3.png';
// 미획득 카드 모음
import card777 from '/src/assets/slot/777card.png';
import card888 from '/src/assets/slot/888card.png';
import card50 from '/src/assets/slot/card50.png';
import card54 from '/src/assets/slot/card54.png';
import card104 from '/src/assets/slot/card104.png';
import card111 from '/src/assets/slot/card111.png';
import card137 from '/src/assets/slot/card137.png';
import card147 from '/src/assets/slot/card147.png';
import card27 from '/src/assets/slot/card27.jpg';
import card28 from '/src/assets/slot/card28.jpg';
// 타입별 배경이미지
import bugImg from '/src/assets/slot/typeback/bug.png';
import darkImg from '/src/assets/slot/typeback/dark.png';
import dragonImg from '/src/assets/slot/typeback/dragon.png';
import electricImg from '/src/assets/slot/typeback/electric.png';
import fairyImg from '/src/assets/slot/typeback/fairy.png';
import fightingImg from '/src/assets/slot/typeback/fighting.png';
import flyingImg from '/src/assets/slot/typeback/flying.png';
import ghostImg from '/src/assets/slot/typeback/ghost.png';
import grassImg from '/src/assets/slot/typeback/grass.png';
import groundImg from '/src/assets/slot/typeback/ground.png';
import iceImg from '/src/assets/slot/typeback/ice.png';
import normalImg from '/src/assets/slot/typeback/normal.png';
import poisonImg from '/src/assets/slot/typeback/poison.png';
import psychicImg from '/src/assets/slot/typeback/psychic.png';
import rockImg from '/src/assets/slot/typeback/rock.png';
import steelImg from '/src/assets/slot/typeback/steel.png';
import waterImg from '/src/assets/slot/typeback/water.png';
import fireImg from '/src/assets/slot/typeback/fire.png';

const apiKey = import.meta.env.VITE_POKEMONTCG_API_KEY; // 카드 api불러오기

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
  // [888],
  // [888],
  // [888],
  // [888],
];
/* ───────────── 포켓몬 카드배경 객체 ───────────── */
interface cardBackType {
  [key: string]: string;
}

const typeBackObj: cardBackType = {
  bug: bugImg,
  dark: darkImg,
  dragon: dragonImg,
  electric: electricImg,
  fairy: fairyImg,
  fighting: fightingImg,
  flying: flyingImg,
  ghost: ghostImg,
  grass: grassImg,
  ground: groundImg,
  ice: iceImg,
  normal: normalImg,
  poison: poisonImg,
  psychic: psychicImg,
  rock: rockImg,
  steel: steelImg,
  fire: fireImg,
  water: waterImg,
};
/* ───────────── 미등록 카드 객체 ───────────── */
interface specialCard {
  [key: number]: string;
}
const specialCardMap: specialCard = {
  777: card777,
  888: card888,
  50: card50,
  54: card54,
  104: card104,
  111: card111,
  137: card137,
  147: card147,
  27: card27,
  28: card28,
};

/* ───────────── DOM 엘리먼트 정의 ───────────── */
const slotbtn = document.querySelector<HTMLButtonElement>('#slotBtn'); // 슬롯 머신 버튼
const slotNum = document.querySelectorAll('.slot-num'); // 슬롯머신 숫자 모든 li
const pokeGetModal = document.getElementById('pokeGet');
const cardGetBtn = document.getElementById('cardGetBtn'); //카드 획득하기 버튼
const starBack = document.querySelector('#starBack'); // 포켓몬 카드배경
const pokeName = document.querySelector('#pokeName'); // 포켓몬 카드이름
const pokeCard = document.querySelector('#pokeCard');
const mSlotBtn = document.querySelector<HTMLButtonElement>('#MslotBtn'); // 모바일버튼
const cardBack = document.querySelector<HTMLButtonElement>('#cardBack'); // 카드배경이미지

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
  toggleSound(casinoMusic);
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
if (mSlotBtn) {
  btnEvent(mSlotBtn);
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
/* ───────────── 최종 도감 번호 슬롯 반영 함수 ───────────── */
async function yourPokemon(num: number) {
  const dogamNum = await dogamNumMake();
  const preLoadImg = cardImg(dogamNum);
  await ranNumRepeat(num);
  /*
  도감 번호를 문자화로 변경 -> 3자리 문자인데 빈공간에 0 삽입 -> 한글자씩 쪼개서 -> 문자로 변환하여 배열로 저장
   */
  const arr: number[] = String(dogamNum).padStart(3, '0').split('').map(Number);

  const slotTime = Date.now();
  localStorage.setItem('lastSlot', slotTime.toString()); // 로컬스토리지에 저장
  changeNum(arr);
  await preLoadImg;
  return dogamNum;
}

/* ───────────── 슬롯 머신 실행함수 ───────────── */
async function slotMachine() {
  const clickBtnTime = Date.now(); //버튼누를때 시간체크
  const entryLastSlot = localStorage.getItem('lastSlot');
  if (slotbtn !== null && mSlotBtn !== null) {
    btnNoneClick(slotbtn);
    btnNoneClick(mSlotBtn);
  }

  if (
    entryLastSlot === null ||
    Number(clickBtnTime) - Number(entryLastSlot) > 24 * 60 * 60 * 1000
  ) {
    await slotMusicPlay(); // 버튼 음악 이후 오박사 목소리 재생
    const dogamNum = await yourPokemon(1200); // 2초동안 슬롯이 돌아가고, 도감 번호를 뽑는 함수
    openGet(dogamNum);
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
    if (slotbtn !== null && mSlotBtn !== null) {
      btnCanClick(slotbtn);
      btnCanClick(mSlotBtn);
    }
  });
}
/* ───────────── 포켓몬 get 화면 띄우기 ───────────── */
async function openGet(dogamNum: number) {
  await delay(1000);
  await Promise.all([changePoke(dogamNum), starBackChange(dogamNum)]);
  if (pokeGetModal !== null) {
    await pokeGetModal.classList.remove('d-none');
    void pokeGetModal.offsetWidth;
    await pokeGetModal.classList.add('active');
  }
  allowMusic(dogamgetMusic, false);
}
/* ───────────── 포켓몬 get 배경 별 셋팅하는 함수 ───────────── */
async function starBackChange(dogamNum: number) {
  if (starBack instanceof HTMLImageElement) {
    if (pokeList[0].includes(dogamNum)) {
      starBack.src = oneStar;
    } else if (pokeList[1].includes(dogamNum)) {
      starBack.src = twoStar;
    } else if (
      pokeList[2].includes(dogamNum) ||
      pokeList[3].includes(dogamNum)
    ) {
      starBack.src = threeStar;
    }
  }
}
/* ───────────── 뽑은 포켓몬 한글이름 출력하기 ───────────── */
async function changePoke(dogamNum: number) {
  const thisName = await getPokeKorName(dogamNum);
  if (pokeName !== null) {
    pokeName.innerHTML = thisName;
  }
}
/* ───────────── 뽑은 포켓몬 한글이름 불러오기 ───────────── */
async function getPokeKorName(pokeNum: number) {
  let thisPokeName = '';
  if (pokeNum === 777) {
    thisPokeName = '슬비쌤';
  } else if (pokeNum === 888) {
    thisPokeName = '용쌤';
  } else {
    const pokeData = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokeNum}`,
    );
    const pokeDataObj = await pokeData.json();
    thisPokeName = pokeDataObj.names[2].name;
  }
  getPokeType(pokeNum);

  return thisPokeName;
}

/* ───────────── 뽑은 포켓몬 타입불러오기 ───────────── */
async function getPokeType(pokeNum: number) {
  let thisPokeType = '';
  if (pokeNum === 777) {
    thisPokeType = 'flying';
  } else if (pokeNum === 888) {
    thisPokeType = 'fire';
  } else {
    const typeData = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokeNum}`,
    );
    const typeDataObj = await typeData.json();
    thisPokeType = typeDataObj.types[0].type.name;
    const lastTypeIndex = typeDataObj.types.length - 1;
    const lastType = typeDataObj.types[lastTypeIndex].type.name;
    const realType = typeDataObj.types[0].type.name;
    console.log(lastType);
    console.log(realType);
    if (realType === 'normal') {
      thisPokeType = lastType;
    } else {
      thisPokeType = realType;
    }
  }
  if (cardBack) {
    cardBack.style.backgroundImage = `url(${typeBackObj[thisPokeType]})`;
  }
  return thisPokeType;
}

/* ───────────── 포켓몬 get 화면 닫기버튼 ───────────── */
function closeGet() {
  cardGetBtn?.addEventListener('click', () => {
    pokeGetModal?.classList.add('d-none');
    pokeGetModal?.classList.remove('active');
    allowMusic(casinoMusic, true); // 배경음악 호출
    if (slotbtn !== null && mSlotBtn !== null) {
      btnCanClick(slotbtn);
      btnCanClick(mSlotBtn);
    }
    dogamgetMusic.pause();
  });
}

/* ───────────── 카드이미지 호출 함수 ───────────── */
async function cardImg(dogamNum: number): Promise<string> {
  let cardUrl = '';
  if (dogamNum in specialCardMap) {
    // 스페셜 카드에 포함된 경우(미등록카드) 여기서 찾고 아니면 else로 이동
    cardUrl = specialCardMap[dogamNum];
  } else {
    const imgUrl = `https://api.pokemontcg.io/v2/cards?q=nationalPokedexNumbers:${dogamNum}`;
    const res = await fetch(imgUrl, {
      headers: {
        'X-Api-Key': apiKey,
      },
    });

    const data = await res.json();
    interface TCGCard {
      rarity?: string;
      images?: {
        large?: string;
      };
    }

    const cardVersion: TCGCard[] = data.data;

    // 1. EX 카드 우선 찾기
    const exCard = cardVersion.find(card =>
      card.rarity?.toLowerCase().includes('ex'),
    );

    // 2. 없으면 fallback으로 뒤에서 세 번째 카드 사용
    const lastVersionIndex = Math.max(cardVersion.length - 4, 0);
    // const lastVersionIndex = 3;
    const fallbackCard = cardVersion[lastVersionIndex];

    const chosenCard = exCard || fallbackCard;

    if (chosenCard && chosenCard.images?.large) {
      cardUrl = chosenCard.images.large;
    } else {
      console.warn('카드 이미지가 존재하지 않아요 껑!');
      return '';
    }
  }
  if (pokeCard instanceof HTMLImageElement) {
    pokeCard.src = cardUrl;
  }

  await preloadImage(cardUrl);
  return cardUrl;
}

/* ───────────── 프리로드 함수 ───────────── */
async function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(); // 이미지 로딩 완료
    img.onerror = reject; // 에러나면 거절
    img.src = url; // 다운로드 시작
  });
}

closeGet();

/* ───────────── 클릭 막는 함수 ───────────── */
function btnNoneClick(btn: HTMLButtonElement) {
  btn.disabled = true;
  btn.style.pointerEvents = 'none';
}
function btnCanClick(btn: HTMLButtonElement) {
  btn.disabled = false;
  btn.style.pointerEvents = 'auto';
}

/* ───────────── 카드 움직이는 함수 ───────────── */
const shine = document.querySelector('.shine');
const shine2 = document.querySelector('.shine2');
const shadow = document.querySelector('.shadow');
function cardanimation() {
  if (
    pokeCard instanceof HTMLElement &&
    shine instanceof HTMLElement &&
    shadow instanceof HTMLElement &&
    shine2 instanceof HTMLElement
  ) {
    pokeCard?.addEventListener('mousemove', e => {
      const rect = pokeCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = -(0.090645 * x - 10.16129);
      const rotateX = 0.090645 * y - 10.16129;

      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;

      const shadowX = -rotateY * 1.5; // 가로 그림자 (Y축 회전과 반대)
      const shadowY = rotateX * 1.5; // 세로 그림자 (X축 회전과 같은 방향)

      pokeCard.style.boxShadow = `${shadowX}px ${shadowY}px 20px rgba(0, 0, 0, 0.25)`;

      const transformStyle = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      pokeCard.style.transform = transformStyle;
      shine.style.transform = transformStyle;
      shine2.style.transform = transformStyle;
      shadow.style.transform = transformStyle;

      shine.style.backgroundPosition = `${percentX}% ${percentY}%`;
      shine2.style.backgroundPosition = `${percentX}% ${percentY}%`;
      shadow.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 255, 255, 0.3) 0%, transparent 40%)`;
    });

    pokeCard.addEventListener('mouseleave', () => {
      pokeCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
      pokeCard.style.boxShadow = `0px 0px 15px rgba(0, 0, 0, 0.2)`;
      shine.style.transform = `rotateX(0deg) rotateY(0deg)`;
      shine2.style.transform = `rotateX(0deg) rotateY(0deg)`;
      shadow.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });
  }
}
cardanimation();
