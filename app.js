// --- Step 1 test grid: just a handful of Pokémon to prove out fetch + speech. ---
const TEST_IDS = [1, 4, 7, 25]; // Bulbasaur, Charmander, Squirtle, Pikachu

const grid = document.getElementById("grid");
// NOTE: intentionally not named `status` — that's a legacy reserved
// property on `window` (window.status), and declaring a top-level
// const/let named `status` can throw a SyntaxError that silently kills
// the entire script before anything else runs.
const statusBox = document.getElementById("status");

function log(line) {
  if (statusBox) statusBox.textContent += line + "\n";
}

// If this never appears on screen, the <script> tag itself never ran
// (despite JavaScript being enabled) — points at something intercepting
// or stripping the script before it executes.
log("Script loaded ✓");

// Wraps a promise so a silently-hanging request (no error, no response —
// e.g. a network-level block that just drops the connection) shows up
// after a few seconds instead of leaving the page looking frozen forever.
function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timed out after ${ms / 1000}s: ${label}`)), ms)
    ),
  ]);
}

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
  log(`Fetching #${id}...`);
  const response = await withTimeout(
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
    8000,
    `fetch #${id}`
  );
  log(`Got response for #${id}: HTTP ${response.status}`);
  const data = await response.json();
  log(`Parsed JSON for #${id}: ${data.name}`);
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
  log("init() started");
  const results = await Promise.allSettled(TEST_IDS.map(fetchPokemon));

  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      renderCard(result.value);
    } else {
      log(`FAILED #${TEST_IDS[i]}: ${result.reason.name}: ${result.reason.message}`);
    }
  });

  log("init() finished");
}

init().catch(err => log(`init() threw: ${err.name}: ${err.message}`));
