const apiKey = import.meta.env.VITE_POKEMONTCG_API_KEY; // 카드 api불러오기
const pokeCard = document.querySelector('#pokeCard');

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

/* ───────────── 카드이미지 호출 함수 ───────────── */
export async function cardImg(dogamNum: number): Promise<string> {
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
