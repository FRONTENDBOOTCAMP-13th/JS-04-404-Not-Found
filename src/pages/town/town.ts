// 이미지맵 리사이저 cdn 실행 스크립트 입니다.
declare function imageMapResize(): void;
imageMapResize();

// ST : 모달창 관련 ------------------
const userInfo = document.querySelector('#userInfo'); // userInfo 와 연결되어있는 영역
const userInfoModal = document.querySelector('#userInfoModal'); // userinfo 모달창 영역
const userInfoModalCloseBtn = document.querySelector('#userInfoModalCloseBtn'); //userinfo 닫기 버튼

// 모달창 열기함수
function openModal(modal: Element) {
  modal.classList.remove('d-none');
}

// 모달창 닫기 함수
function closeModal(modal: Element) {
  modal.classList.add('d-none');
}

// 특정 이벤트에 모달창 열기함수가 실행되는 함수.
function openModalEvent(target: Element, modal: Element) {
  target.addEventListener('click', e => {
    e.preventDefault();
    openModal(modal);
  });
  target.addEventListener('touchstart', e => {
    e.preventDefault();
    openModal(modal);
  });
}

// 특정 이벤트에 모달창 닫기함수가 실행되는 함수.
function closeModalEvent(target: Element, modal: Element) {
  target.addEventListener('click', e => {
    e.preventDefault();
    closeModal(modal);
  });
  target.addEventListener('touchstart', e => {
    e.preventDefault();
    closeModal(modal);
  });
}

// 이벤트 부여
if (userInfo && userInfoModal) {
  openModalEvent(userInfo, userInfoModal);
}
if (userInfoModalCloseBtn && userInfoModal) {
  closeModalEvent(userInfoModalCloseBtn, userInfoModal);
}

// ED : 모달창 관련 ------------------
