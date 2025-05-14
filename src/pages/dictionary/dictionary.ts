interface PokemonData {
  id: number;
  name: string;
  image: string | null;
}

interface NameEntry {
  language: {
    name: string;
  };
  name: string;
}

interface PokemonResponse {
  name: string;
  sprites: {
    front_default: string | null;
  };
}

interface PokemonSpeciesResponse {
  names: NameEntry[];
}

const pokemonIds: number[] = Array.from({ length: 151 }, (_, i) => i + 1);

const fetchPokemonList = async (): Promise<void> => {
  const allData: PokemonData[] = await Promise.all(
    pokemonIds.map(async (id): Promise<PokemonData> => {
      const [pokemonRes, speciesRes]: [
        PokemonResponse,
        PokemonSpeciesResponse,
      ] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res =>
          res.json(),
        ),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(res =>
          res.json(),
        ),
      ]);

      const nameKo =
        speciesRes.names.find(n => n.language.name === 'ko')?.name ||
        pokemonRes.name;
      const imageUrl = pokemonRes.sprites.front_default;

      return {
        id,
        name: nameKo,
        image: imageUrl,
      };
    }),
  );

  const container = document.getElementById('pokedex') as HTMLElement;
  container.innerHTML = allData
    .map(
      p => `
    <div class="card">
      <img src="${p.image}" alt="${p.name}" />
      <p>${p.name}</p>
    </div>
  `,
    )
    .join('');
};

fetchPokemonList();
