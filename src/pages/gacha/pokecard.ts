// pokecard.ts - 카드 표시 관련 기능만 추출

// 필요한 import
// pokecard.ts 파일 상단에 추가
// import { allowMusic } from '../../common/music.ts';
// import { musicPlay } from '../../common/local-storage.ts';
import dogamgetMusicMp3 from '/src/assets/music/dogamget.mp3';
import oneStar from '/src/assets/slot/star1.png';
import twoStar from '/src/assets/slot/star2.png';
import threeStar from '/src/assets/slot/star3.png';
import card777 from '/src/assets/slot/777card.png';
import card888 from '/src/assets/slot/888card.png';
import card50 from '/src/assets/slot/card50.png';
import card54 from '/src/assets/slot/card54.png';
import card104 from '/src/assets/slot/card104.png';
import card111 from '/src/assets/slot/card111.png';
import card137 from '/src/assets/slot/card137.png';
import card147 from '/src/assets/slot/card147.png';
// pokecard.ts 파일 상단에 타입별 배경이미지 import 추가
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

// 미획득 카드 이미지 추가
import card27 from '/src/assets/slot/card27.jpg'; // 추가된 카드
import card28 from '/src/assets/slot/card28.jpg'; // 추가된 카드

// 포켓몬 카드배경 타입 인터페이스 추가
interface cardBackType {
  [key: string]: string;
}

// 타입별 배경 매핑 객체 추가
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

// 미등록 카드 객체 인터페이스 추가
interface specialCard {
  [key: number]: string;
}

// 미등록 카드 매핑 객체 추가
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

// DOM 요소 참조 변수에 추가
let cardBack: HTMLElement | null = null;

// DOM 요소에 애니메이션 관련 요소 추가
let shine: HTMLElement | null = null;
let shine2: HTMLElement | null = null;
let shadow: HTMLElement | null = null;

// API 키 가져오기
const apiKey = import.meta.env.VITE_POKEMONTCG_API_KEY;

// 효과음 초기화
const dogamgetMusic = new Audio(dogamgetMusicMp3);
dogamgetMusic.volume = 0.3;

// 포켓몬 목록 (희귀도별 분류)
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

// DOM 요소 참조 변수 (필요할 때 초기화)
let pokeGetModal: HTMLElement | null = null;
let starBack: HTMLImageElement | null = null;
let pokeName: HTMLElement | null = null;
let pokeCard: HTMLImageElement | null = null;
let cardGetBtn: HTMLElement | null = null;
// let cardContainer: HTMLElement | null = null;

// initCardElements 함수 수정
export function initCardElements() {
  pokeGetModal = document.getElementById('pokeGet');
  cardGetBtn = document.getElementById('cardGetBtn');
  starBack = document.querySelector('#starBack') as HTMLImageElement;
  pokeName = document.querySelector('#pokeName') as HTMLElement;
  pokeCard = document.querySelector('#pokeCard') as HTMLImageElement;
  cardBack = document.querySelector('#cardBack') as HTMLElement; // 카드 배경 요소 추가

  // 효과 요소 초기화
  shine = document.querySelector('.shine') as HTMLElement;
  shine2 = document.querySelector('.shine2') as HTMLElement;
  shadow = document.querySelector('.shadow') as HTMLElement;

  // 효과 요소의 위치 조정 (카드와 일치시키기)
  if (shine && shine2 && shadow && pokeCard) {
    // 효과 요소들의 위치를 카드와 맞추기
    shine.style.top = '46%';
    shine.style.left = '50%';
    shine.style.transform = 'translate(-50%, -50%)';

    shine2.style.top = '46%';
    shine2.style.left = '50%';
    shine2.style.transform = 'translate(-50%, -50%)';

    shadow.style.top = '46%';
    shadow.style.left = '50%';
    shadow.style.transform = 'translate(-50%, -50%)';

    // card-ab 클래스 추가 (공통 포지셔닝)
    shine.classList.add('card-ab');
    shine2.classList.add('card-ab');
    shadow.classList.add('card-ab');
  }

  // 닫기 버튼 이벤트 리스너 추가
  closeGet();
}

