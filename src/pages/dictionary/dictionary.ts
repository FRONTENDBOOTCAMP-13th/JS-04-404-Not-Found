import '../../common/total-time.ts'; // 누적 플레이 타임

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

/////////////////////////////api 불러오기////////////////////////////////

//기본 틀//
const pokedex = document.getElementById('pokedex');

type Pokemon = {
  name: string;
  imgUrl: string;
  number: string;
};
//포켓몬 1마리 불러오는 함수수(pomise.all이 동시에 api를 불러오는 메소드라 하네요요)
const fetchPokemon = async (id: number): Promise<Pokemon> => {
  const [pokemonRes, speciesRes] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json()),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(res =>
      res.json(),
    ),
  ]);
  type NameEntry = {
    language: {
      name: string;
    };
    name: string;
  };

  const nameKor =
    speciesRes.names.find((n: NameEntry) => n.language.name === 'ko')?.name ||
    pokemonRes.name;

  const imgUrl = pokemonRes.sprites.front_default;
  const number = String(id).padStart(3, '0');
  return { name: nameKor, imgUrl, number };
};
//카드 안에 내용을 #pokedex에 추가
const renderPokemonCard = (pokemon: Pokemon) => {
  const card = document.createElement('div');
  card.className = 'pokemon-card';
  card.innerHTML = `
    <img src="${pokemon.imgUrl}" alt="${pokemon.name}" />
    <div class="poke-num">#${pokemon.number}</div>
    <div class="poke-name">${pokemon.name}</div>
  `;
  pokedex?.appendChild(card);
};

//151번까지 반복
const fetchAllPokemon = async () => {
  if (!pokedex) return;
  pokedex.innerHTML = '';
  for (let i = 1; i <= 151; i++) {
    const pokemon = await fetchPokemon(i);
    renderPokemonCard(pokemon);
  }
};

fetchAllPokemon();
