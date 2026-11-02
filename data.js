// Static data for the 151 Gen 1 Pokémon, the 100 Gen 2 Pokémon (plus the
// later-generation members of their families): name/speech overrides for the handful that don't work with
// simple hyphen-splitting, and the
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

  // Later-generation members of the same families. Their ids are > 151 and
  // they live in LINKED_POKEMON below: reachable from a detail page, but
  // never shown in the main grid.
  [172, 25],                      // Pichu -> Pikachu
  [173, 35],                      // Cleffa -> Clefairy
  [174, 39],                      // Igglybuff -> Jigglypuff
  [42, 169],                      // Golbat -> Crobat
  [44, 182],                      // Gloom -> Bellossom
  [57, 979],                      // Primeape -> Annihilape
  [61, 186],                      // Poliwhirl -> Politoed
  [79, 199],                      // Slowpoke -> Slowking
  [82, 462],                      // Magneton -> Magnezone
  [95, 208],                      // Onix -> Steelix
  [236, 106], [236, 107], [236, 237], // Tyrogue -> Hitmonlee / Hitmonchan / Hitmontop
  [108, 463],                     // Lickitung -> Lickilicky
  [112, 464],                     // Rhydon -> Rhyperior
  [440, 113], [113, 242],         // Happiny -> Chansey -> Blissey
  [114, 465],                     // Tangela -> Tangrowth
  [117, 230],                     // Seadra -> Kingdra
  [439, 122],                     // Mime Jr. -> Mr. Mime
  [123, 212], [123, 900],         // Scyther -> Scizor / Kleavor
  [238, 124],                     // Smoochum -> Jynx
  [239, 125], [125, 466],         // Elekid -> Electabuzz -> Electivire
  [240, 126], [126, 467],         // Magby -> Magmar -> Magmortar
  [133, 196], [133, 197], [133, 470], [133, 471], [133, 700], // Eevee -> Espeon / Umbreon / Leafeon / Glaceon / Sylveon
  [137, 233], [233, 474],         // Porygon -> Porygon2 -> Porygon-Z
  [446, 143],                     // Munchlax -> Snorlax
  // Left out on purpose: Perrserker, Sirfetch'd and Mr. Rime only evolve from
  // the Galarian forms, so showing them under the Kanto artwork would be wrong.

  // Gen 2 lines (the ones that start in Gen 1 are above).
  [152, 153], [153, 154],         // Chikorita -> Bayleef -> Meganium
  [155, 156], [156, 157],         // Cyndaquil -> Quilava -> Typhlosion
  [158, 159], [159, 160],         // Totodile -> Croconaw -> Feraligatr
  [161, 162],                     // Sentret -> Furret
  [163, 164],                     // Hoothoot -> Noctowl
  [165, 166],                     // Ledyba -> Ledian
  [167, 168],                     // Spinarak -> Ariados
  [170, 171],                     // Chinchou -> Lanturn
  [175, 176], [176, 468],         // Togepi -> Togetic -> Togekiss
  [177, 178],                     // Natu -> Xatu
  [179, 180], [180, 181],         // Mareep -> Flaaffy -> Ampharos
  [298, 183], [183, 184],         // Azurill -> Marill -> Azumarill
  [438, 185],                     // Bonsly -> Sudowoodo
  [187, 188], [188, 189],         // Hoppip -> Skiploom -> Jumpluff
  [190, 424],                     // Aipom -> Ambipom
  [191, 192],                     // Sunkern -> Sunflora
  [193, 469],                     // Yanma -> Yanmega
  [194, 195],                     // Wooper -> Quagsire
  [198, 430],                     // Murkrow -> Honchkrow
  [200, 429],                     // Misdreavus -> Mismagius
  [360, 202],                     // Wynaut -> Wobbuffet
  [203, 981],                     // Girafarig -> Farigiraf
  [204, 205],                     // Pineco -> Forretress
  [206, 982],                     // Dunsparce -> Dudunsparce
  [207, 472],                     // Gligar -> Gliscor
  [209, 210],                     // Snubbull -> Granbull
  [215, 461],                     // Sneasel -> Weavile
  [216, 217], [217, 901],         // Teddiursa -> Ursaring -> Ursaluna
  [218, 219],                     // Slugma -> Magcargo
  [220, 221], [221, 473],         // Swinub -> Piloswine -> Mamoswine
  [223, 224],                     // Remoraid -> Octillery
  [458, 226],                     // Mantyke -> Mantine
  [228, 229],                     // Houndour -> Houndoom
  [231, 232],                     // Phanpy -> Donphan
  [234, 899],                     // Stantler -> Wyrdeer
  [246, 247], [247, 248],         // Larvitar -> Pupitar -> Tyranitar
  // Left out for the same reason as above: Clodsire (Paldean Wooper),
  // Overqwil (Hisuian Qwilfish), Sneasler (Hisuian Sneasel) and Cursola
  // (Galarian Corsola).
];

