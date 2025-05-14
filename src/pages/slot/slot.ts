// 음악을 재생시키는 함수
// 슬롯이 돌아갈때 효과음 나는 함수

// 슬롯 버튼
const slotbtn = document.querySelector<HTMLButtonElement>('#slotBtn');

// 버튼 눌렀을때 변형되는 함수
function btndown(btn: HTMLButtonElement) {
  btn.style.transform = 'translateY(3px) scale(0.98)';
}

// 버튼 눌렀을때 원래 모양으로 돌아오는 변수
function btnup(btn: HTMLButtonElement) {
  btn.style.transform = 'translateY(0px) scale(1)';
}

// 버튼한테 이벤트 부여하는 함수
function btnEvent(btn: HTMLButtonElement) {
  btn.addEventListener('mousedown', e => {
    //마우스 눌렀을때
    e.preventDefault();
    btndown(btn);
    slotBtnMusic.play(); // 버튼효과음재생
  });
  btn.addEventListener('touchstart', e => {
    //손꼬락 으로 눌렀을떄
    e.preventDefault();
    btndown(btn);
    slotBtnMusic.play(); // 버튼효과음재생
  });
  btn.addEventListener('mouseleave', e => {
    //마우스로 꾸욱 눌렀을떄
    e.preventDefault();
    btndown(btn);
  });
  btn.addEventListener('mouseup', e => {
    //마우스 뗐을때
    e.preventDefault();
    btnup(btn);
    /*여기 아래에 버튼 눌럿을때 슬롯 돌아가는 이벤트 및 모션 추가 */
    yourPokemon(1200); // 2초동안 슬롯이 돌아가고, 도감 번호를 뽑는 함수
  });
  btn.addEventListener('touchend', e => {
    //손꼬락 뗐을때
    e.preventDefault();
    btnup(btn);
    /*여기 아래에 버튼 눌럿을때 슬롯 돌아가는 이벤트 및 모션 추가 */
    yourPokemon(1200); // 2초동안 슬롯이 돌아가고, 도감 번호를 뽑는 함수
  });
}

if (slotbtn) {
  btnEvent(slotbtn);
}

/*
슬롯 머신의 로직
1. 버튼을 누른다. (상단 클릭이벤트 만들어 놓음)
2. 랜덤으로 숫자를 뽑는 함수를 호출한다. 해당 함수의 동작 순서는 이렇다.
- 1초간 애니메이션이 작동한다. -> 이거진행 (해당애니메이션은 해당위치의 숫자들이 랜덤으로 값이 마구바구 바뀌는 애니메이션이다.)
- 배열을 생성한다. (1~151, 777, 888이 들어간 배열) -> 이거진행
- 1초의 애니메이션이 종료된뒤, 해당 배열이 어떤 숫자인지 파악한다.
  - 만일 1,10 과 같이 1자릿수 아니면 2자릿수라면 빈칸에 숫자 0을 채워 넣는다.
  - 3자릿수 100이 넘거나, 777,888 과같은 숫자라면 그대로 반환한다.
- 파악한 숫자대로 html에 표현한다. 그리고 해당 숫자를 다시 리턴한다.
*/

// 랜덤으로 1의 자리 숫자 호출
async function randomNumMake() {
  const randomNum = Math.floor(Math.random() * 10);
  return randomNum;
}

/**
 * 시간을 딜레이시키는 함수.
 * @param time 딜레이 되는 시간
 */
async function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

// 0.05초에 한번씩 숫자를 뱉고 해당 노드에 숫자 갈아치우는 함수
async function ranNumAni() {
  await delay(10);
  const arr = []; // 랜덤숫자를 저장하는 배열
  const randomNum1 = await randomNumMake(); // 랜덤숫자 1
  const randomNum2 = await randomNumMake(); // 랜덤숫자 2
  const randomNum3 = await randomNumMake(); // 랜덤숫자 3

  // 배열에 랜덤 숫자 저장
  arr.push(randomNum1);
  arr.push(randomNum2);
  arr.push(randomNum3);

  changeNum(arr); // 슬롯 넘버를 변경하는 함수에 전달
}

// 슬롯 넘버를 변경하는 함수
function changeNum(num: number[]) {
  const slotNum1 = document.querySelectorAll('.slot-num')[0]; // 숫자 첫번째칸
  const slotNum2 = document.querySelectorAll('.slot-num')[1]; // 숫자 두번째칸
  const slotNum3 = document.querySelectorAll('.slot-num')[2]; // 숫자 세번째칸

  slotNum1.innerHTML = num[0].toString(); // 내용갈아 치우기
  slotNum2.innerHTML = num[1].toString(); // 내용갈아 치우기
  slotNum3.innerHTML = num[2].toString(); // 내용갈아 치우기
}

// 슬롯이 돌아갈때 효과음
const slotMusic = new Audio('../../assets/music/slot1.mp3');

// 버튼 눌렀을때 효과음
const slotBtnMusic = new Audio('../../assets/music/btnbgm2.mp3');

// 함수를 1초동안 계속 반복해주는 함수
async function ranNumRepeat(num1: number) {
  await delay(500);
  slotMusic.play(); // 슬롯돌아가는 효과음
  for (let i = 5; i <= num1; i += 5) {
    await ranNumAni();
  }
}

// 도감 번호를 배열로 만드는함수
async function dogamNumMake() {
  const dogamArr = [];
  for (let i = 1; i <= 151; i++) {
    dogamArr.push(i);
  }

  dogamArr.push(777); // 슬비쌤
  dogamArr.push(888); // 용쌤

  const dogamNum = dogamArr[Math.floor(Math.random() * dogamArr.length)];

  return dogamNum;
}
// 도감번호 받았을때 나오는 효과음
const dogamgetMusic = new Audio('../../assets/music/dogamget.mp3');

/*
추출한 도감 번호를 화면에 집어 넣는함수
혹시 추출한 도감번호가 1의자리 수이거나 10의 자리 수일떄는 앞에 0을 넣어줌
 */
async function yourPokemon(num: number) {
  const dogamNum = await dogamNumMake();
  await ranNumRepeat(num);

  if (dogamNum < 10) {
    const arr = [0, 0, dogamNum];
    changeNum(arr);
  } else if (dogamNum <= 99) {
    const dogamNum3 = dogamNum % 10; // 1의자리
    const dogamNum2 = (dogamNum - dogamNum3) / 10; // 10의자리
    const arr = [0, dogamNum2, dogamNum3];
    changeNum(arr);
  } else {
    const dogamNum3 = dogamNum % 10; // 1의자리
    const dogamNum2 = ((dogamNum % 100) - dogamNum3) / 10; // 10의자리
    const dogamNum1 = (dogamNum - dogamNum2 * 10 - dogamNum3) / 100; // 100의자리
    const arr = [dogamNum1, dogamNum2, dogamNum3];
    changeNum(arr);
  }
  console.log(dogamNum);
  dogamgetMusic.play();
  return dogamNum;
}