// 뽑은 포켓몬 타입 불러오기 함수 추가
async function getPokeType(pokeNum: number) {
  let thisPokeType = '';

  // 특별 케이스 처리
  if (pokeNum === 777) {
    thisPokeType = 'flying';
  } else if (pokeNum === 888) {
    thisPokeType = 'fire';
  } else {
    try {
      const typeData = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokeNum}`,
      );
      const typeDataObj = await typeData.json();

      // 타입이 여러 개인 경우 처리 (normal이 아닌 타입 우선 사용)
      const lastTypeIndex = typeDataObj.types.length - 1;
      const lastType = typeDataObj.types[lastTypeIndex].type.name;
      const realType = typeDataObj.types[0].type.name;

      if (realType === 'normal' && typeDataObj.types.length > 1) {
        thisPokeType = lastType;
      } else {
        thisPokeType = realType;
      }
    } catch (error) {
      console.error('포켓몬 타입 가져오기 오류:', error);
      thisPokeType = 'normal'; // 오류 시 기본 타입
    }
  }

  // 타입 배경 이미지 미리 로드
  if (typeBackObj[thisPokeType]) {
    await preloadImage(typeBackObj[thisPokeType]);
  }

  // 카드 배경 이미지 설정
  if (cardBack) {
    cardBack.style.backgroundImage = `url(${typeBackObj[thisPokeType]})`;
  }

  return thisPokeType;
}

// 딜레이 함수
// async function delay(time: number) {
//   return new Promise(resolve => setTimeout(resolve, time));
// }

// 랜덤 도감 번호 추출
async function dogamNumMake() {
  const dogamArr: number[] = [];

  // 희귀도에 따른 가중치 설정
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

  // 랜덤 도감 번호 선택
  const dogamNum = dogamArr[Math.floor(Math.random() * dogamArr.length)];
  return dogamNum;
}

// 뽑은 포켓몬 번호를 로컬 스토리지에 저장하는 함수
function saveToPokedex(pokeNum: number) {
  // 기존 저장된 포켓몬 번호 목록 불러오기
  const storedPokemon = localStorage.getItem('myPokemon');
  let pokemonList: number[] = [];

  if (storedPokemon) {
    try {
      pokemonList = JSON.parse(storedPokemon);
      // 배열이 아니면 배열로 변환
      if (!Array.isArray(pokemonList)) {
        pokemonList = [Number(pokemonList)];
      }
    } catch (e) {
      console.error('저장된 포켓몬 목록 파싱 오류:', e);
      pokemonList = [];
    }
  }

  // 이미 저장된 번호가 아닐 경우에만 추가
  if (!pokemonList.includes(pokeNum)) {
    pokemonList.push(pokeNum);

    // 로컬 스토리지에 저장
    localStorage.setItem('myPokemon', JSON.stringify(pokemonList));
    console.log(`포켓몬 #${pokeNum} 도감에 추가됨!`);
  } else {
    console.log(`포켓몬 #${pokeNum}는 이미 도감에 있음`);
  }
}

// slot.ts에서 가져온 카드 애니메이션 함수
function setupCardAnimation() {
  if (!pokeCard || !shine || !shine2 || !shadow) {
    console.error('카드 애니메이션에 필요한 DOM 요소가 없습니다');
    return;
  }

  // 기존 이벤트 리스너 제거 (중복 방지)
  pokeCard.removeEventListener('mousemove', handleMouseMove);
  pokeCard.removeEventListener('mouseleave', handleMouseLeave);

  // 새 이벤트 리스너 등록
  pokeCard.addEventListener('mousemove', handleMouseMove);
  pokeCard.addEventListener('mouseleave', handleMouseLeave);

  console.log('카드 애니메이션 설정 완료');
}