// The 100 Gen 2 Pokémon (ids 152-251), browsable from the generation switch.
// Names are hardcoded because the main list only fetches the first 151 from
// PokeAPI.
// [id]: { name, speech? }
const GEN2_POKEMON = {
  152: { name: "Chikorita" },
  153: { name: "Bayleef" },
  154: { name: "Meganium" },
  155: { name: "Cyndaquil" },
  156: { name: "Quilava" },
  157: { name: "Typhlosion" },
  158: { name: "Totodile" },
  159: { name: "Croconaw" },
  160: { name: "Feraligatr" },
  161: { name: "Sentret" },
  162: { name: "Furret" },
  163: { name: "Hoothoot" },
  164: { name: "Noctowl" },
  165: { name: "Ledyba" },
  166: { name: "Ledian" },
  167: { name: "Spinarak" },
  168: { name: "Ariados" },
  169: { name: "Crobat" },
  170: { name: "Chinchou" },
  171: { name: "Lanturn" },
  172: { name: "Pichu" },
  173: { name: "Cleffa" },
  174: { name: "Igglybuff" },
  175: { name: "Togepi" },
  176: { name: "Togetic" },
  177: { name: "Natu" },
  178: { name: "Xatu" },
  179: { name: "Mareep" },
  180: { name: "Flaaffy" },
  181: { name: "Ampharos" },
  182: { name: "Bellossom" },
  183: { name: "Marill" },
  184: { name: "Azumarill" },
  185: { name: "Sudowoodo" },
  186: { name: "Politoed" },
  187: { name: "Hoppip" },
  188: { name: "Skiploom" },
  189: { name: "Jumpluff" },
  190: { name: "Aipom" },
  191: { name: "Sunkern" },
  192: { name: "Sunflora" },
  193: { name: "Yanma" },
  194: { name: "Wooper" },
  195: { name: "Quagsire" },
  196: { name: "Espeon" },
  197: { name: "Umbreon" },
  198: { name: "Murkrow" },
  199: { name: "Slowking" },
  200: { name: "Misdreavus" },
  201: { name: "Unown" },
  202: { name: "Wobbuffet" },
  203: { name: "Girafarig" },
  204: { name: "Pineco" },
  205: { name: "Forretress" },
  206: { name: "Dunsparce" },
  207: { name: "Gligar" },
  208: { name: "Steelix" },
  209: { name: "Snubbull" },
  210: { name: "Granbull" },
  211: { name: "Qwilfish" },
  212: { name: "Scizor" },
  213: { name: "Shuckle" },
  214: { name: "Heracross" },
  215: { name: "Sneasel" },
  216: { name: "Teddiursa" },
  217: { name: "Ursaring" },
  218: { name: "Slugma" },
  219: { name: "Magcargo" },
  220: { name: "Swinub" },
  221: { name: "Piloswine" },
  222: { name: "Corsola" },
  223: { name: "Remoraid" },
  224: { name: "Octillery" },
  225: { name: "Delibird" },
  226: { name: "Mantine" },
  227: { name: "Skarmory" },
  228: { name: "Houndour" },
  229: { name: "Houndoom" },
  230: { name: "Kingdra" },
  231: { name: "Phanpy" },
  232: { name: "Donphan" },
  233: { name: "Porygon2", speech: "Porygon two" },
  234: { name: "Stantler" },
  235: { name: "Smeargle" },
  236: { name: "Tyrogue" },
  237: { name: "Hitmontop" },
  238: { name: "Smoochum" },
  239: { name: "Elekid" },
  240: { name: "Magby" },
  241: { name: "Miltank" },
  242: { name: "Blissey" },
  243: { name: "Raikou" },
  244: { name: "Entei" },
  245: { name: "Suicune" },
  246: { name: "Larvitar" },
  247: { name: "Pupitar" },
  248: { name: "Tyranitar" },
  249: { name: "Lugia" },
  250: { name: "Ho-Oh" },
  251: { name: "Celebi" },
};

