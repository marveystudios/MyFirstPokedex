// My First Pokédex — grid + detail view for the 151 Gen 1 Pokémon.
// Data: names from PokeAPI (cached in localStorage after first load),
// sprites constructed directly from id, evolution relationships from
// the local lookup table in data.js.

const CACHE_KEY = "pokedex-gen1-list-v1";
const app = document.getElementById("app");

function spriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function getDisplayName(id, rawName) {
  if (NAME_OVERRIDES[id]) return NAME_OVERRIDES[id].display;
  return rawName
    .split("-")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getSpeechName(id, displayName) {
  if (NAME_OVERRIDES[id]) return NAME_OVERRIDES[id].speech;
  return displayName;
}

function speak(text) {
  // Cancel anything already queued so rapid taps don't stack up.
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.65; // slow, for a 4-year-old learning the word
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

async function loadPokemonList() {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      // Corrupt cache — fall through and refetch.
    }
  }

  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  if (!response.ok) throw new Error(`PokeAPI returned HTTP ${response.status}`);
  const data = await response.json();

  const list = data.results.map(entry => {
    const idMatch = entry.url.match(/\/pokemon\/(\d+)\//);
    const id = idMatch ? parseInt(idMatch[1], 10) : null;
    const name = getDisplayName(id, entry.name);
    const speech = getSpeechName(id, name);
    return { id, name, speech };
  });

  localStorage.setItem(CACHE_KEY, JSON.stringify(list));
  return list;
}

function renderGrid(list) {
  app.innerHTML = `<div class="grid" id="grid"></div>`;
  const grid = document.getElementById("grid");

  list.forEach(pokemon => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-tap-area">
        <img src="${spriteUrl(pokemon.id)}" alt="${pokemon.name}" loading="lazy">
        <div class="name">${pokemon.name}</div>
      </div>
      <button class="speak-button" aria-label="Speak ${pokemon.name}">🔊</button>
    `;
    card.querySelector(".card-tap-area").addEventListener("click", () => {
      location.hash = `#/pokemon/${pokemon.id}`;
    });
    card.querySelector(".speak-button").addEventListener("click", event => {
      event.stopPropagation();
      speak(pokemon.speech);
    });
    grid.appendChild(card);
  });
}

function miniCardHtml(pokemon) {
  return `
    <div class="mini-card" data-id="${pokemon.id}">
      <img src="${spriteUrl(pokemon.id)}" alt="${pokemon.name}">
      <div class="mini-name">${pokemon.name}</div>
    </div>`;
}

function renderDetail(id, list) {
  const pokemon = list.find(p => p.id === id);

  if (!pokemon) {
    app.innerHTML = `
      <button class="back-button" id="backBtn">← Back</button>
      <p class="error-message">Couldn't find that Pokémon.</p>`;
    document.getElementById("backBtn").addEventListener("click", () => { location.hash = "#/"; });
    return;
  }

  const prevo = EVOLVES_FROM[id] ? list.find(p => p.id === EVOLVES_FROM[id]) : null;
  const evos = (EVOLVES_TO[id] || []).map(evoId => list.find(p => p.id === evoId)).filter(Boolean);

  app.innerHTML = `
    <button class="back-button" id="backBtn">← Back to all Pokémon</button>
    <div class="detail">
      <img class="detail-image" src="${spriteUrl(pokemon.id)}" alt="${pokemon.name}">
      <div class="detail-name">${pokemon.name}</div>
      <button class="speak-button large" id="detailSpeakBtn" aria-label="Speak ${pokemon.name}">🔊</button>

      ${prevo ? `
        <h2 class="evo-heading">Evolves from</h2>
        <div class="evo-row">${miniCardHtml(prevo)}</div>
      ` : ""}

      ${evos.length ? `
        <h2 class="evo-heading">Evolves into</h2>
        <div class="evo-row">${evos.map(miniCardHtml).join("")}</div>
      ` : ""}
    </div>
  `;

  document.getElementById("backBtn").addEventListener("click", () => { location.hash = "#/"; });
  document.getElementById("detailSpeakBtn").addEventListener("click", () => speak(pokemon.speech));
  app.querySelectorAll(".mini-card").forEach(el => {
    el.addEventListener("click", () => { location.hash = `#/pokemon/${el.dataset.id}`; });
  });
}

let pokemonList = [];

function route() {
  const match = location.hash.match(/^#\/pokemon\/(\d+)$/);
  if (match) {
    renderDetail(parseInt(match[1], 10), pokemonList);
  } else {
    renderGrid(pokemonList);
  }
  window.scrollTo(0, 0);
}

async function init() {
  try {
    pokemonList = await loadPokemonList();
    route();
  } catch (err) {
    console.error("Failed to load Pokédex data:", err);
    app.innerHTML = `<p class="error-message">Couldn't load the Pokédex. Check your connection and try again.</p>`;
  }
}

window.addEventListener("hashchange", route);
init();
