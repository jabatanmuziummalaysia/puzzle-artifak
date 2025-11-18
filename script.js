// Konfigurasi asas puzzle
const rows = 4;
const cols = 4;

// Data artifak
const artifacts = {
  keris: {
    title: "Keris Tradisional Melayu",
    image: "img/keris.jpg",
    description:
      "Mangkuk seramik ini merupakan artifak berinskripsi yang lazim digunakan dalam tradisi perubatan dan perlindungan Islam di Alam Melayu. Pada bahagian dalamnya tertera ayat-ayat doa serta petikan ayat suci yang ditulis secara melingkar, dipercayai berfungsi sebagai pelindung rohani bagi pemiliknya. Di dasar mangkuk terdapat rajah petak berangka yang menyerupai “magic square”, sering dikaitkan dengan kepercayaan terhadap keseimbangan simbolik dan khasiat penyembuhan. Gabungan tulisan khat, angka dan bentuk mangkuk yang berlekuk menunjukkan kepakaran seni tukang seramik pada zamannya. Artifak ini menggambarkan hubungan erat antara kepercayaan spiritual dan kegunaan harian dalam budaya Islam tradisional."
  }
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

// State global
let tiles = [];
let correctOrder = [];
let firstSelected = null;

// Saiz untuk kira background (akan diisi masa init)
let boardSize = 320;
let pieceW = 0;
let pieceH = 0;

// Inisialisasi puzzle
function initPuzzle() {
  puzzleBoard.innerHTML = "";
  puzzleBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  puzzleBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  // baca lebar board dari CSS (mobile pun ikut)
  boardSize = puzzleBoard.clientWidth || 320;
  pieceW = boardSize / cols;
  pieceH = boardSize / rows;

  tiles = [];
  correctOrder = [];

  const total = rows * cols;
  for (let i = 0; i < total; i++) {
    correctOrder.push(i);
  }

  tiles = [...correctOrder];

  tiles.forEach((index) => {
    const tile = document.createElement("div");
    tile.classList.add("puzzle-tile");

    // index "betul" untuk tile ini
    tile.dataset.index = index;

    const row = Math.floor(index / cols);
    const col = index % cols;

    tile.style.backgroundImage = `url('${artifact.image}')`;
    tile.style.backgroundSize = `${boardSize}px ${boardSize}px`;
    tile.style.backgroundPosition = `-${col * pieceW}px -${row * pieceH}px`;

    tile.addEventListener("click", () => onTileClick(tile));

    puzzleBoard.appendChild(tile);
  });
}

// Shuffle susunan tiles
function shuffleTiles() {
  // Fisher-Yates shuffle atas array index
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  const tileNodes = Array.from(puzzleBoard.children);

  // Set currentIndex untuk setiap tile & update posisi gambar ikut slot
  tileNodes.forEach((node, slotIdx) => {
    const targetIndex = tiles[slotIdx];
    setTileCurrentIndex(node, targetIndex);
  });

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
    firstSelected.style.outline = "none";
    firstSelected = null;
  } else {
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

  tile.style.backgroundSize = `${boardSize}px ${boardSize}px`;
  tile.style.backgroundPosition = `-${col * pieceW}px -${row * pieceH}px`;
}

// Semak sama ada puzzle selesai
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