// 마우스 이동 핸들러 수정
function handleMouseMove(e: MouseEvent) {
  if (!pokeCard || !shine || !shine2 || !shadow) return;

  const rect = pokeCard.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const rotateY = -(0.090645 * x - 10.16129);
  const rotateX = 0.090645 * y - 10.16129;

  const percentX = (x / rect.width) * 100;
  const percentY = (y / rect.height) * 100;

  const shadowX = -rotateY * 1.5;
  const shadowY = rotateX * 1.5;

  // 그림자 스타일만 수정, 기본 위치 변경 없음
  pokeCard.style.boxShadow = `${shadowX}px ${shadowY}px 20px rgba(0, 0, 0, 0.25)`;

  // 기존 transform 유지하면서 회전만 추가
  const baseTransform = 'translate(-50%, -50%)';
  const rotateTransform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  pokeCard.style.transform = `${baseTransform} ${rotateTransform}`;
  shine.style.transform = `${baseTransform} ${rotateTransform}`;
  shine2.style.transform = `${baseTransform} ${rotateTransform}`;
  shadow.style.transform = `${baseTransform} ${rotateTransform}`;

  shine.style.backgroundPosition = `${percentX}% ${percentY}%`;
  shine2.style.backgroundPosition = `${percentX}% ${percentY}%`;
  shadow.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 255, 255, 0.3) 0%, transparent 40%)`;
}

// 마우스 떠남 핸들러 수정
function handleMouseLeave() {
  if (!pokeCard || !shine || !shine2 || !shadow) return;

  // 기본 transform(translate) 유지
  const baseTransform = 'translate(-50%, -50%)';

  pokeCard.style.transform = baseTransform;
  pokeCard.style.boxShadow = `0px 0px 15px rgba(0, 0, 0, 0.2)`;
  shine.style.transform = baseTransform;
  shine2.style.transform = baseTransform;
  shadow.style.transform = baseTransform;
}

// showPokeCard 함수 수정 - 애니메이션 설정 추가
export async function showPokeCard() {
  console.log('showPokeCard 함수 호출됨');

  // DOM 요소가 초기화되지 않았다면 초기화
  if (!pokeGetModal) {
    initCardElements();
  }

  // DOM 요소가 존재하는지 다시 확인
  if (!pokeGetModal || !starBack || !pokeName || !pokeCard) {
    console.error('카드 표시에 필요한 DOM 요소를 찾을 수 없음');
    return;
  }

  // 랜덤 도감 번호 가져오기
  const dogamNum = await dogamNumMake();
  console.log('선택된 도감 번호:', dogamNum);

  // 포켓몬 번호를 로컬 스토리지에 저장
  saveToPokedex(dogamNum);

  try {
    // 화면 표시 준비
    await Promise.all([
      changePoke(dogamNum),
      starBackChange(dogamNum),
      cardImg(dogamNum),
      getPokeType(dogamNum), // 포켓몬 타입 가져와서 배경 설정
    ]);

    console.log('카드 준비 완료, 모달 표시 시작');

    // 카드 모달 표시
    pokeGetModal.style.display = 'block';
    void pokeGetModal.offsetWidth;
    pokeGetModal.classList.add('active');

    // 음소거 상태 확인 후 효과음 재생
    // if (musicPlay() === 'true') {
    //   console.log('효과음 재생 시작');
    //   allowMusic(dogamgetMusic, false);
    // } else {
    //   console.log('음소거 상태로 효과음 재생 안함');
    // }

    // 카드 애니메이션 설정 호출 추가
    setupCardAnimation();

    console.log('카드 모달 표시 완료');
  } catch (error) {
    console.error('카드 표시 중 오류 발생:', error);
  }
}

// pokecard.ts 파일의 closeGet 함수 수정
function closeGet() {
  if (!cardGetBtn) return;

  console.log('카드 획득 버튼 이벤트 리스너 등록');

  cardGetBtn.addEventListener('click', () => {
    console.log('카드 획득 버튼 클릭됨');

    if (pokeGetModal) {
      // active 클래스 제거
      pokeGetModal.classList.remove('active');

      // 트랜지션 후 d-none 클래스 추가를 위한 타이머 설정
      setTimeout(() => {
        if (pokeGetModal) {
          pokeGetModal.style.display = 'none';
          console.log('포켓몬 카드 모달 숨겨짐');
        }
      }, 500); // CSS 트랜지션 시간에 맞춰 설정
    }

    // 효과음 정지
    dogamgetMusic.pause();
    dogamgetMusic.currentTime = 0;

    // three-test 화면 숨기기
    const threeTest = document.querySelector('.three-test');
    if (threeTest instanceof HTMLElement) {
      threeTest.style.display = 'none';

      // 씬 파괴 이벤트 발생
      const event = new CustomEvent('destroyThreeScene');
      window.dispatchEvent(event);
      console.log('three-test 숨김 및 씬 파괴 이벤트 발생');

      // 배경음악 재시작 이벤트 발생 추가 (여기서 수정) ---
      setTimeout(() => {
        const restartBgmEvent = new CustomEvent('restartBackgroundMusic');
        window.dispatchEvent(restartBgmEvent);
      }, 300);
      // ---
    }
  });
}

// starBackChange 함수 수정
async function starBackChange(dogamNum: number) {
  if (!starBack) return;

  console.log('별 배경 설정 시작:', dogamNum);

  // 원래 src 설정 전에 별 배경 이미지 가시성 확인
  starBack.style.opacity = '1';
  starBack.style.zIndex = '1'; // z-index 확인

  if (pokeList[0].includes(dogamNum)) {
    console.log('1성급 별 배경 설정');
    starBack.src = oneStar;
  } else if (pokeList[1].includes(dogamNum)) {
    console.log('2성급 별 배경 설정');
    starBack.src = twoStar;
  } else if (pokeList[2].includes(dogamNum) || pokeList[3].includes(dogamNum)) {
    console.log('3성급 별 배경 설정');
    starBack.src = threeStar;
  }

  // 이미지 로딩 확인을 위한 프리로드
  await preloadImage(starBack.src);
  console.log('별 배경 이미지 로드 완료:', starBack.src);
}

// 포켓몬 이름 표시
async function changePoke(dogamNum: number) {
  if (!pokeName) return;

  const thisName = await getPokeKorName(dogamNum);
  pokeName.innerHTML = thisName;
}

// 포켓몬 한글 이름 가져오기 함수 수정 - 번호 추가
async function getPokeKorName(pokeNum: number) {
  let thisPokeName = '';

  // 특별 케이스 처리
  if (pokeNum === 777) {
    thisPokeName = '슬비쌤';
    return `No.777 ${thisPokeName}`; // 번호 추가
  } else if (pokeNum === 888) {
    thisPokeName = '용쌤';
    return `No.888 ${thisPokeName}`; // 번호 추가
  } else {
    try {
      const pokeData = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${pokeNum}`,
      );
      const pokeDataObj = await pokeData.json();
      thisPokeName = pokeDataObj.names[2].name;

      // 포켓몬 번호를 3자리로 포맷팅하여 이름 앞에 추가
      return `No.${String(pokeNum).padStart(3, '0')} ${thisPokeName}`;
    } catch (error) {
      console.error('포켓몬 이름 가져오기 오류:', error);
      return `No.${String(pokeNum).padStart(3, '0')} 포켓몬`; // 오류 시 기본값
    }
  }
}

// 카드 이미지 가져오기
async function cardImg(dogamNum: number): Promise<string> {
  let cardUrl = '';
  
  // 스페셜 카드 맵에 있는지 확인 (if-else 체인 대신 객체 사용)
  if (dogamNum in specialCardMap) {
    cardUrl = specialCardMap[dogamNum];
  } else {
    // API 호출 코드는 그대로 유지
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

// 이미지 프리로딩
async function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
}
