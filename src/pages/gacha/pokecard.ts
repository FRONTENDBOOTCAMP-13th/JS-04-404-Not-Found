// pokecard.ts - 카드 표시 관련 기능만 추출

// 필요한 import
// pokecard.ts 파일 상단에 추가
import { allowMusic } from '../../common/music.ts';
import { musicPlay } from '../../common/local-storage.ts';
import dogamgetMusicMp3 from '/src/assets/music/dogamget.mp3';
import oneStar from '/src/assets/slot/star1.png';
import twoStar from '/src/assets/slot/star2.png';
import threeStar from '/src/assets/slot/star3.png';
import card777 from '/src/assets/slot/777card.png';
import card888 from '/src/assets/slot/888card.png';

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

// DOM 요소 초기화 함수
export function initCardElements() {
  pokeGetModal = document.getElementById('pokeGet');
  cardGetBtn = document.getElementById('cardGetBtn');
  starBack = document.querySelector('#starBack') as HTMLImageElement;
  pokeName = document.querySelector('#pokeName') as HTMLElement;
  pokeCard = document.querySelector('#pokeCard') as HTMLImageElement;

  // 닫기 버튼 이벤트 리스너 추가
  closeGet();
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

// showPokeCard 함수 수정
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
  
  // 포켓몬 번호를 로컬 스토리지에 저장 (dictionary.ts와 연동)
  saveToPokedex(dogamNum);
  
  try {
    // 화면 표시 준비
    await Promise.all([
      changePoke(dogamNum),
      starBackChange(dogamNum),
      cardImg(dogamNum)
    ]);
    
    console.log('카드 준비 완료, 모달 표시 시작');
    
    // 카드 모달 표시 방식 변경 (직접 스타일 지정)
    pokeGetModal.style.display = 'block';
    
    // 리플로우 강제 (브라우저 렌더링 갱신)
    void pokeGetModal.offsetWidth;
    
    // active 클래스 추가
    pokeGetModal.classList.add('active');
    
    // 음소거 상태 확인 후 효과음 재생
    if (musicPlay() === 'true') {
      console.log('효과음 재생 시작');
      allowMusic(dogamgetMusic, false);
    } else {
      console.log('음소거 상태로 효과음 재생 안함');
    }
    
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

// 포켓몬 한글 이름 가져오기
async function getPokeKorName(pokeNum: number) {
  let thisPokeName = '';

  if (pokeNum === 777) {
    thisPokeName = '슬비쌤';
  } else if (pokeNum === 888) {
    thisPokeName = '용쌤';
  } else {
    try {
      const pokeData = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${pokeNum}`,
      );
      const pokeDataObj = await pokeData.json();
      thisPokeName = pokeDataObj.names[2].name;
    } catch (error) {
      console.error('포켓몬 이름 가져오기 오류:', error);
      thisPokeName = `No.${pokeNum}`;
    }
  }

  return thisPokeName;
}

// 카드 이미지 가져오기
async function cardImg(dogamNum: number): Promise<string> {
  if (!pokeCard) return '';

  let cardUrl = '';

  // 특별 캐릭터 처리
  if (dogamNum === 777) {
    cardUrl = card777;
  } else if (dogamNum === 888) {
    cardUrl = card888;
  } else {
    try {
      // Pokemon TCG API 호출
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
      const lastVersionIndex = Math.max(0, cardVersion.length - 3);
      const fallbackCard = cardVersion[lastVersionIndex];

      const chosenCard = exCard || fallbackCard;

      if (chosenCard && chosenCard.images?.large) {
        cardUrl = chosenCard.images.large;
      } else {
        console.warn('카드 이미지가 존재하지 않아요!');
        return '';
      }
    } catch (error) {
      console.error('카드 이미지 가져오기 오류:', error);
      return '';
    }
  }

  // 이미지 설정 및 프리로드
  pokeCard.src = cardUrl;
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
