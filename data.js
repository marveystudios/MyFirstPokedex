// Static data for the 151 Gen 1 Pokémon: name/speech overrides for the
// handful that don't work with simple hyphen-splitting, and the
// evolution/prevolution relationships (hardcoded rather than fetched from
// PokeAPI's evolution-chain endpoint — Gen 1 lines are fixed and well-known,
// and this avoids ~150 extra API calls plus branching-chain parsing).

// [id]: { display, speech }
// - display: shown on screen
// - speech: what gets read aloud (omit if same as display works fine)
const NAME_OVERRIDES = {
  29: { display: "Nidoran ♀", speech: "Nidoran" },
  32: { display: "Nidoran ♂", speech: "Nidoran" },
  83: { display: "Farfetch'd", speech: "Farfetch'd" },
  122: { display: "Mr. Mime", speech: "Mister Mime" },
};

// [fromId, toId] for every evolution step among the first 151.
const EVOLUTION_PAIRS = [
  [1, 2], [2, 3],
  [4, 5], [5, 6],
  [7, 8], [8, 9],
  [10, 11], [11, 12],
  [13, 14], [14, 15],
  [16, 17], [17, 18],
  [19, 20],
  [21, 22],
  [23, 24],
  [25, 26],
  [27, 28],
  [29, 30], [30, 31],
  [32, 33], [33, 34],
  [35, 36],
  [37, 38],
  [39, 40],
  [41, 42],
  [43, 44], [44, 45],
  [46, 47],
  [48, 49],
  [50, 51],
  [52, 53],
  [54, 55],
  [56, 57],
  [58, 59],
  [60, 61], [61, 62],
  [63, 64], [64, 65],
  [66, 67], [67, 68],
  [69, 70], [70, 71],
  [72, 73],
  [74, 75], [75, 76],
  [77, 78],
  [79, 80],
  [81, 82],
  [84, 85],
  [86, 87],
  [88, 89],
  [90, 91],
  [92, 93], [93, 94],
  [96, 97],
  [98, 99],
  [100, 101],
  [102, 103],
  [104, 105],
  [109, 110],
  [111, 112],
  [116, 117],
  [118, 119],
  [120, 121],
  [129, 130],
  [133, 134], [133, 135], [133, 136], // Eevee -> Vaporeon / Jolteon / Flareon
  [138, 139],
  [140, 141],
  [147, 148], [148, 149],
];

// Built once, at load: id -> prevoId, id -> [evoIds]
const EVOLVES_FROM = {};
const EVOLVES_TO = {};
EVOLUTION_PAIRS.forEach(([from, to]) => {
  EVOLVES_FROM[to] = from;
  if (!EVOLVES_TO[from]) EVOLVES_TO[from] = [];
  EVOLVES_TO[from].push(to);
});

// --- Types ---------------------------------------------------------------
// [name]: { label, color, iconId }
// - iconId is the PokeAPI type id, which is also the filename of the official
//   type icon in the PokeAPI sprites repo.
// All 18 are listed even though only five are used so far, because the set is
// fixed and this way adding a Pokémon below is a one-line change.
const TYPE_INFO = {
  normal:   { label: "Normal",   color: "#a8a77a", iconId: 1 },
  fighting: { label: "Fighting", color: "#c22e28", iconId: 2 },
  flying:   { label: "Flying",   color: "#a98ff3", iconId: 3 },
  poison:   { label: "Poison",   color: "#a33ea1", iconId: 4 },
  ground:   { label: "Ground",   color: "#e2bf65", iconId: 5 },
  rock:     { label: "Rock",     color: "#b6a136", iconId: 6 },
  bug:      { label: "Bug",      color: "#a6b91a", iconId: 7 },
  ghost:    { label: "Ghost",    color: "#735797", iconId: 8 },
  steel:    { label: "Steel",    color: "#b7b7ce", iconId: 9 },
  fire:     { label: "Fire",     color: "#ee8130", iconId: 10 },
  water:    { label: "Water",    color: "#6390f0", iconId: 11 },
  grass:    { label: "Grass",    color: "#7ac74c", iconId: 12 },
  electric: { label: "Electric", color: "#f7d02c", iconId: 13 },
  psychic:  { label: "Psychic",  color: "#f95587", iconId: 14 },
  ice:      { label: "Ice",      color: "#96d9d6", iconId: 15 },
  dragon:   { label: "Dragon",   color: "#6f35fc", iconId: 16 },
  dark:     { label: "Dark",     color: "#705746", iconId: 17 },
  fairy:    { label: "Fairy",    color: "#d685ad", iconId: 18 },
};