// The later-generation Pokémon referenced above, outside Gen 1 and 2: reachable
// from a detail page and from search, but never in the browsing grid.
// [id]: { name, speech? }
const LINKED_POKEMON = {
  298: { name: "Azurill" },
  360: { name: "Wynaut" },
  424: { name: "Ambipom" },
  429: { name: "Mismagius" },
  430: { name: "Honchkrow" },
  438: { name: "Bonsly" },
  439: { name: "Mime Jr.", speech: "Mime Junior" },
  440: { name: "Happiny" },
  446: { name: "Munchlax" },
  458: { name: "Mantyke" },
  461: { name: "Weavile" },
  462: { name: "Magnezone" },
  463: { name: "Lickilicky" },
  464: { name: "Rhyperior" },
  465: { name: "Tangrowth" },
  466: { name: "Electivire" },
  467: { name: "Magmortar" },
  468: { name: "Togekiss" },
  469: { name: "Yanmega" },
  470: { name: "Leafeon" },
  471: { name: "Glaceon" },
  472: { name: "Gliscor" },
  473: { name: "Mamoswine" },
  474: { name: "Porygon-Z", speech: "Porygon Z" },
  700: { name: "Sylveon" },
  899: { name: "Wyrdeer" },
  900: { name: "Kleavor" },
  901: { name: "Ursaluna" },
  979: { name: "Annihilape" },
  981: { name: "Farigiraf" },
  982: { name: "Dudunsparce" },
};

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

  // Gen 2 and linked later-generation Pokémon (see GEN2_POKEMON, LINKED_POKEMON)
  152: ["grass"],
  153: ["grass"],
  154: ["grass"],
  155: ["fire"],
  156: ["fire"],
  157: ["fire"],
  158: ["water"],
  159: ["water"],
  160: ["water"],
  161: ["normal"],
  162: ["normal"],
  163: ["normal", "flying"],
  164: ["normal", "flying"],
  165: ["bug", "flying"],
  166: ["bug", "flying"],
  167: ["bug", "poison"],
  168: ["bug", "poison"],
  169: ["poison", "flying"],
  170: ["water", "electric"],
  171: ["water", "electric"],
  172: ["electric"],
  173: ["fairy"],
  174: ["normal", "fairy"],
  175: ["fairy"],
  176: ["fairy", "flying"],
  177: ["psychic", "flying"],
  178: ["psychic", "flying"],
  179: ["electric"],
  180: ["electric"],
  181: ["electric"],
  182: ["grass"],
  183: ["water", "fairy"],
  184: ["water", "fairy"],
  185: ["rock"],
  186: ["water"],
  187: ["grass", "flying"],
  188: ["grass", "flying"],
  189: ["grass", "flying"],
  190: ["normal"],
  191: ["grass"],
  192: ["grass"],
  193: ["bug", "flying"],
  194: ["water", "ground"],
  195: ["water", "ground"],
  196: ["psychic"],
  197: ["dark"],
  198: ["dark", "flying"],
  199: ["water", "psychic"],
  200: ["ghost"],
  201: ["psychic"],
  202: ["psychic"],
  203: ["normal", "psychic"],
  204: ["bug"],
  205: ["bug", "steel"],
  206: ["normal"],
  207: ["ground", "flying"],
  208: ["steel", "ground"],
  209: ["fairy"],
  210: ["fairy"],
  211: ["water", "poison"],
  212: ["bug", "steel"],
  213: ["bug", "rock"],
  214: ["bug", "fighting"],
  215: ["dark", "ice"],
  216: ["normal"],
  217: ["normal"],
  218: ["fire"],
  219: ["fire", "rock"],
  220: ["ice", "ground"],
  221: ["ice", "ground"],
  222: ["water", "rock"],
  223: ["water"],
  224: ["water"],
  225: ["ice", "flying"],
  226: ["water", "flying"],
  227: ["steel", "flying"],
  228: ["dark", "fire"],
  229: ["dark", "fire"],
  230: ["water", "dragon"],
  231: ["ground"],
  232: ["ground"],
  233: ["normal"],
  234: ["normal"],
  235: ["normal"],
  236: ["fighting"],
  237: ["fighting"],
  238: ["ice", "psychic"],
  239: ["electric"],
  240: ["fire"],
  241: ["normal"],
  242: ["normal"],
  243: ["electric"],
  244: ["fire"],
  245: ["water"],
  246: ["rock", "ground"],
  247: ["rock", "ground"],
  248: ["rock", "dark"],
  249: ["psychic", "flying"],
  250: ["fire", "flying"],
  251: ["psychic", "grass"],
  298: ["normal", "fairy"],
  360: ["psychic"],
  424: ["normal"],
  429: ["ghost"],
  430: ["dark", "flying"],
  438: ["rock"],
  439: ["psychic", "fairy"],
  440: ["normal"],
  446: ["normal"],
  458: ["water", "flying"],
  461: ["dark", "ice"],
  462: ["electric", "steel"],
  463: ["normal"],
  464: ["ground", "rock"],
  465: ["grass"],
  466: ["electric"],
  467: ["fire"],
  468: ["fairy", "flying"],
  469: ["bug", "flying"],
  470: ["grass"],
  471: ["ice"],
  472: ["ground", "flying"],
  473: ["ice", "ground"],
  474: ["normal"],
  700: ["fairy"],
  899: ["normal", "psychic"],
  900: ["bug", "rock"],
  901: ["ground", "normal"],
  979: ["fighting", "ghost"],
  981: ["normal", "psychic"],
  982: ["normal"],
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


