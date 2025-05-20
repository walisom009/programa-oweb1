async function buscarPokemon() {
    const input = document.getElementById("pokemonName");
    const searchTerm = input.value.trim().toLowerCase();
    const container = document.getElementById("pokemonDetails");
  
    if (!searchTerm) {
      container.innerHTML = "<p>Digite um nome ou número de Pokémon.</p>";
      return;
    }
  
    try {
     
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/ ${searchTerm}`);
      
      if (response.ok) {
        const pokemon = await response.json();
        mostrarPokemon(pokemon);
      } else {

        const listResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000 `);
        const data = await listResponse.json();
  
        const resultados = data.results.filter(p =>
          p.name.includes(searchTerm)
        );
  
        if (resultados.length === 0) {
          container.innerHTML = `<p>Nenhum Pokémon encontrado com "${searchTerm}".</p>`;
          return;
        }
  
        const promessas = resultados.map(async p => {
          const res = await fetch(p.url);
          return res.json();
        });
  
        const pokemons = await Promise.all(promessas);
        mostrarPokemons(pokemons);
      }
    } catch (error) {
      container.innerHTML = `<p>Ocorreu um erro: ${error.message}</p>`;
    }
  }
  
  function mostrarPokemon(pokemon) {
    const tipos = pokemon.types.map(t => t.type.name).join(", ");
    const html = `
      <div class="pokemon-card">
        <h3>${capitalize(pokemon.name)}</h3>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
        <p><strong>ID:</strong> ${pokemon.id}</p>
        <p><strong>Tipo(s):</strong> ${tipos}</p>
      </div>
    `;
    document.getElementById("pokemonDetails").innerHTML = html;
  }

  function mostrarPokemons(pokemons) {
    const html = pokemons.map(p => {
      const tipos = p.types.map(t => t.type.name).join(", ");
      return `
        <div class="pokemon-card">
          <h3>${capitalize(p.name)}</h3>
          <img src="${p.sprites.front_default}" alt="${p.name}" />
          <p><strong>ID:</strong> ${p.id}</p>
          <p><strong>Tipo(s):</strong> ${tipos}</p>
        </div>
      `;
    }).join("");
  
    document.getElementById("pokemonDetails").innerHTML = html;
  }
  
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }