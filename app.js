// My First Pokédex — grid + detail view for the 151 Gen 1 Pokémon, with a
// switch at the top to browse the 100 Gen 2 or 135 Gen 3 Pokémon instead.
// Data: Gen 1 names from PokeAPI (cached in localStorage after first load),
// Gen 2 and 3 names, and evolution relationships from the local lookup tables
// in data.js; sprites constructed directly from id. Mega Evolutions and
// regional forms, Gigantamax and Pikachu's caps (POKEMON_FORMS) only appear on
// detail pages, never in the grid.

const CACHE_KEY = "pokedex-gen1-list-v1";
const GEN_KEY = "pokedex-gen";
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
// Flemish, fall back to any Dutch, then any voice at all.
//
// getVoices() is populated asynchronously and can be empty on first call, so
// the list is cached and refreshed when the browser says it changed.
let voiceCache = [];

function refreshVoices() {
  voiceCache = window.speechSynthesis.getVoices() || [];
}

refreshVoices();
if ("onvoiceschanged" in window.speechSynthesis) {
  window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
}

function pickVoice(lang) {
  if (!voiceCache.length) refreshVoices();
  if (!voiceCache.length) return null;
  const norm = v => v.lang.replace("_", "-");
  const base = lang.split("-")[0] + "-";
  return voiceCache.find(v => norm(v) === lang)
      || voiceCache.find(v => norm(v).startsWith(base))
      // Never return null while voices exist: leaving utterance.voice unset
      // lets iOS reuse whichever voice spoke last, so a Dutch move name made
      // the next Pokémon name come out with a Dutch accent.
      || voiceCache.find(v => v.default)
      || voiceCache[0];
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

// "#025" — the Pokédex number as it's usually written.
function dexNumber(id) {
  return "#" + String(id).padStart(3, "0");
}

// Matches on the name (and spoken name, so "mister" finds Mr. Mime) or, for a
// query of digits, on the start of the Pokédex number.
function matchesSearch(pokemon, query) {
  if (!query) return true;
  const digits = query.replace(/^#/, "");
  if (/^\d+$/.test(digits)) {
    // "7" finds 7, 70-79, ... while typing; "007" (as printed on the card) finds just 7.
    return String(pokemon.id).startsWith(digits)
        || dexNumber(pokemon.id).slice(1).startsWith(digits);
  }
  const normalize = text => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const q = normalize(query);
  return normalize(pokemon.name).includes(q) || normalize(pokemon.speech).includes(q);
}

function renderGrid(gen1List) {
  app.innerHTML = `
    <div class="gen-switch" role="group" aria-label="Generation">
      ${GENS.map(gen => `
        <button class="gen-button" data-gen="${gen}" aria-pressed="${gen === currentGen}">
          <img src="${spriteUrl(GEN_ICONS[gen])}" alt="">
          <span>Gen ${gen}</span>
        </button>`).join("")}
    </div>
    <div class="search-bar">
      <input type="search" id="search" placeholder="Search by name or number"
             autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
             aria-label="Search Pokémon">
    </div>
    <div class="grid" id="grid"></div>
    <p class="no-results" id="noResults" hidden>No Pokémon found.</p>`;
  const grid = document.getElementById("grid");
  const search = document.getElementById("search");
  const noResults = document.getElementById("noResults");

  // Every known Pokémon gets a card; browsing shows the chosen generation, and
  // a search looks through all of them (later-gen family members included).
  const cards = withLinkedPokemon(gen1List).map(pokemon => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-tap-area">
        <div class="number">${dexNumber(pokemon.id)}</div>
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
    return { pokemon, card };
  });

  function applySearch() {
    const query = searchQuery.trim();
    let shown = 0;
    cards.forEach(({ pokemon, card }) => {
      const visible = (query || pokemon.gen === currentGen) && matchesSearch(pokemon, query);
      card.hidden = !visible;
      if (visible) shown++;
    });
    noResults.hidden = shown > 0;
  }

  // Filtering hides cards rather than re-rendering, so the input keeps focus
  // and the images don't reload on every keystroke.
  search.value = searchQuery;
  search.addEventListener("input", () => {
    searchQuery = search.value;
    applySearch();
  });

  app.querySelectorAll(".gen-button").forEach(button => {
    button.addEventListener("click", () => {
      currentGen = parseInt(button.dataset.gen, 10);
      try { localStorage.setItem(GEN_KEY, String(currentGen)); } catch (e) { /* not remembered, fine */ }
      app.querySelectorAll(".gen-button").forEach(b =>
        b.setAttribute("aria-pressed", String(b === button)));
      // A leftover search would hide the switch's effect, so start clean.
      searchQuery = "";
      search.value = "";
      applySearch();
      gridScrollY = 0;
      window.scrollTo(0, 0);
    });
  });

  applySearch();
}

function miniCardHtml(pokemon) {
  return `
    <div class="mini-card" data-id="${pokemon.id}">
      <img src="${spriteUrl(pokemon.id)}" alt="${pokemon.name}">
      <div class="mini-name">${pokemon.name}</div>
    </div>`;
}

function typeRowHtml(types) {
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

// Gen 1 (from PokeAPI), then Gen 2, Gen 3 and the later-gen family members (Togekiss,
// Weavile, ...) from data.js, each tagged with the generation the grid browses
// it under — 0 for the linked ones, which only turn up in search and on
// detail pages.
function withLinkedPokemon(list) {
  const fromTable = (table, gen) => Object.entries(table).map(([id, p]) =>
    ({ id: parseInt(id, 10), name: p.name, speech: p.speech || p.name, gen }));
  return list.map(p => ({ ...p, gen: 1 }))
    .concat(fromTable(GEN2_POKEMON, 2), fromTable(GEN3_POKEMON, 3), fromTable(LINKED_POKEMON, 0));
}

// The kinds of form, in the order their sections appear: Megas first, right
// under the evolutions since they read as one more step. `back` heads the card
// on a form's own page that leads back to the regular Pokémon; regional forms
// name the regular one's home region instead (see renderFormDetail).
const FORM_GROUPS = [
  { group: "mega",     heading: "Mega Evolution", back: "Mega Evolves from" },
  { group: "gmax",     heading: "Gigantamax",     back: "Regular form" },
  { group: "regional", heading: "Other regions",  back: null },
  { group: "cap",      heading: "Ash's caps",     back: "Without a cap" },
];

// mega, gmax and cap are groups of their own; alola, galar, ... are all "regional".
function formGroup(form) {
  return FORM_GROUPS.some(g => g.group === form.kind) ? form.kind : "regional";
}

function formSectionsHtml(forms) {
  return FORM_GROUPS.map(({ group, heading }) => {
    const inGroup = forms.filter(form => formGroup(form) === group);
    return inGroup.length ? `
      <h2 class="evo-heading">${heading}</h2>
      <div class="evo-row">${inGroup.map(miniCardHtml).join("")}</div>` : "";
  }).join("");
}

// Evolutions can lead to or from a form (Pikachu -> Alolan Raichu), and forms
// aren't in the list, so look in both.
function findPokemon(list, id) {
  return list.find(p => p.id === id) || FORM_INFO[id] || null;
}

function evolutionSectionsHtml(id, list) {
  const prevo = EVOLVES_FROM[id] ? findPokemon(list, EVOLVES_FROM[id]) : null;
  const evos = (EVOLVES_TO[id] || []).map(evoId => findPokemon(list, evoId)).filter(Boolean);
  return `
    ${prevo ? `
      <h2 class="evo-heading">Evolves from</h2>
      <div class="evo-row">${miniCardHtml(prevo)}</div>
    ` : ""}

    ${evos.length ? `
      <h2 class="evo-heading">Evolves into</h2>
      <div class="evo-row">${evos.map(miniCardHtml).join("")}</div>
    ` : ""}`;
}

// The region a generation's Pokémon come from, for the heading that leads from
// "Alolan Vulpix" back to the Vulpix he already knows.
const HOME_REGIONS = { 1: "Kanto", 2: "Johto", 3: "Hoenn" };

// Shown on the generation buttons, for a reader who goes by pictures:
// Pikachu for Gen 1, Chikorita for Gen 2, Treecko for Gen 3.
const GEN_ICONS = { 1: 25, 2: 152, 3: 252 };
const GENS = [1, 2, 3];

function detailHeaderHtml(id, name) {
  return `
    <img class="detail-image" src="${spriteUrl(id)}" alt="${name}">
    <div class="detail-name">${name}</div>
    <button class="speak-button large" id="detailSpeakBtn" aria-label="Speak ${name}">🔊</button>`;
}

// The listeners every detail page needs; the move stage wires up its own.
function wireDetailPage(speech) {
  document.getElementById("backBtn").addEventListener("click", () => { location.hash = "#/"; });
  document.getElementById("detailSpeakBtn").addEventListener("click", () => speak(speech));

  app.querySelectorAll("[data-speak]").forEach(el => {
    el.addEventListener("click", () => speak(el.dataset.speak));
  });
  app.querySelectorAll(".mini-card").forEach(el => {
    el.addEventListener("click", () => { location.hash = `#/pokemon/${el.dataset.id}`; });
  });
}

// A form's own page: its artwork, name and types, its own evolutions (Alolan
// Diglett -> Alolan Dugtrio), then the way back to the regular Pokémon and the
// other forms of the same kind. The regular Pokémon's move, evolutions and
// episode stay off, because they aren't the form's (Galarian Meowth evolves
// into Perrserker, not Persian).
function renderFormDetail(form, list) {
  const base = list.find(p => p.id === form.baseId);
  const group = formGroup(form);
  // Only siblings of the same kind: Mega Raichu comes from Kanto Raichu, so it
  // has no place on Alolan Raichu's page.
  const siblings = POKEMON_FORMS[form.baseId]
    .filter(other => other.id !== form.id && formGroup(other) === group);
  const baseHeading = FORM_GROUPS.find(g => g.group === group).back
    || `${HOME_REGIONS[base && base.gen] || "Regular"} form`;

  app.innerHTML = `
    <button class="back-button" id="backBtn">← Back to all Pokémon</button>
    <div class="detail">
      ${detailHeaderHtml(form.id, form.name)}

      ${typeRowHtml(form.types)}

      ${evolutionSectionsHtml(form.id, list)}

      ${base ? `
        <h2 class="evo-heading">${baseHeading}</h2>
        <div class="evo-row">${miniCardHtml(base)}</div>
      ` : ""}

      ${formSectionsHtml(siblings)}
    </div>
  `;

  wireDetailPage(form.speech || form.name);
}

function renderDetail(id, gen1List) {
  const list = withLinkedPokemon(gen1List);
  const pokemon = list.find(p => p.id === id);

  if (!pokemon && FORM_INFO[id]) {
    renderFormDetail(FORM_INFO[id], list);
    return;
  }

  if (!pokemon) {
    app.innerHTML = `
      <button class="back-button" id="backBtn">← Back</button>
      <p class="error-message">Couldn't find that Pokémon.</p>`;
    document.getElementById("backBtn").addEventListener("click", () => { location.hash = "#/"; });
    return;
  }

  app.innerHTML = `
    <button class="back-button" id="backBtn">← Back to all Pokémon</button>
    <div class="detail">
      ${detailHeaderHtml(pokemon.id, pokemon.name)}

      ${typeRowHtml(POKEMON_TYPES[id])}
      ${moveSectionHtml(id)}

      ${evolutionSectionsHtml(id, list)}

      ${formSectionsHtml(POKEMON_FORMS[id] || [])}

      ${episodeSectionHtml(id)}
    </div>
  `;

  wireDetailPage(pokemon.speech);

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
}

let pokemonList = [];
let gridScrollY = 0;
let searchQuery = ""; // kept while visiting a detail page, so Back returns to the results
let currentGen = 1;
try {
  const saved = parseInt(localStorage.getItem(GEN_KEY), 10);
  if (GENS.includes(saved)) currentGen = saved;
} catch (e) { /* default to Gen 1 */ }

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
