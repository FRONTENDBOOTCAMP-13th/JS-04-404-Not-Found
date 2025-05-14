const pokeball = document.querySelector('.pokeball');
const typeModal = document.getElementById('type-modal');
const closeTypeModal = document.getElementById('close-type-modal');

pokeball?.addEventListener('click', () => {
  typeModal?.classList.remove('hidden');
});

closeTypeModal?.addEventListener('click', () => {
  typeModal?.classList.add('hidden');
});

// 바깥 클릭 시 닫함
typeModal?.addEventListener('click', e => {
  if (e.target === typeModal) {
    typeModal.classList.add('hidden');
  }
});