// [id]: [typeName, ...] — hardcoded for the same reason as the evolutions
// above: it saves a per-Pokémon API call on every detail view, so tapping
// through the list stays instant.
const POKEMON_TYPES = {
  1: ["grass", "poison"],
  2: ["grass", "poison"],
  3: ["grass", "poison"],
  4: ["fire"],
  5: ["fire"],
  6: ["fire", "flying"],
  7: ["water"],
  8: ["water"],
  9: ["water"],
  10: ["bug"],
  11: ["bug"],
  12: ["bug", "flying"],
  13: ["bug", "poison"],
  14: ["bug", "poison"],
  15: ["bug", "poison"],
  16: ["normal", "flying"],
  17: ["normal", "flying"],
  18: ["normal", "flying"],
  19: ["normal"],
  20: ["normal"],
  21: ["normal", "flying"],
  22: ["normal", "flying"],
  23: ["poison"],
  24: ["poison"],
  25: ["electric"],
  26: ["electric"],
  27: ["ground"],
  28: ["ground"],
  29: ["poison"],
  30: ["poison"],
  31: ["poison", "ground"],
  32: ["poison"],
  33: ["poison"],
  34: ["poison", "ground"],
  35: ["fairy"],
  36: ["fairy"],
  37: ["fire"],
  38: ["fire"],
  39: ["normal", "fairy"],
  40: ["normal", "fairy"],
  41: ["poison", "flying"],
  42: ["poison", "flying"],
  43: ["grass", "poison"],
  44: ["grass", "poison"],
  45: ["grass", "poison"],
  46: ["bug", "grass"],
  47: ["bug", "grass"],
  48: ["bug", "poison"],
  49: ["bug", "poison"],
  50: ["ground"],
  51: ["ground"],
  52: ["normal"],
  53: ["normal"],
  54: ["water"],
  55: ["water"],
  56: ["fighting"],
  57: ["fighting"],
  58: ["fire"],
  59: ["fire"],
  60: ["water"],
  61: ["water"],
  62: ["water", "fighting"],
  63: ["psychic"],
  64: ["psychic"],
  65: ["psychic"],
  66: ["fighting"],
  67: ["fighting"],
  68: ["fighting"],
  69: ["grass", "poison"],
  70: ["grass", "poison"],
  71: ["grass", "poison"],
  72: ["water", "poison"],
  73: ["water", "poison"],
  74: ["rock", "ground"],
  75: ["rock", "ground"],
  76: ["rock", "ground"],
  77: ["fire"],
  78: ["fire"],
  79: ["water", "psychic"],
  80: ["water", "psychic"],
  81: ["electric", "steel"],
  82: ["electric", "steel"],
  83: ["normal", "flying"],
  84: ["normal", "flying"],
  85: ["normal", "flying"],
  86: ["water"],
  87: ["water", "ice"],
  88: ["poison"],
  89: ["poison"],
  90: ["water"],
  91: ["water", "ice"],
  92: ["ghost", "poison"],
  93: ["ghost", "poison"],
  94: ["ghost", "poison"],
  95: ["rock", "ground"],
  96: ["psychic"],
  97: ["psychic"],
  98: ["water"],
  99: ["water"],
  100: ["electric"],
  101: ["electric"],
  102: ["grass", "psychic"],
  103: ["grass", "psychic"],
  104: ["ground"],
  105: ["ground"],
  106: ["fighting"],
  107: ["fighting"],
  108: ["normal"],
  109: ["poison"],
  110: ["poison"],
  111: ["ground", "rock"],
  112: ["ground", "rock"],
  113: ["normal"],
  114: ["grass"],
  115: ["normal"],
  116: ["water"],
  117: ["water"],
  118: ["water"],
  119: ["water"],
  120: ["water"],
  121: ["water", "psychic"],
  122: ["psychic", "fairy"],
  123: ["bug", "flying"],
  124: ["ice", "psychic"],
  125: ["electric"],
  126: ["fire"],
  127: ["bug"],
  128: ["normal"],
  129: ["water"],
  130: ["water", "flying"],
  131: ["water", "ice"],
  132: ["normal"],
  133: ["normal"],
  134: ["water"],
  135: ["electric"],
  136: ["fire"],
  137: ["normal"],
  138: ["rock", "water"],
  139: ["rock", "water"],
  140: ["rock", "water"],
  141: ["rock", "water"],
  142: ["rock", "flying"],
  143: ["normal"],
  144: ["ice", "flying"],
  145: ["electric", "flying"],
  146: ["fire", "flying"],
  147: ["dragon"],
  148: ["dragon"],
  149: ["dragon", "flying"],
  150: ["psychic"],
  151: ["psychic"],
};

