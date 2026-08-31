// --- Step 1 test grid: just a handful of Pokémon to prove out fetch + speech. ---
const TEST_IDS = [1, 4, 7, 25]; // Bulbasaur, Charmander, Squirtle, Pikachu

const grid = document.getElementById("grid");

function spriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function displayName(rawName) {
  // PokeAPI names are lowercase-hyphenated, e.g. "charmander", "mr-mime".
  return rawName
    .split("-")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function speak(name) {
  // Cancel anything already queued so rapid taps don't stack up.
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(name);
  utterance.lang = "en-US";
  utterance.rate = 0.65; // slow, for a 4-year-old learning the word
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

async function fetchPokemon(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();
  return { id, name: displayName(data.name) };
}

function renderCard(pokemon) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${spriteUrl(pokemon.id)}" alt="${pokemon.name}">
    <div class="name">${pokemon.name}</div>
    <button class="speak-button" aria-label="Speak ${pokemon.name}">🔊</button>
  `;
  card.querySelector(".speak-button").addEventListener("click", () => speak(pokemon.name));
  grid.appendChild(card);
}

async function init() {
  const pokemonList = await Promise.all(TEST_IDS.map(fetchPokemon));
  pokemonList.forEach(renderCard);
}

init();
