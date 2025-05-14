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
  });
  btn.addEventListener('touchstart', e => {
    //손꼬락 으로 눌렀을떄
    e.preventDefault();
    btndown(btn);
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
    ranNumRepeat(2000);
  });
  btn.addEventListener('touchend', e => {
    //손꼬락 뗐을때
    e.preventDefault();
    btnup(btn);
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

// 0.05초에 한번씩 숫자를 뱉는 함수
async function ranNumAni(num: number) {
  await delay(num);
  const randomNum1 = await randomNumMake(); // 랜덤숫자 1
  const randomNum2 = await randomNumMake(); // 랜덤숫자 2
  const randomNum3 = await randomNumMake(); // 랜덤숫자 3

  const slotNum1 = document.querySelectorAll('.slot-num')[0]; // 숫자 첫번째칸
  const slotNum2 = document.querySelectorAll('.slot-num')[1]; // 숫자 두번째칸
  const slotNum3 = document.querySelectorAll('.slot-num')[2]; // 숫자 세번째칸

  slotNum1.innerHTML = randomNum1.toString(); // 내용갈아 치우기
  slotNum2.innerHTML = randomNum2.toString(); // 내용갈아 치우기
  slotNum3.innerHTML = randomNum3.toString(); // 내용갈아 치우기
}

// 함수를 1초동안 계속 반복해주는 함수
function ranNumRepeat(num1: number) {
  for (let i = 5; i <= num1; i += 5) {
    ranNumAni(i);
  }
}