// [id]: the one move this Pokémon is best known for, leaning on the anime
// where that differs from the games — that's what he actually watches.
// PokeAPI has no "signature move" field and no usable way to derive one (its
// move list is unranked, and picking the highest-level Gen 1 move gives
// nonsense like Raichu -> Growl), so this is curated by hand. Every entry was
// then checked against that Pokémon's real learnset via the API.
// - fx: which animation plays, see MOVE_FX in app.js
const SIGNATURE_MOVES = {
  1: { name: "Razor Leaf", type: "grass", fx: "leaves" },  // bulbasaur
  2: { name: "Razor Leaf", type: "grass", fx: "leaves" },  // ivysaur
  3: { name: "Solar Beam", type: "grass", fx: "leaves" },  // venusaur
  4: { name: "Ember", type: "fire", fx: "flareball" },  // charmander
  5: { name: "Flamethrower", type: "fire", fx: "flareball" },  // charmeleon
  6: { name: "Flamethrower", type: "fire", fx: "flareball" },  // charizard
  7: { name: "Water Gun", type: "water", fx: "waterwisp" },  // squirtle
  8: { name: "Water Gun", type: "water", fx: "waterwisp" },  // wartortle
  9: { name: "Hydro Pump", type: "water", fx: "waterwisp" },  // blastoise
  10: { name: "String Shot", type: "bug", fx: "aura" },  // caterpie
  11: { name: "Harden", type: "normal", fx: "aura" },  // metapod
  12: { name: "Gust", type: "flying", fx: "beam" },  // butterfree
  13: { name: "Poison Sting", type: "poison", fx: "poison" },  // weedle
  14: { name: "Harden", type: "normal", fx: "aura" },  // kakuna
  15: { name: "Twineedle", type: "bug", fx: "melee" },  // beedrill
  16: { name: "Gust", type: "flying", fx: "beam" },  // pidgey
  17: { name: "Wing Attack", type: "flying", fx: "melee" },  // pidgeotto
  18: { name: "Wing Attack", type: "flying", fx: "melee" },  // pidgeot
  19: { name: "Quick Attack", type: "normal", fx: "melee" },  // rattata
  20: { name: "Hyper Fang", type: "normal", fx: "melee" },  // raticate
  21: { name: "Peck", type: "flying", fx: "melee" },  // spearow
  22: { name: "Drill Peck", type: "flying", fx: "melee" },  // fearow
  23: { name: "Wrap", type: "normal", fx: "melee" },  // ekans
  24: { name: "Acid", type: "poison", fx: "poison" },  // arbok
  25: { name: "Thunderbolt", type: "electric", fx: "bolt" },  // pikachu
  26: { name: "Thunderbolt", type: "electric", fx: "bolt" },  // raichu
  27: { name: "Dig", type: "ground", fx: "rocks" },  // sandshrew
  28: { name: "Slash", type: "normal", fx: "melee" },  // sandslash
  29: { name: "Poison Sting", type: "poison", fx: "poison" },  // nidoran-f
  30: { name: "Poison Sting", type: "poison", fx: "poison" },  // nidorina
  31: { name: "Earthquake", type: "ground", fx: "rocks" },  // nidoqueen
  32: { name: "Poison Sting", type: "poison", fx: "poison" },  // nidoran-m
  33: { name: "Horn Attack", type: "normal", fx: "melee" },  // nidorino
  34: { name: "Earthquake", type: "ground", fx: "rocks" },  // nidoking
  35: { name: "Metronome", type: "normal", fx: "aura" },  // clefairy
  36: { name: "Metronome", type: "normal", fx: "aura" },  // clefable
  37: { name: "Ember", type: "fire", fx: "flareball" },  // vulpix
  38: { name: "Fire Blast", type: "fire", fx: "flareball" },  // ninetales
  39: { name: "Sing", type: "normal", fx: "aura" },  // jigglypuff
  40: { name: "Sing", type: "normal", fx: "aura" },  // wigglytuff
  41: { name: "Leech Life", type: "bug", fx: "melee" },  // zubat
  42: { name: "Leech Life", type: "bug", fx: "melee" },  // golbat
  43: { name: "Absorb", type: "grass", fx: "leaves" },  // oddish
  44: { name: "Acid", type: "poison", fx: "poison" },  // gloom
  45: { name: "Petal Dance", type: "grass", fx: "leaves" },  // vileplume
  46: { name: "Spore", type: "grass", fx: "aura" },  // paras
  47: { name: "Spore", type: "grass", fx: "aura" },  // parasect
  48: { name: "Confusion", type: "psychic", fx: "psybeam" },  // venonat
  49: { name: "Psybeam", type: "psychic", fx: "psybeam" },  // venomoth
  50: { name: "Dig", type: "ground", fx: "rocks" },  // diglett
  51: { name: "Earthquake", type: "ground", fx: "rocks" },  // dugtrio
  52: { name: "Pay Day", type: "normal", fx: "melee" },  // meowth
  53: { name: "Pay Day", type: "normal", fx: "melee" },  // persian
  54: { name: "Confusion", type: "psychic", fx: "psybeam" },  // psyduck
  55: { name: "Hydro Pump", type: "water", fx: "waterwisp" },  // golduck
  56: { name: "Karate Chop", type: "fighting", fx: "melee" },  // mankey
  57: { name: "Karate Chop", type: "fighting", fx: "melee" },  // primeape
  58: { name: "Flamethrower", type: "fire", fx: "flareball" },  // growlithe
  59: { name: "Fire Blast", type: "fire", fx: "flareball" },  // arcanine
  60: { name: "Bubble", type: "water", fx: "waterwisp" },  // poliwag
  61: { name: "Water Gun", type: "water", fx: "waterwisp" },  // poliwhirl
  62: { name: "Submission", type: "fighting", fx: "melee" },  // poliwrath
  63: { name: "Teleport", type: "psychic", fx: "aura" },  // abra
  64: { name: "Psychic", type: "psychic", fx: "psybeam" },  // kadabra
  65: { name: "Psychic", type: "psychic", fx: "psybeam" },  // alakazam
  66: { name: "Low Kick", type: "fighting", fx: "melee" },  // machop
  67: { name: "Karate Chop", type: "fighting", fx: "melee" },  // machoke
  68: { name: "Seismic Toss", type: "fighting", fx: "melee" },  // machamp
  69: { name: "Vine Whip", type: "grass", fx: "leaves" },  // bellsprout
  70: { name: "Razor Leaf", type: "grass", fx: "leaves" },  // weepinbell
  71: { name: "Razor Leaf", type: "grass", fx: "leaves" },  // victreebel
  72: { name: "Acid", type: "poison", fx: "poison" },  // tentacool
  73: { name: "Hydro Pump", type: "water", fx: "waterwisp" },  // tentacruel
  74: { name: "Rock Throw", type: "rock", fx: "rocks" },  // geodude
  75: { name: "Rock Throw", type: "rock", fx: "rocks" },  // graveler
  76: { name: "Earthquake", type: "ground", fx: "rocks" },  // golem
  77: { name: "Ember", type: "fire", fx: "flareball" },  // ponyta
  78: { name: "Flamethrower", type: "fire", fx: "flareball" },  // rapidash
  79: { name: "Confusion", type: "psychic", fx: "psybeam" },  // slowpoke
  80: { name: "Psychic", type: "psychic", fx: "psybeam" },  // slowbro
  81: { name: "Thunder Shock", type: "electric", fx: "bolt" },  // magnemite
  82: { name: "Thunderbolt", type: "electric", fx: "bolt" },  // magneton
  83: { name: "Slash", type: "normal", fx: "melee" },  // farfetchd
  84: { name: "Peck", type: "flying", fx: "melee" },  // doduo
  85: { name: "Drill Peck", type: "flying", fx: "melee" },  // dodrio
  86: { name: "Aurora Beam", type: "ice", fx: "ice" },  // seel
  87: { name: "Ice Beam", type: "ice", fx: "ice" },  // dewgong
  88: { name: "Sludge", type: "poison", fx: "poison" },  // grimer
  89: { name: "Sludge", type: "poison", fx: "poison" },  // muk
  90: { name: "Aurora Beam", type: "ice", fx: "ice" },  // shellder
  91: { name: "Ice Beam", type: "ice", fx: "ice" },  // cloyster
  92: { name: "Lick", type: "ghost", fx: "ghost" },  // gastly
  93: { name: "Night Shade", type: "ghost", fx: "ghost" },  // haunter
  94: { name: "Shadow Ball", type: "ghost", fx: "ghost" },  // gengar
  95: { name: "Rock Throw", type: "rock", fx: "rocks" },  // onix
  96: { name: "Hypnosis", type: "psychic", fx: "aura" },  // drowzee
  97: { name: "Psychic", type: "psychic", fx: "psybeam" },  // hypno
  98: { name: "Crabhammer", type: "water", fx: "waterwisp" },  // krabby
  99: { name: "Crabhammer", type: "water", fx: "waterwisp" },  // kingler
  100: { name: "Thunder Shock", type: "electric", fx: "bolt" },  // voltorb
  101: { name: "Thunderbolt", type: "electric", fx: "bolt" },  // electrode
  102: { name: "Confusion", type: "psychic", fx: "psybeam" },  // exeggcute
  103: { name: "Psychic", type: "psychic", fx: "psybeam" },  // exeggutor
  104: { name: "Bone Club", type: "ground", fx: "bone" },  // cubone
  105: { name: "Bonemerang", type: "ground", fx: "bone" },  // marowak
  106: { name: "High Jump Kick", type: "fighting", fx: "melee" },  // hitmonlee
  107: { name: "Fire Punch", type: "fire", fx: "flareball" },  // hitmonchan
  108: { name: "Lick", type: "ghost", fx: "ghost" },  // lickitung
  109: { name: "Smog", type: "poison", fx: "poison" },  // koffing
  110: { name: "Sludge", type: "poison", fx: "poison" },  // weezing
  111: { name: "Horn Attack", type: "normal", fx: "melee" },  // rhyhorn
  112: { name: "Earthquake", type: "ground", fx: "rocks" },  // rhydon
  113: { name: "Egg Bomb", type: "normal", fx: "melee" },  // chansey
  114: { name: "Vine Whip", type: "grass", fx: "leaves" },  // tangela
  115: { name: "Dizzy Punch", type: "normal", fx: "melee" },  // kangaskhan
  116: { name: "Water Gun", type: "water", fx: "waterwisp" },  // horsea
  117: { name: "Hydro Pump", type: "water", fx: "waterwisp" },  // seadra
  118: { name: "Horn Attack", type: "normal", fx: "melee" },  // goldeen
  119: { name: "Waterfall", type: "water", fx: "waterwisp" },  // seaking
  120: { name: "Swift", type: "normal", fx: "beam" },  // staryu
  121: { name: "Psychic", type: "psychic", fx: "psybeam" },  // starmie
  122: { name: "Psychic", type: "psychic", fx: "psybeam" },  // mr-mime
  123: { name: "Slash", type: "normal", fx: "melee" },  // scyther
  124: { name: "Ice Punch", type: "ice", fx: "ice" },  // jynx
  125: { name: "Thunder Punch", type: "electric", fx: "bolt" },  // electabuzz
  126: { name: "Fire Punch", type: "fire", fx: "flareball" },  // magmar
  127: { name: "Vise Grip", type: "normal", fx: "melee" },  // pinsir
  128: { name: "Take Down", type: "normal", fx: "melee" },  // tauros
  129: { name: "Splash", type: "normal", fx: "aura" },  // magikarp
  130: { name: "Hyper Beam", type: "normal", fx: "beam" },  // gyarados
  131: { name: "Ice Beam", type: "ice", fx: "ice" },  // lapras
  132: { name: "Transform", type: "normal", fx: "aura" },  // ditto
  133: { name: "Quick Attack", type: "normal", fx: "melee" },  // eevee
  134: { name: "Hydro Pump", type: "water", fx: "waterwisp" },  // vaporeon
  135: { name: "Thunderbolt", type: "electric", fx: "bolt" },  // jolteon
  136: { name: "Flamethrower", type: "fire", fx: "flareball" },  // flareon
  137: { name: "Tri Attack", type: "normal", fx: "beam" },  // porygon
  138: { name: "Water Gun", type: "water", fx: "waterwisp" },  // omanyte
  139: { name: "Hydro Pump", type: "water", fx: "waterwisp" },  // omastar
  140: { name: "Absorb", type: "grass", fx: "leaves" },  // kabuto
  141: { name: "Slash", type: "normal", fx: "melee" },  // kabutops
  142: { name: "Wing Attack", type: "flying", fx: "melee" },  // aerodactyl
  143: { name: "Body Slam", type: "normal", fx: "melee" },  // snorlax
  144: { name: "Blizzard", type: "ice", fx: "ice" },  // articuno
  145: { name: "Thunder", type: "electric", fx: "bolt" },  // zapdos
  146: { name: "Fire Blast", type: "fire", fx: "flareball" },  // moltres
  147: { name: "Dragon Rage", type: "dragon", fx: "dragonfire" },  // dratini
  148: { name: "Dragon Rage", type: "dragon", fx: "dragonfire" },  // dragonair
  149: { name: "Hyper Beam", type: "normal", fx: "beam" },  // dragonite
  150: { name: "Psychic", type: "psychic", fx: "psybeam" },  // mewtwo
  151: { name: "Psychic", type: "psychic", fx: "psybeam" },  // mew
};
