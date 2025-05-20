import '../../common/total-time.ts'; // 누적 플레이 타임
import soundOn from '/src/assets/common/sound-on.png'; // sound-on 이미지
import soundOff from '/src/assets/common/sound-off.png'; // sound-off 이미지
import { musicPlay } from '../../common/local-storage.ts'; // 현재 로컬스토리지의 음소거 상태
import { toggleSound } from '../../common/toggle-sound.ts'; // 음악 켜기 / 끄기 기능
import { allowMusic } from '../../common/music.ts';
import dictionaryMusicSrc from '/src/assets/music/dictionary-music.mp3';

// town-music 오디오 객체 생성 및 음악 재생
const dictionaryMusic = new Audio(dictionaryMusicSrc);
dictionaryMusic.volume = 0.3;
allowMusic(dictionaryMusic, true);

const pokeball = document.querySelector('.pokeball');
const typeModal = document.getElementById('type-modal');
const closeTypeModal = document.getElementById('close-type-modal');
const light = document.querySelector('.light');
const pokedex = document.getElementById('pokedex');
const viewFilter = document.getElementById('view-filter') as HTMLSelectElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;

// 포켓몬 타입 정의
type Pokemon = {
  name: string;
  imgUrl: string;
  number: string;
  types: string[];
  revealed: boolean;
};

let allPokemon: Pokemon[] = []; //도감 전체
let ownedIds: number[] = []; // 로컬저장소에서 획득한 포켓몬 번호
let currentList: Pokemon[] = []; // 현재 보여지는 화면 번호

// 도감 초기화 (모든 포켓몬 ??? 상태)
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

  // 히든카드 용쌤 슬비쌤 추가
  allPokemon.push(
    {
      name: '???',
      imgUrl: '',
      number: '777',
      types: ['???'],
      revealed: false,
    },
    {
      name: '???',
      imgUrl: '',
      number: '888',
      types: ['???'],
      revealed: false,
    },
  );
  renderPokemonList(allPokemon);
};

// 타입 한글명 가져오기
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

// 포켓몬 1마리 정보 가져오기
const fetchPokemon = async (id: number, revealed = true): Promise<Pokemon> => {
  // 히든카드 예외 처리
  if (id === 777) {
    return {
      name: '용쌤',
      imgUrl: '/public/images/슬비쌤.png',
      number: '777',
      types: ['전설'],
      revealed,
    };
  }

  if (id === 888) {
    return {
      name: '슬비쌤',
      imgUrl: '/images/슬비쌤.png',
      number: '888',
      types: ['전설'],
      revealed,
    };
  }
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

  const typeUrls = pokemonRes.types.map(
    (t: { type: { url: string } }) => t.type.url,
  );
  const types = await getKoreanTypeNames(typeUrls);

  const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
  const number = String(id).padStart(3, '0');

  return { name: nameKor, imgUrl, number, types, revealed };
};