// --- Anime episodes ------------------------------------------------------
// Full episodes from the official Pokémon TV playlist of seasons 1-2, mapped
// to the Pokémon each one features. 137 of the 151 have one.
//
// Two sources, and they are NOT equal quality:
// - "title": the official episode title names this Pokémon, so the episode is
//   genuinely about it. The title is its own evidence — no need to watch it to
//   know. 31 of these.
// - "debut": Bulbapedia lists this as the episode where the Pokémon first
//   appears in the anime. Often that's a background cameo rather than a
//   starring role (Venusaur "debuts" in the Butterfree episode), so the page
//   words these as "first seen in" rather than promising an episode about it.
//   106 of these.
//
// Episode numbering: the playlist's Season 1 Ep N is Bulbapedia's EP00N, and
// Season 2 Ep N is EP0(52+N) — verified against Bulbapedia at both ends.
const EPISODES = {
  1: { vid: "nfpsYGAGzF0", title: "Bulbasaur and the Hidden Village", src: "title" },  // bulbasaur
  2: { vid: "okJhrQSg7uU", title: "Who Gets to Keep Togepi?", src: "debut" },  // ivysaur
  3: { vid: "T23nJU-KwZo", title: "Bye-Bye Butterfree", src: "debut" },  // venusaur
  4: { vid: "JhhupHQlal8", title: "Charmander—the Stray Pokémon", src: "title" },  // charmander
  5: { vid: "pCCsYuiAIQ8", title: "Attack of the Prehistoric Pokémon", src: "debut" },  // charmeleon
  6: { vid: "R9SQMo70NY8", title: "Charizard Chills", src: "title" },  // charizard
  7: { vid: "1TlOcjJodHw", title: "Here Comes the Squirtle Squad", src: "title" },  // squirtle
  8: { vid: "VQFtkKgOVGk", title: "The Battle of the Badge", src: "debut" },  // wartortle
  9: { vid: "mDGVc3Sc_H4", title: "Beach Blank-out Blastoise", src: "title" },  // blastoise
  10: { vid: "h6LFdBPjbf4", title: "Pokémon Emergency", src: "debut" },  // caterpie
  11: { vid: "ObtS79k2NM4", title: "Ash Catches a Pokémon", src: "debut" },  // metapod
  12: { vid: "T23nJU-KwZo", title: "Bye-Bye Butterfree", src: "title" },  // butterfree
  13: { vid: "PEUL-1_zGWI", title: "Challenge of the Samurai", src: "debut" },  // weedle
  14: { vid: "PEUL-1_zGWI", title: "Challenge of the Samurai", src: "debut" },  // kakuna
  15: { vid: "ObtS79k2NM4", title: "Ash Catches a Pokémon", src: "debut" },  // beedrill
  16: { vid: "z3hMX65Khtg", title: "Pokémon - I Choose You!", src: "debut" },  // pidgey
  17: { vid: "ObtS79k2NM4", title: "Ash Catches a Pokémon", src: "debut" },  // pidgeotto
  18: { vid: "dJgDmrra3kM", title: "The School of Hard Knocks", src: "debut" },  // pidgeot
  19: { vid: "z3hMX65Khtg", title: "Pokémon - I Choose You!", src: "debut" },  // rattata
  20: { vid: "9wAKxOavTnw", title: "Battle aboard the St. Anne", src: "debut" },  // raticate
  21: { vid: "z3hMX65Khtg", title: "Pokémon - I Choose You!", src: "debut" },  // spearow
  22: { vid: "z3hMX65Khtg", title: "Pokémon - I Choose You!", src: "debut" },  // fearow
  23: { vid: "h6LFdBPjbf4", title: "Pokémon Emergency", src: "debut" },  // ekans
  24: { vid: "XpwNBGB6Fuo", title: "The Ninja Poké-Showdown", src: "debut" },  // arbok
  25: { vid: "z3hMX65Khtg", title: "Pokémon - I Choose You!", src: "title" },  // pikachu
  26: { vid: "Cd-3_QOIjgU", title: "Electric Shock Showdown", src: "debut" },  // raichu
  27: { vid: "z3hMX65Khtg", title: "Pokémon - I Choose You!", src: "debut" },  // sandshrew
  28: { vid: "1PfJMmwI6b4", title: "The Kangaskhan Kid", src: "debut" },  // sandslash
  30: { vid: "1PfJMmwI6b4", title: "The Kangaskhan Kid", src: "debut" },  // nidorina
  33: { vid: "z3hMX65Khtg", title: "Pokémon - I Choose You!", src: "debut" },  // nidorino
  34: { vid: "okJhrQSg7uU", title: "Who Gets to Keep Togepi?", src: "debut" },  // nidoking
  35: { vid: "iaxkOJZxzQM", title: "Clefairy and the Moon Stone", src: "title" },  // clefairy
  36: { vid: "iaxkOJZxzQM", title: "Clefairy and the Moon Stone", src: "debut" },  // clefable
  37: { vid: "_LhB0LIQlQ0", title: "The Punchy Pokémon", src: "debut" },  // vulpix
  38: { vid: "tuTr_cRGKds", title: "Wake Up Snorlax!", src: "debut" },  // ninetales
  39: { vid: "Ss13Pnq6XII", title: "The Song of Jigglypuff", src: "title" },  // jigglypuff
  41: { vid: "iaxkOJZxzQM", title: "Clefairy and the Moon Stone", src: "debut" },  // zubat
  42: { vid: "RYdXQlBjjPI", title: "The Flame Pokémon-athon!", src: "debut" },  // golbat
  43: { vid: "nfpsYGAGzF0", title: "Bulbasaur and the Hidden Village", src: "debut" },  // oddish
  44: { vid: "PsrT-DG4M4w", title: "Make Room for Gloom!", src: "title" },  // gloom
  45: { vid: "XwpbJK-WE8Q", title: "Hypno's Naptime", src: "debut" },  // vileplume
  46: { vid: "J2MF6t_N8vo", title: "The Problem with Paras", src: "title" },  // paras
  47: { vid: "XTaSlC_OmV4", title: "A Chansey Operation", src: "debut" },  // parasect
  48: { vid: "_LhB0LIQlQ0", title: "The Punchy Pokémon", src: "debut" },  // venonat
  49: { vid: "RYdXQlBjjPI", title: "The Flame Pokémon-athon!", src: "debut" },  // venomoth
  50: { vid: "mRR7mbV0u4U", title: "Dig Those Diglett!", src: "title" },  // diglett
  51: { vid: "XpwNBGB6Fuo", title: "The Ninja Poké-Showdown", src: "debut" },  // dugtrio
  52: { vid: "IcbL2_S2I1w", title: "Go West Young Meowth", src: "title" },  // meowth
  53: { vid: "9wAKxOavTnw", title: "Battle aboard the St. Anne", src: "debut" },  // persian
  54: { vid: "gzQ9-U8C-5U", title: "Bye, Bye Psyduck", src: "title" },  // psyduck
  56: { vid: "z3hMX65Khtg", title: "Pokémon - I Choose You!", src: "debut" },  // mankey
  57: { vid: "9aLD8SGoPIc", title: "Primeape Goes Bananas", src: "title" },  // primeape
  58: { vid: "mRR7mbV0u4U", title: "Dig Those Diglett!", src: "debut" },  // growlithe
  59: { vid: "SaMuL0NZhCU", title: "Showdown at the Po-ké Corral", src: "debut" },  // arcanine
  60: { vid: "rrQmjrZedac", title: "Pokémon Scent-sation!", src: "debut" },  // poliwag
  61: { vid: "rrQmjrZedac", title: "Pokémon Scent-sation!", src: "debut" },  // poliwhirl
  62: { vid: "f8mWMqLO88A", title: "Sparks Fly for Magnemite", src: "debut" },  // poliwrath
  63: { vid: "TYhdezzyqPo", title: "Abra and the Psychic Showdown", src: "title" },  // abra
  64: { vid: "9IymXcXl4fk", title: "Haunter vs. Kadabra", src: "title" },  // kadabra
  66: { vid: "f8mWMqLO88A", title: "Sparks Fly for Magnemite", src: "debut" },  // machop
  67: { vid: "f8mWMqLO88A", title: "Sparks Fly for Magnemite", src: "debut" },  // machoke
  68: { vid: "f8mWMqLO88A", title: "Sparks Fly for Magnemite", src: "debut" },  // machamp
  69: { vid: "rrQmjrZedac", title: "Pokémon Scent-sation!", src: "debut" },  // bellsprout
  70: { vid: "dJgDmrra3kM", title: "The School of Hard Knocks", src: "debut" },  // weepinbell
  71: { vid: "XwpbJK-WE8Q", title: "Hypno's Naptime", src: "debut" },  // victreebel
  72: { vid: "6uNYmqvF24k", title: "Tentacool & Tentacruel", src: "title" },  // tentacool
  73: { vid: "6uNYmqvF24k", title: "Tentacool & Tentacruel", src: "title" },  // tentacruel
  74: { vid: "COr4zRFX0Gw", title: "Showdown in Pewter City", src: "debut" },  // geodude
  75: { vid: "dJgDmrra3kM", title: "The School of Hard Knocks", src: "debut" },  // graveler
  76: { vid: "lSZ172BJoaE", title: "Pikachu's Goodbye", src: "debut" },  // golem
  77: { vid: "1PfJMmwI6b4", title: "The Kangaskhan Kid", src: "debut" },  // ponyta
  78: { vid: "1PfJMmwI6b4", title: "The Kangaskhan Kid", src: "debut" },  // rapidash
  79: { vid: "R-GNznqs7cI", title: "Island of the Giant Pokémon", src: "debut" },  // slowpoke
  80: { vid: "R-GNznqs7cI", title: "Island of the Giant Pokémon", src: "debut" },  // slowbro
  81: { vid: "f8mWMqLO88A", title: "Sparks Fly for Magnemite", src: "title" },  // magnemite
  82: { vid: "mRR7mbV0u4U", title: "Dig Those Diglett!", src: "debut" },  // magneton
  84: { vid: "be4-hKKU9gQ", title: "The Pi-Kahuna", src: "debut" },  // doduo
  85: { vid: "z3hMX65Khtg", title: "Pokémon - I Choose You!", src: "debut" },  // dodrio
  86: { vid: "RcBw50wD9_o", title: "The Water Flowers of Cerulean City", src: "debut" },  // seel
  87: { vid: "KH92hzvhv2g", title: "It's Mr. Mime Time", src: "debut" },  // dewgong
  88: { vid: "XwpbJK-WE8Q", title: "Hypno's Naptime", src: "debut" },  // grimer
  89: { vid: "mRR7mbV0u4U", title: "Dig Those Diglett!", src: "debut" },  // muk
  90: { vid: "lSZ172BJoaE", title: "Pikachu's Goodbye", src: "debut" },  // shellder
  91: { vid: "lSZ172BJoaE", title: "Pikachu's Goodbye", src: "debut" },  // cloyster
  92: { vid: "T23nJU-KwZo", title: "Bye-Bye Butterfree", src: "debut" },  // gastly
  93: { vid: "9IymXcXl4fk", title: "Haunter vs. Kadabra", src: "title" },  // haunter
  94: { vid: "z3hMX65Khtg", title: "Pokémon - I Choose You!", src: "debut" },  // gengar
  95: { vid: "qdju1COuRvQ", title: "The Crystal Onix", src: "title" },  // onix
  96: { vid: "lKggkmrv7q4", title: "Pokémon Fashion Flash", src: "debut" },  // drowzee
  97: { vid: "XwpbJK-WE8Q", title: "Hypno's Naptime", src: "title" },  // hypno
  98: { vid: "3l1lSNQxJA0", title: "Mystery at the Lighthouse", src: "debut" },  // krabby
  99: { vid: "3l1lSNQxJA0", title: "Mystery at the Lighthouse", src: "debut" },  // kingler
  100: { vid: "_LhB0LIQlQ0", title: "The Punchy Pokémon", src: "debut" },  // voltorb
  101: { vid: "1PfJMmwI6b4", title: "The Kangaskhan Kid", src: "debut" },  // electrode
  102: { vid: "XwpbJK-WE8Q", title: "Hypno's Naptime", src: "debut" },  // exeggcute
  103: { vid: "pBXQbh0mtCE", title: "The March of the Exeggutor Squad", src: "title" },  // exeggutor
  104: { vid: "dJgDmrra3kM", title: "The School of Hard Knocks", src: "debut" },  // cubone
  105: { vid: "ROUh6KKz9XA", title: "Round One—Begin!", src: "debut" },  // marowak
  106: { vid: "f8mWMqLO88A", title: "Sparks Fly for Magnemite", src: "debut" },  // hitmonlee
  107: { vid: "f8mWMqLO88A", title: "Sparks Fly for Magnemite", src: "debut" },  // hitmonchan
  108: { vid: "uLJCo0ly_Rc", title: "The Breeding Center Secret", src: "debut" },  // lickitung
  109: { vid: "h6LFdBPjbf4", title: "Pokémon Emergency", src: "debut" },  // koffing
  110: { vid: "XpwNBGB6Fuo", title: "The Ninja Poké-Showdown", src: "debut" },  // weezing
  111: { vid: "1PfJMmwI6b4", title: "The Kangaskhan Kid", src: "debut" },  // rhyhorn
  112: { vid: "dHuwaW3Vlh4", title: "Ditto's Mysterious Mansion", src: "debut" },  // rhydon
  113: { vid: "XTaSlC_OmV4", title: "A Chansey Operation", src: "title" },  // chansey
  114: { vid: "XwpbJK-WE8Q", title: "Hypno's Naptime", src: "debut" },  // tangela
  115: { vid: "1PfJMmwI6b4", title: "The Kangaskhan Kid", src: "title" },  // kangaskhan
  116: { vid: "boY4QaYhBeM", title: "The Ghost of Maiden's Peak", src: "debut" },  // horsea
  118: { vid: "h6LFdBPjbf4", title: "Pokémon Emergency", src: "debut" },  // goldeen
  119: { vid: "KH92hzvhv2g", title: "It's Mr. Mime Time", src: "debut" },  // seaking
  120: { vid: "iaxkOJZxzQM", title: "Clefairy and the Moon Stone", src: "debut" },  // staryu
  121: { vid: "RcBw50wD9_o", title: "The Water Flowers of Cerulean City", src: "debut" },  // starmie
  123: { vid: "Ss13Pnq6XII", title: "The Song of Jigglypuff", src: "debut" },  // scyther
  125: { vid: "Ss13Pnq6XII", title: "The Song of Jigglypuff", src: "debut" },  // electabuzz
  126: { vid: "G7EBiaDe_K0", title: "The Misty Mermaid", src: "debut" },  // magmar
  127: { vid: "PEUL-1_zGWI", title: "Challenge of the Samurai", src: "debut" },  // pinsir
  128: { vid: "1PfJMmwI6b4", title: "The Kangaskhan Kid", src: "debut" },  // tauros
  129: { vid: "z3hMX65Khtg", title: "Pokémon - I Choose You!", src: "debut" },  // magikarp
  130: { vid: "z3hMX65Khtg", title: "Pokémon - I Choose You!", src: "debut" },  // gyarados
  131: { vid: "_cy6tWoHHVA", title: "The Lost Lapras", src: "title" },  // lapras
  132: { vid: "dHuwaW3Vlh4", title: "Ditto's Mysterious Mansion", src: "title" },  // ditto
  133: { vid: "xTmgJ8-HCtI", title: "The Battling Eevee Brothers", src: "title" },  // eevee
  134: { vid: "pBXQbh0mtCE", title: "The March of the Exeggutor Squad", src: "debut" },  // vaporeon
  135: { vid: "pBXQbh0mtCE", title: "The March of the Exeggutor Squad", src: "debut" },  // jolteon
  136: { vid: "pBXQbh0mtCE", title: "The March of the Exeggutor Squad", src: "debut" },  // flareon
  137: { vid: "tuTr_cRGKds", title: "Wake Up Snorlax!", src: "debut" },  // porygon
  138: { vid: "wKU_vLdoSwQ", title: "So Near Yet So Farfetch'd", src: "debut" },  // omanyte
  139: { vid: "wKU_vLdoSwQ", title: "So Near Yet So Farfetch'd", src: "debut" },  // omastar
  140: { vid: "wKU_vLdoSwQ", title: "So Near Yet So Farfetch'd", src: "debut" },  // kabuto
  141: { vid: "wKU_vLdoSwQ", title: "So Near Yet So Farfetch'd", src: "debut" },  // kabutops
  142: { vid: "wKU_vLdoSwQ", title: "So Near Yet So Farfetch'd", src: "debut" },  // aerodactyl
  143: { vid: "tuTr_cRGKds", title: "Wake Up Snorlax!", src: "title" },  // snorlax
  146: { vid: "mFp1nN5RSPE", title: "Fire and Ice", src: "debut" },  // moltres
  147: { vid: "dHuwaW3Vlh4", title: "Ditto's Mysterious Mansion", src: "debut" },  // dratini
  148: { vid: "dHuwaW3Vlh4", title: "Ditto's Mysterious Mansion", src: "debut" },  // dragonair
  149: { vid: "bAE1pgjx8Hk", title: "Enter The Dragonite", src: "title" },  // dragonite
};


