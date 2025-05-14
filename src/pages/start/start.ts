const startWrap = document.querySelector('.start');
const textList = document.querySelectorAll('.text-list li');

let currentIndex = 0;

function showCurrentText() {
  textList.forEach((li, idx) => {
    (li as HTMLElement).style.display = idx === currentIndex ? 'block' : 'none';
  });
}

showCurrentText();

startWrap?.addEventListener('click', () => {
  if (currentIndex < textList.length - 1) {
    if (currentIndex === 2) {
      const userInput = document.getElementById('userName') as HTMLInputElement;
      const userName = userInput.value.trim();
      const callUser = document.querySelector('.call-user');

      if (callUser) {
        callUser.innerHTML = userName;
      }
      if (userName === '') {
        userInput.focus();
        return;
      }
    }
    currentIndex++;
    showCurrentText();
  } else {
    window.location.href = '/src/pages/town/town.html';
  }
});