// 포켓몬 카드 렌더링
const renderPokemonCard = (pokemon: Pokemon) => {
  const card = document.createElement('div');
  card.className = 'pokemon-card';

  if (!pokemon.revealed) {
    card.classList.add('unrevealed');
    card.innerHTML = `
      <div class="poke-num">${pokemon.number}</div>
    `;
  } else {
    // 히든카드만 특별한 클래스 추가
    if (pokemon.number === '777') card.classList.add('hidden-card-777');
    if (pokemon.number === '888') card.classList.add('hidden-card-888');
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

// 포켓몬 리스트 렌더링
const renderPokemonList = (list: Pokemon[], setCurrent = true) => {
  if (!pokedex) return;
  pokedex.innerHTML = '';
  if (setCurrent) currentList = list; // 💡 검색에서는 false로 넘김
  list.forEach(pokemon => renderPokemonCard(pokemon));
};

// 포켓몬 전체 저장
const savePokedex = () => {
  const ownedNumbers = allPokemon
    .filter(p => p.revealed)
    .map(p => Number(p.number));
  ownedIds = ownedNumbers;
  localStorage.setItem('myPokemon', JSON.stringify(ownedNumbers));
};

// 저장된 번호 불러와서 도감에 공개
const loadOwnedPokemon = async () => {
  const stored = localStorage.getItem('myPokemon');
  if (!stored) return;
  const parsed = JSON.parse(stored);
  const ids = Array.isArray(parsed) ? parsed : [parsed];
  ownedIds = ids;

  // 히든카드 포함
  const fullIds = [...ids];
  if (!fullIds.includes(777)) fullIds.push(777);
  if (!fullIds.includes(888)) fullIds.push(888);

  await slotPokemon(fullIds);
};

// 번호 배열만 도감에 반영
const slotPokemon = async (ids: number[]) => {
  const revealed = await Promise.all(ids.map(id => fetchPokemon(id)));

  revealed.forEach(pokemon => {
    const index = allPokemon.findIndex(p => p.number === pokemon.number);
    if (index !== -1) {
      allPokemon[index] = { ...pokemon, revealed: true };
    }
  });

  savePokedex();
  renderPokemonList(allPokemon);
};

//////////////// 이벤트 처리 //////////////////

light?.addEventListener('click', () => {
  localStorage.removeItem('todayGet');
  initPokedex();
});

viewFilter?.addEventListener('change', async () => {
  const selected = viewFilter.value;

  if (selected === '전체 포켓몬 보기') {
    const preview = await Promise.all(
      Array.from({ length: 151 }, (_, i) => fetchPokemon(i + 1, true)),
    );
    allPokemon = preview;
    currentList = preview;
    renderPokemonList(preview);
  } else if (selected === '내 도감') {
    initPokedex();
    loadOwnedPokemon();
  } else if (selected === '획득한 포켓몬') {
    const stored = localStorage.getItem('myPokemon');
    const parsed = stored ? JSON.parse(stored) : [];

    if (!stored || parsed.length === 0) {
      alert('획득한 포켓몬이 없습니다!');
      return;
    }

    const get = allPokemon.filter(p => parsed.includes(Number(p.number)));
    renderPokemonList(get);
  } else if (selected === '미획득한 포켓몬') {
    initPokedex(); // 도감 초기화
    await loadOwnedPokemon(); // 획득한 포켓몬 반영

    // 777, 888 제외하면서 미획득 필터링
    const nogen = allPokemon.filter(
      p =>
        !ownedIds.includes(Number(p.number)) &&
        p.number !== '777' &&
        p.number !== '888',
    );

    renderPokemonList(nogen);
  }
});

pokeball?.addEventListener('click', () =>
  typeModal?.classList.remove('hidden'),
);
closeTypeModal?.addEventListener('click', () =>
  typeModal?.classList.add('hidden'),
);
typeModal?.addEventListener('click', e => {
  if (e.target === typeModal) {
    typeModal.classList.add('hidden');
  }
});
//////////타입 부분//////////
document.querySelectorAll('.type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const selectedType = btn.getAttribute('data-type');
    if (!selectedType) return;

    const isFullView = viewFilter.value === '전체 포켓몬 보기';

    // 기준 데이터: 전체 포켓몬 또는 획득한 포켓몬
    const baseList = isFullView
      ? allPokemon
      : allPokemon.filter(p => p.revealed);

    //  타입 필터링
    const filtered = baseList.filter(p => p.types.includes(selectedType));

    if (filtered.length === 0) {
      renderPokemonList([], false);
      const noResultDiv = document.createElement('div');
      noResultDiv.className = 'no-result';
      noResultDiv.textContent = '선택한 타입의 포켓몬이 없습니다.';
      pokedex?.appendChild(noResultDiv);
    } else {
      renderPokemonList(filtered, false);
    }

    typeModal?.classList.add('hidden');
  });
});

