const pokeCard = document.querySelector('#pokeCard');

/* ───────────── 전체 카드 객체 ───────────── */
const cardImages = import.meta.glob('/src/assets/slot/cards/*.webp', {
  eager: true,
  import: 'default',
});

const cardMap: Record<number, string> = {};

Object.entries(cardImages).forEach(([path, url]) => {
  const match = path.match(/card(\d+)/);
  if (match) {
    const num = Number(match[1]);
    cardMap[num] = url as string;
  }
});

/* ───────────── 카드이미지 호출 함수 ───────────── */
export function cardImg(dogamNum: number): string {
  const cardUrl = cardMap[dogamNum];

  if (pokeCard instanceof HTMLImageElement) {
    pokeCard.src = cardUrl;
  }

  preloadImage(cardUrl);

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
