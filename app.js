// My First Pokédex — grid + detail view for the 151 Gen 1 Pokémon.
// Data: names from PokeAPI (cached in localStorage after first load),
// sprites constructed directly from id, evolution relationships from
// the local lookup table in data.js.

const CACHE_KEY = "pokedex-gen1-list-v1";
const app = document.getElementById("app");

function spriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

// Small pixel sprite that already has its own idle animation. Used for the
// move stage, where the big official artwork would just sit there.
function animatedSpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
}

function typeIconUrl(typeName) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${TYPE_INFO[typeName].iconId}.png`;
}

// Effect images borrowed from Pokémon Showdown's battle animations — these are
// the same PNGs its simulator composites. There is no source of Pokémon move
// *videos* anywhere, so each fx key is instead a CSS animation (in style.css)
// that flies these sprites across the stage. One animation covers every
// Pokémon that shares the effect, so ~10 of them will cover all 151.
const MOVE_FX = {
  bolt:       ["lightning"],
  flareball:  ["fireball", "fireball", "fireball"],
  waterwisp:  ["waterwisp", "waterwisp", "waterwisp"],
  leaves:     ["leaf1", "leaf2", "leaf1"],
  rocks:      ["rock1", "rock2", "rock1"],
  poison:     ["poisonwisp", "poisonwisp", "poisonwisp"],
  psybeam:    ["mistball", "mistball", "mistball"],
  ghost:      ["wisp", "wisp", "wisp"],
  ice:        ["iceball", "icicle", "iceball"],
  dragonfire: ["bluefireball", "bluefireball", "bluefireball"],
  beam:       ["shine", "shine", "shine"],
  bone:       ["bone", "bone"],
  melee:      [], // physical hit — it lunges and connects, nothing flies
  aura:       [], // status move (Splash, Sing, Harden) — a pulse, no impact
};

function fxUrl(name) {
  return `https://play.pokemonshowdown.com/fx/${name}.png`;
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

// Setting utterance.lang alone isn't always enough — some devices read Dutch
// text with an English voice unless an actual nl voice is assigned. Prefer
// Flemish, fall back to any Dutch, then let the browser decide.
function pickVoice(lang) {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null; // not populated yet; lang alone will have to do
  const norm = v => v.lang.replace("_", "-");
  const base = lang.split("-")[0] + "-";
  return voices.find(v => norm(v) === lang)
      || voices.find(v => norm(v).startsWith(base))
      || null;
}

function speak(text, lang = "en-US") {
  // Cancel anything already queued so rapid taps don't stack up.
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  const voice = pickVoice(lang);
  if (voice) utterance.voice = voice;
  utterance.rate = 0.65; // slow, for a 4-year-old learning the word
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

// Restarting a CSS animation means taking the class off, forcing a reflow so
// the browser notices, then putting it back.
function playMove(stage) {
  stage.classList.remove("playing");
  void stage.offsetWidth;
  stage.classList.add("playing");
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
      gridScrollY = window.scrollY;
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

function typeRowHtml(id) {
  const types = POKEMON_TYPES[id];
  if (!types) return "";
  return `
    <div class="type-row">
      ${types.map(name => {
        const type = TYPE_INFO[name];
        return `
        <button class="type-badge" data-speak="${type.label} type"
                aria-label="${type.label} type">
          <img src="${typeIconUrl(name)}" alt="${type.label}">
        </button>`;
      }).join("")}
    </div>`;
}

function moveSectionHtml(id) {
  const move = SIGNATURE_MOVES[id];
  if (!move) return "";
  const color = TYPE_INFO[move.type].color;
  return `
    <h2 class="evo-heading">Best move</h2>
    <div class="move-stage" id="moveStage" data-fx="${move.fx}" style="--move-color: ${color}">
      <div class="move-flash"></div>
      <div class="impact"></div>
      ${MOVE_FX[move.fx].map((sprite, i) =>
        `<img class="fx" src="${fxUrl(sprite)}" alt="" style="--i: ${i}">`).join("")}
      <img class="move-sprite" src="${animatedSpriteUrl(id)}" alt="">
    </div>
    <button class="move-button" id="moveBtn" style="background: ${color}">
      <span class="move-label">
        <span class="move-name-nl">${dutchMoveName(move.name)}</span>
        ${dutchMoveName(move.name) === move.name ? ""
          : `<span class="move-name-en">${move.name}</span>`}
      </span>
      <span class="move-play">\u25b6</span>
    </button>`;
}

function episodeSectionHtml(id) {
  const ep = EPISODES[id];
  if (!ep) return "";
  // The two sources aren't equally strong, so the heading says which it is
  // rather than promising an episode about a Pokémon that only walks past.
  const heading = ep.src === "title" ? "Watch the episode" : "First seen in";
  return `
    <h2 class="evo-heading">${heading}</h2>
    <div class="episode">
      <div class="episode-frame">
        <iframe
          src="https://www.youtube-nocookie.com/embed/${ep.vid}?rel=0&amp;modestbranding=1&amp;playsinline=1"
          title="${ep.title}" loading="lazy" allowfullscreen
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          referrerpolicy="strict-origin-when-cross-origin"></iframe>
      </div>
      <div class="episode-title">${ep.title}</div>
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

      ${typeRowHtml(id)}
      ${moveSectionHtml(id)}

      ${prevo ? `
        <h2 class="evo-heading">Evolves from</h2>
        <div class="evo-row">${miniCardHtml(prevo)}</div>
      ` : ""}

      ${evos.length ? `
        <h2 class="evo-heading">Evolves into</h2>
        <div class="evo-row">${evos.map(miniCardHtml).join("")}</div>
      ` : ""}

      ${episodeSectionHtml(id)}
    </div>
  `;

  document.getElementById("backBtn").addEventListener("click", () => { location.hash = "#/"; });
  document.getElementById("detailSpeakBtn").addEventListener("click", () => speak(pokemon.speech));

  app.querySelectorAll("[data-speak]").forEach(el => {
    el.addEventListener("click", () => speak(el.dataset.speak));
  });

  const stage = document.getElementById("moveStage");
  if (stage) {
    const move = SIGNATURE_MOVES[id];
    // Play once on arrival — he can't read the button, so the animation has to
    // announce itself. Only the deliberate tap speaks, so it doesn't talk over
    // the Pokémon's name.
    playMove(stage);
    const replay = () => { playMove(stage); speak(dutchMoveName(move.name), "nl-BE"); };
    stage.addEventListener("click", replay);
    document.getElementById("moveBtn").addEventListener("click", replay);
  }
  app.querySelectorAll(".mini-card").forEach(el => {
    el.addEventListener("click", () => { location.hash = `#/pokemon/${el.dataset.id}`; });
  });
}

let pokemonList = [];
let gridScrollY = 0;

function route() {
  const match = location.hash.match(/^#\/pokemon\/(\d+)$/);
  if (match) {
    renderDetail(parseInt(match[1], 10), pokemonList);
    window.scrollTo(0, 0);
  } else {
    renderGrid(pokemonList);
    // Restore the scroll position he was at before tapping into a Pokémon,
    // instead of always dropping him back at the top of the list.
    window.scrollTo(0, gridScrollY);
  }
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