searchInput?.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    const keyword = searchInput.value.trim().toLowerCase();

    const isFullView = viewFilter.value === '전체 포켓몬 보기';
    const baseList = isFullView ? currentList : allPokemon;

    const filtered = baseList.filter(
      p =>
        (isFullView || p.revealed) &&
        (p.name.toLowerCase().includes(keyword) ||
          p.number === keyword.padStart(3, '0')),
    );

    if (filtered.length === 0) {
      renderPokemonList([]); // 화면을 깔끔하게 비워주고
      const noResultDiv = document.createElement('div');
      noResultDiv.className = 'no-result';
      noResultDiv.textContent = '검색 결과가 없습니다.';
      pokedex?.appendChild(noResultDiv);

      alert(' 가챠랑 슬롯을 통해 다양한 포켓몬을 뽑아 보세요!');
    } else {
      renderPokemonList(filtered, false);
    }
  }
});

// 초기 실행
initPokedex();
loadOwnedPokemon();

////////////////////////함수 정리//////////////////////////

// initPokedex() 는 비공개 상태 ??? 로 되있는 함수
// fetchPokemon(id) 는 각 포켓몬 데이터를 api에서 가져오는 함수
// fetchAllPokemon()는 1세대 포켓몬 151마리 전부 가져오는 함수
// renderPokemonList() / renderPokemonCard()는 도감에 포켓몬들을 표시하는 함수 revealed가 true면 포켓몬 이미지 false면 ???로 표시

// ST : 뒤로가기, 음소거 버튼 ------------------
const backBtn = document.querySelector('.back-btn') as HTMLElement;
const toggleSoundBtn = document.querySelector('.toggle-sound') as HTMLElement;
const toggleSoundText = document.querySelector(
  '.toggle-sound > span',
) as HTMLElement;

// 버튼 및 span의 텍스트 초기화
if (musicPlay() === 'true') {
  toggleSoundBtn.style.backgroundImage = `url(${soundOn})`;
  toggleSoundText.innerHTML = '전체 소리 끄기 버튼';
} else {
  toggleSoundBtn.style.backgroundImage = `url(${soundOff})`;
  toggleSoundText.innerHTML = '전체 소리 켜기 버튼';
}

// 뒤로가기
backBtn.addEventListener('click', () => {
  window.history.back();
});

// 음소거/재생
toggleSoundBtn.addEventListener('click', () => {
  const soundState: string | null = musicPlay();
  toggleSound(dictionaryMusic);
  if (soundState === 'true') {
    toggleSoundBtn.style.backgroundImage = `url(${soundOff})`;
    toggleSoundText.innerHTML = '전체 소리 켜기 버튼';
  } else {
    toggleSoundBtn.style.backgroundImage = `url(${soundOn})`;
    toggleSoundText.innerHTML = '전체 소리 끄기 버튼';
  }
});

// 640기준으로 뒤로가기, 음소거/재생 마우스 이벤트 등록/제거
function topBtnHover() {
  const winW: number = window.innerWidth;
  if (winW > 640) {
    backBtn.style.opacity = '0.7';
    toggleSoundBtn.style.opacity = '0.7';
    backBtn.addEventListener('mouseenter', () => {
      backBtn.style.opacity = '1';
    });
    backBtn.addEventListener('mouseleave', () => {
      backBtn.style.opacity = '0.7';
    });
    toggleSoundBtn.addEventListener('mouseenter', () => {
      toggleSoundBtn.style.opacity = '1';
    });
    toggleSoundBtn.addEventListener('mouseleave', () => {
      toggleSoundBtn.style.opacity = '0.7';
    });
  } else {
    backBtn.style.opacity = '1';
    toggleSoundBtn.style.opacity = '1';
  }
}

// 리사이즈 이벤트로 브라우저 사이즈 달라질 때마다 이벤트동작
window.addEventListener('resize', topBtnHover);
// 초기 동작
topBtnHover();

// ED : 뒤로가기, 음소거 버튼 ------------------