// --- Dutch move names ----------------------------------------------------
// He watches the show, not the games, so the Dutch dub's name is the one he'd
// recognise — shown as the main label with the English underneath.
//
// Source: Bulbapedia's "In other languages" table, which is the dub (the games
// were never localised into Dutch, so PokeAPI has no Dutch at all — its
// language list has 14 entries and nl isn't one).
//
// The dub is uneven. Two are exactly what it said but odd for a small child:
// "Lijfstraf" (Body Slam) literally means corporal punishment, and "Roede"
// (Vine Whip) is an archaic word with an anatomical second sense. They're left
// as the dub had them; put a replacement in NL_OVERRIDES to change one without
// touching the table below.
const NL_OVERRIDES = {
  "Body Slam": "Lichaamsstoot", // dub said "Lijfstraf" = corporal punishment
  "Vine Whip": "Rankzweep",     // dub said "Roede", archaic and awkward
};

const MOVE_NAMES_NL = {
  "Absorb": "Absorbeer",
  "Acid": "Zuur",
  "Aurora Beam": "Aurorastraal",
  "Blizzard": "Sneeuwstorm",
  "Body Slam": "Lijfstraf",
  "Bone Club": "Botknuppel",
  "Bonemerang": "Boemerang",
  "Bubble": "Bubbel",
  "Confusion": "Verwarring",
  "Crabhammer": "Krabhamer",
  "Dig": "Graaf",
  "Dizzy Punch": "Duizelslag",
  "Dragon Rage": "Drakenfurie",
  "Drill Peck": "Drilboor",
  "Earthquake": "Aardbeving",
  "Egg Bomb": "Eierbom",
  "Ember": "Sintel",
  "Fire Blast": "Vuurschot",
  "Fire Punch": "Vuurslag",
  "Flamethrower": "Vlammenwerper",
  "Gust": "Windvlaag",
  "Harden": "Verharding",
  "High Jump Kick": "Hoge Sprongschop",
  "Horn Attack": "Hoornaanval",
  "Hydro Pump": "Hydropomp",
  "Hyper Beam": "Hyperstraal",
  "Hyper Fang": "Hypertand",
  "Hypnosis": "Hypnose",
  "Ice Beam": "IJsstraal",
  "Ice Punch": "IJsslag",
  "Karate Chop": "Karateslag",
  "Leech Life": "Onttrek Leven",
  "Lick": "Lik",
  "Low Kick": "Lage schop",
  "Metronome": "Metronoom",
  "Night Shade": "Nachtschade",
  "Pay Day": "Afrekening",
  "Peck": "Boor",
  "Petal Dance": "Bloemendans",
  "Poison Sting": "Gifangel",
  "Psybeam": "Psystraal",
  "Psychic": "Psychisch",
  "Quick Attack": "Snelle Aanval",
  "Razor Leaf": "Messcherpblad",
  "Rock Throw": "Steenworp",
  "Seismic Toss": "Seismische smak",
  "Shadow Ball": "Schaduwbal",
  "Sing": "Zang",
  "Slash": "Hak",
  "Sludge": "Blubber",
  "Smog": "Smog",
  "Solar Beam": "Zonnestraal",
  "Splash": "Spetter",
  "Spore": "Spoor",
  "String Shot": "Bindschot",
  "Submission": "Onderwerping",
  "Swift": "Snel",
  "Take Down": "Haal neer",
  "Teleport": "Teleporteer",
  "Thunder": "Donder",
  "Thunder Punch": "Donderslag",
  "Thunder Shock": "Donderschok",
  "Thunderbolt": "Bliksemstraal",
  "Transform": "Transformeer",
  "Tri Attack": "Tri attack",
  "Twineedle": "Dubbelnaald",
  "Vine Whip": "Roede",
  "Vise Grip": "Handgreep",
  "Water Gun": "Waterpistool",
  "Waterfall": "Waterval",
  "Wing Attack": "Vleugelaanval",
  "Wrap": "Wikkel",
};

function dutchMoveName(englishName) {
  return NL_OVERRIDES[englishName] || MOVE_NAMES_NL[englishName] || englishName;
}
