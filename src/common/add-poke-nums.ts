/**
 *
 * @param num { number }  로컬스토리지 myPokemon 배열에 추가할 숫자
 * 뽑기, 슬롯에서 나온 번호 아래 함수로 추가하시면 됩니다.
 */
export function addPokeNums(num: number): void {
  const baseNum: number[] = JSON.parse(
    localStorage.getItem('myPokemon') || '[]',
  );

  if (!baseNum.includes(num)) {
    baseNum.push(num);
    baseNum.sort((a, b) => a - b); // 순서대로 정렬
    localStorage.setItem('myPokemon', JSON.stringify(baseNum));
  }
}
