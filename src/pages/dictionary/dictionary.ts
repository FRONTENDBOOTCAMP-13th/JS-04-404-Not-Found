import '../../common/total-time.ts'; // 누적 플레이 타임

const pokeball = document.querySelector('.pokeball');
const typeModal = document.getElementById('type-modal');
const closeTypeModal = document.getElementById('close-type-modal');
const light = document.querySelector('.light');
const pokedex = document.getElementById('pokedex');
const viewFilter = document.getElementById('view-filter') as HTMLSelectElement;

type Pokemon = {
  name: string;
  imgUrl: string;
  number: string;
  types: string[];
  revealed: boolean;
};

let allPokemon: Pokemon[] = [];

// 1. 도감을 ??? 상태로 초기화
const initPokedex = () => {
  allPokemon = Array.from({ length: 151 }, (_, i) => {
    const id = i + 1;
    return {
      name: '???',
      imgUrl: '',
      number: String(id).padStart(3, '0'),
      types: ['???'],
      revealed: false,
    };
  });

  renderPokemonList(allPokemon);
};

// 2. 포켓몬 1마리 정보 fetch
const fetchPokemon = async (id: number): Promise<Pokemon> => {
  const [pokemonRes, speciesRes] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json()),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(res =>
      res.json(),
    ),
  ]);

  const nameKor =
    speciesRes.names.find(
      (n: { language: { name: string }; name: string }) =>
        n.language.name === 'ko',
    )?.name || pokemonRes.name;

  type TypeEntry = {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  };

  const typeUrls = (pokemonRes.types as TypeEntry[]).map(t => t.type.url);
  const types = await getKoreanTypeNames(typeUrls);

  const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
  const number = String(id).padStart(3, '0');

  return { name: nameKor, imgUrl, number, types, revealed: true };
};

// 3. 타입 이름 한글로 가져오기
const getKoreanTypeNames = async (typeUrls: string[]): Promise<string[]> => {
  const names = await Promise.all(
    typeUrls.map(async url => {
      const res = await fetch(url);
      const data = await res.json();
      const korean = data.names.find(
        (n: { language: { name: string }; name: string }) =>
          n.language.name === 'ko',
      );
      return korean?.name || data.name;
    }),
  );
  return names;
};

// 4. 전체 포켓몬 모두 공개해서 보여주기
const fetchAllPokemon = async () => {
  if (!pokedex) return;
  pokedex.innerHTML = '';

  const promises = [];
  for (let i = 1; i <= 151; i++) {
    promises.push(fetchPokemon(i));
  }

  allPokemon = await Promise.all(promises); // 모두 revealed: true
  renderPokemonList(allPokemon);
};

// 5. 카드 렌더링
const renderPokemonCard = (pokemon: Pokemon) => {
  const card = document.createElement('div');
  card.className = 'pokemon-card';

  if (!pokemon.revealed) {
    card.innerHTML = `
      <div class="placeholder-img">???</div>
      <div class="poke-num">${pokemon.number}</div>
      <div class="poke-types">(???)</div>
    `;
  } else {
    card.innerHTML = `
      <img src="${pokemon.imgUrl}" alt="${pokemon.name}" />
      <div class="poke-num">${pokemon.number}</div>
      <div class="poke-name">
        ${pokemon.name}
        <span class="poke-types">(${pokemon.types.join(', ')})</span>
      </div>
    `;
  }

  pokedex?.appendChild(card);
};

// 6. 전체 포켓몬 목록 렌더링
const renderPokemonList = (list: Pokemon[]) => {
  if (!pokedex) return;
  pokedex.innerHTML = '';
  list.forEach(pokemon => renderPokemonCard(pokemon));
};

//////////////// 이벤트 ////////////////////

// light 버튼 클릭 => 내 도감 화면 보이게
light?.addEventListener('click', () => {
  initPokedex();
});

// select 박스 선택 시
viewFilter?.addEventListener('change', () => {
  const selected = viewFilter.value;
  if (selected === '전체 포켓몬 보기') {
    fetchAllPokemon();
  } else if (selected === '내 도감') {
    initPokedex();
  } else if (selected === '획득한 포켓몬') {
    const get = allPokemon.filter(p => p.revealed);
    renderPokemonList(get);
  } else if (selected === '미획득한 포켓몬') {
    const noget = allPokemon.filter(p => !p.revealed);
    renderPokemonList(noget);
  }
});

//////////////// 모달 ////////////////////

pokeball?.addEventListener('click', () => {
  typeModal?.classList.remove('hidden');
});

closeTypeModal?.addEventListener('click', () => {
  typeModal?.classList.add('hidden');
});

typeModal?.addEventListener('click', e => {
  if (e.target === typeModal) {
    typeModal.classList.add('hidden');
  }
});
//slotpokemon()함수 만들기:슬롯에서 뽑은 번호 배열을 받아와 흭득한 포켓몬에 연결

// 타입 버튼 클릭 시 필터링
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedType = btn.getAttribute('data-type');
      if (!selectedType) return;

      const filtered = allPokemon.filter(
        p => p.revealed && p.types.includes(selectedType),
      );
      renderPokemonList(filtered);
      typeModal?.classList.add('hidden');
    });
  });
});

//////////////// 시작 ////////////////////

initPokedex(); // 처음에는 ??? 도감으로 시작

////////////////////////함수 정리//////////////////////////

// initPokedex() 는 비공개 상태 ??? 로 되있는 함수
// fetchPokemon(id) 는 각 포켓몬 데이터를 api에서 가져오는 함수
// fetchAllPokemon()는 1세대 포켓몬 151마리 전부 가져오는 함수
// renderPokemonList() / renderPokemonCard()는 도감에 포켓몬들을 표시하는 함수 revealed가 true면 포켓몬 이미지 false면 ???로 표시
