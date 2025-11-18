// Konfigurasi asas puzzle
const rows = 4;
const cols = 4;

// Data artifak (boleh tambah banyak nanti)
const artifacts = {
  keris: {
    title: "Keris Tradisional Melayu",
    image: "img/keris.jpg",
    description:
      "Keris ini berasal dari koleksi senjata tradisional Melayu. Ia digunakan sebagai simbol status, maruah dan pertahanan diri. Bilahnya bermata dua dengan ukiran halus pada hulu dan sarung."
  },
  // Contoh jika tambah artifak lain:
  // tombak: { ... }
};

// Dapatkan ID artifak dari URL (?id=keris), default = 'keris'
function getArtifactId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || "keris";
}

const artifactId = getArtifactId();
const artifact = artifacts[artifactId] || artifacts["keris"];

// Elemen DOM
const puzzleBoard = document.getElementById("puzzle-board");
const btnShuffle = document.getElementById("btn-shuffle");
const statusText = document.getElementById("status-text");
const titleEl = document.getElementById("artifact-title");
const descEl = document.getElementById("artifact-desc");

// Set tajuk & desc awal
titleEl.textContent = artifact.title;
descEl.textContent = "Selesaikan puzzle untuk melihat penerangan artifak di sini.";

// State tile
let tiles = [];          // susunan semasa
let correctOrder = [];   // susunan betul
let firstSelected = null;

// Inisialisasi puzzle
function initPuzzle() {
  puzzleBoard.innerHTML = "";
  puzzleBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  puzzleBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  tiles = [];
  correctOrder = [];

  const total = rows * cols;
  for (let i = 0; i < total; i++) {
    correctOrder.push(i);
  }

  // guna susunan betul sebagai asas
  tiles = [...correctOrder];

  // Bina tile DOM
  tiles.forEach((index) => {
    const tile = document.createElement("div");
    tile.classList.add("puzzle-tile");

    // Koordinat bagi tile betul
    const row = Math.floor(index / cols);
    const col = index % cols;

    tile.dataset.index = index; // index "betul"
    tile.style.backgroundImage = `url('${artifact.image}')`;
    tile.style.backgroundPosition = `${(-col * 100) / (cols - 1)}% ${(-row * 100) / (rows - 1)}%`;

    tile.addEventListener("click", () => onTileClick(tile));

    puzzleBoard.appendChild(tile);
  });
}

// Shuffle susunan tiles
function shuffleTiles() {
  // Fisher-Yates shuffle
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  // Susun semula mengikut array tiles
  const tileNodes = Array.from(puzzleBoard.children);
  tileNodes.forEach((node, idx) => {
    const targetIndex = tiles[idx];
    node.dataset.currentIndex = targetIndex;
  });

  // Reset state
  firstSelected = null;
  statusText.textContent = "Cuba susun puzzle ini sehingga lengkap.";
  descEl.textContent = "Selesaikan puzzle untuk melihat penerangan artifak di sini.";
}

// Handle klik tile (swap 2 tile)
function onTileClick(tile) {
  if (!firstSelected) {
    firstSelected = tile;
    tile.style.outline = "3px solid #ff9800";
  } else if (firstSelected === tile) {
    // klik sama - batal
    firstSelected.style.outline = "none";
    firstSelected = null;
  } else {
    // swap currentIndex antara 2 tile
    const a = firstSelected;
    const b = tile;

    const aIndex = getTileCurrentIndex(a);
    const bIndex = getTileCurrentIndex(b);

    setTileCurrentIndex(a, bIndex);
    setTileCurrentIndex(b, aIndex);

    a.style.outline = "none";
    firstSelected = null;

    checkSolved();
  }
}

function getTileCurrentIndex(tile) {
  return parseInt(tile.dataset.currentIndex ?? tile.dataset.index, 10);
}

function setTileCurrentIndex(tile, newIndex) {
  tile.dataset.currentIndex = newIndex;

  const row = Math.floor(newIndex / cols);
  const col = newIndex % cols;

  tile.style.backgroundPosition = `${(-col * 100) / (cols - 1)}% ${(-row * 100) / (rows - 1)}%`;
}

// Semak sama ada susunan betul
function checkSolved() {
  const tileNodes = Array.from(puzzleBoard.children);
  const currentOrder = tileNodes.map((tile) => getTileCurrentIndex(tile));

  const solved = currentOrder.every((val, idx) => val === correctOrder[idx]);

  if (solved) {
    statusText.textContent = "Tahniah! Puzzle selesai.";
    descEl.textContent = artifact.description;
  }
}

// Event butang shuffle
btnShuffle.addEventListener("click", () => {
  shuffleTiles();
});

// Run
initPuzzle();
shuffleTiles();
