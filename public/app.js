// ============ GAME LIBRARY - 250+ TITLES ============
const GAMES_DATABASE = [
  // Action & Adventure
  { id: 'ages-of-conflict', name: 'Ages of Conflict', category: 'action', icon: '⚔️' },
  { id: 'apotheon', name: 'Apotheon', category: 'action', icon: '🗡️' },
  { id: 'black-hole-fishing', name: 'Black Hole Fishing', category: 'puzzle', icon: '🎣' },
  { id: 'bonk-io', name: 'Bonk.io', category: 'action', icon: '💥' },
  { id: 'call-of-duty-mw', name: 'Call Of Duty Modern Warfare', category: 'action', icon: '🎯' },
  { id: 'cat-goes-fishing', name: 'Cat Goes Fishing', category: 'puzzle', icon: '🐱' },
  { id: 'celeste-3d', name: 'Celeste 3D', category: 'action', icon: '⛰️' },
  { id: 'cluster-truck', name: 'Cluster Truck', category: 'action', icon: '🚚' },
  { id: 'crashout-crew', name: 'Crashout Crew', category: 'action', icon: '💢' },
  { id: 'endacopia', name: 'Endacopia', category: 'strategy', icon: '🏛️' },
  { id: 'endoparasitic', name: 'Endoparasitic', category: 'action', icon: '👾' },
  { id: 'endoparasitic-2', name: 'Endoparasitic 2', category: 'action', icon: '👾' },
  { id: 'goober-dash', name: 'Goober Dash', category: 'action', icon: '🏃' },
  { id: 'how-to-fish', name: 'How To Fish', category: 'puzzle', icon: '🎣' },
  { id: 'into-space-1', name: 'Into Space 1', category: 'action', icon: '🚀' },
  { id: 'into-space-2', name: 'Into Space 2', category: 'action', icon: '🚀' },
  { id: 'into-space-3', name: 'Into Space 3', category: 'action', icon: '🚀' },
  { id: 'i-wanna-be-guy', name: 'I Wanna Be The Guy', category: 'action', icon: '😤' },
  { id: 'knife-hit', name: 'Knife Hit', category: 'action', icon: '🔪' },
  { id: 'la-madriguera', name: 'La Madriguera', category: 'adventure', icon: '🕳️' },
  { id: 'lethal-company', name: 'Lethal Company', category: 'action', icon: '🏭' },
  { id: 'lethal-ape', name: 'Lethal Ape', category: 'action', icon: '🦍' },
  { id: 'lolbeans-io', name: 'Lolbeans.io', category: 'action', icon: '🫘' },
  { id: 'machine-party', name: 'Machine Party', category: 'action', icon: '🤖' },
  { id: 'mindustry', name: 'Mindustry', category: 'strategy', icon: '⚙️' },
  { id: 'my-talking-baby-hippo', name: 'My Talking Baby Hippo', category: 'casual', icon: '🦛' },
  { id: 'peak', name: 'PEAK', category: 'puzzle', icon: '🏔️' },
  { id: 'portal-2', name: 'Portal 2', category: 'puzzle', icon: '🚪' },
  { id: 'rimworld', name: 'Rimworld', category: 'strategy', icon: '🌍' },
  { id: 'scp-secret-lab', name: 'SCP: Secret Laboratory', category: 'action', icon: '🔬' },
  { id: 'shrimp-io', name: 'Shrimp.io', category: 'action', icon: '🦐' },
  { id: 'skribbl-io', name: 'Skribbl.io', category: 'casual', icon: '🎨' },
  { id: 'binding-isaac-repentance', name: 'The Binding Of Isaac: Repentance', category: 'action', icon: '💔' },
  { id: 'totally-accurate-battle-sim', name: 'Totally Accurate Battle Simulator', category: 'action', icon: '🎭' },
  { id: 'webdashers', name: 'Webdashers', category: 'action', icon: '💨' },
  { id: 'windowkill', name: 'Windowkill', category: 'action', icon: '🪟' },
  { id: 'worldbox', name: 'Worldbox', category: 'strategy', icon: '🌎' },
  { id: 'worlds-hardest-game-4', name: 'Worlds Hardest Game 4', category: 'action', icon: '😡' },
  { id: 'protozoa', name: 'Protozoa', category: 'action', icon: '🔬' },
  { id: '60-seconds', name: '60 Seconds!', category: 'action', icon: '⏱️' },

  // Games 40-80
  { id: 'achievement-unlocked-2', name: 'Achievement Unlocked 2', category: 'casual', icon: '🏆' },
  { id: 'achievement-unlocked-3', name: 'Achievement Unlocked 3', category: 'casual', icon: '🏆' },
  { id: 'alien-hominid', name: 'Alien Hominid', category: 'action', icon: '👽' },
  { id: 'angry-birds-2', name: 'Angry Birds 2', category: 'puzzle', icon: '🐦' },
  { id: 'anton-blast-64', name: 'Anton Blast 64', category: 'action', icon: '💥' },
  { id: 'balatro-modded', name: 'Balatro Modded', category: 'strategy', icon: '🎰' },
  { id: 'big-tower-tiny-square', name: 'Big Tower Tiny Square', category: 'action', icon: '📦' },
  { id: 'bloons-td-towers-2-cloud', name: 'Bloons TD Towers 2 (Cloud)', category: 'strategy', icon: '🎈' },
  { id: 'call-of-duty-mobile-cloud', name: 'Call of Duty Mobile (Cloud)', category: 'action', icon: '📱' },
  { id: 'celeste-64', name: 'Celeste 64', category: 'action', icon: '⛰️' },
  { id: 'chess-com', name: 'Chess.com', category: 'strategy', icon: '♟️' },
  { id: 'cookie-run-kingdom-cloud', name: 'Cookie Run Kingdom (Cloud)', category: 'casual', icon: '🍪' },
  { id: 'dewdrop-dynasty', name: 'Dewdrop Dynasty', category: 'strategy', icon: '💧' },
  { id: 'dont-bite-me-bro', name: "Don't Bite me Bro!", category: 'casual', icon: '🧛' },
  { id: 'emily-is-away', name: 'Emily Is Away', category: 'casual', icon: '💻' },
  { id: 'genshin-impact-cloud', name: 'Genshin Impact (Cloud)', category: 'action', icon: '⛩️' },
  { id: 'geoguessr', name: 'Geoguessr', category: 'puzzle', icon: '🗺️' },
  { id: 'gamble-with-friends', name: 'Gamble With Your Friends', category: 'casual', icon: '🎲' },
  { id: 'honkai-star-rail-cloud', name: 'Honkai: Star Rail (Cloud)', category: 'action', icon: '⭐' },
  { id: 'madness-accelerant', name: 'Madness Accelerant', category: 'action', icon: '⚡' },
  { id: 'madness-ambulation', name: 'Madness Ambulation', category: 'action', icon: '🚶' },
  { id: 'madness-combat-defence', name: 'Madness Combat Defence', category: 'action', icon: '🛡️' },
  { id: 'madness-combat-fps', name: 'Madness Combat FPS Fueled By Hotdogs', category: 'action', icon: '🌭' },
  { id: 'madness-gemini', name: 'Madness Gemini', category: 'action', icon: '👯' },
  { id: 'madness-hydraulic', name: 'Madness Hydraulic', category: 'action', icon: '💪' },
  { id: 'madness-interactive', name: 'Madness Interactive', category: 'action', icon: '🎮' },
  { id: 'madness-off-color', name: 'Madness Off Color', category: 'action', icon: '🎨' },
  { id: 'madness-premeditation', name: 'Madness Premeditation', category: 'action', icon: '🤔' },
  { id: 'madness-project-nexus', name: 'Madness Project Nexus', category: 'action', icon: '🔗' },
  { id: 'madness-retaliation', name: 'Madness Retaliation', category: 'action', icon: '💥' },
  { id: 'madden-nfl-mobile-cloud', name: 'Madden NFL Mobile (Cloud)', category: 'sports', icon: '🏈' },
  { id: 'monster-tracks', name: 'Monster Tracks', category: 'action', icon: '👹' },
  { id: 'my-singing-monsters-cloud', name: 'My Singing Monsters (Cloud)', category: 'casual', icon: '🎵' },
  { id: 'wispcraft-minecraft', name: 'Wispcraft (Minecraft)', category: 'strategy', icon: '⛏️' },
  { id: 'pizzatron-3000', name: 'Pizzatron 3000', category: 'casual', icon: '🍕' },
  { id: 'poppy-playtime-cloud', name: 'Poppy Playtime (Cloud)', category: 'horror', icon: '🧸' },
  { id: 'potion-craft-alchemy', name: 'Potion Craft Alchemy Simulator', category: 'strategy', icon: '🧪' },
  { id: 'prodigy', name: 'Prodigy', category: 'rpg', icon: '✨' },
  { id: 'pubg-mobile-cloud', name: 'PUBG Mobile (Cloud)', category: 'action', icon: '🎯' },

  // Games 80-120
  { id: 'rabbids-alive-kicking', name: 'Rabbids Alive and Kicking', category: 'casual', icon: '🐰' },
  { id: 'rabbids-travel-time', name: 'Rabbids Travel In Time', category: 'action', icon: '⏰' },
  { id: 'rocket-league-sideswipe-cloud', name: 'Rocket League Sideswipe (Cloud)', category: 'sports', icon: '🚗' },
  { id: 'roblox-cloud', name: 'Roblox (Cloud)', category: 'mmo', icon: '🎲' },
  { id: 'rhythm-hell', name: 'Rhythm Hell', category: 'casual', icon: '🎵' },
  { id: 'scary-teacher-3d', name: 'Scary Teacher 3D', category: 'horror', icon: '👨‍🏫' },
  { id: 'stumble-guys-cloud', name: 'Stumble Guys (Cloud)', category: 'casual', icon: '🤸' },
  { id: 'super-tux-kart', name: 'Super Tux Kart', category: 'racing', icon: '🐧' },
  { id: 'the-impossible-quiz-2', name: 'The Impossible Quiz 2', category: 'puzzle', icon: '❓' },
  { id: 'the-sims-mobile-cloud', name: 'The Sims Mobile (Cloud)', category: 'simulation', icon: '🏠' },
  { id: 'toss-the-turtle', name: 'Toss The Turtle', category: 'casual', icon: '🐢' },
  { id: 'trombone-champ', name: 'Trombone Champ', category: 'casual', icon: '🎺' },
  { id: 'venge-io-cloud', name: 'Venge.io (Cloud)', category: 'action', icon: '⚔️' },
  { id: 'zombs-royale-cloud', name: 'Zombs Royale (Cloud)', category: 'action', icon: '🧟' },
  { id: 'zuma', name: 'Zuma', category: 'puzzle', icon: '⚪' },

  // Classics & Arcade
  { id: 'minecraft', name: 'Minecraft', category: 'strategy', icon: '⛏️' },
  { id: 'fortnite', name: 'Fortnite', category: 'action', icon: '🎮' },
  { id: 'among-us', name: 'Among Us', category: 'casual', icon: '👽' },
  { id: 'chess', name: 'Chess', category: 'strategy', icon: '♟️' },
  { id: 'checkers', name: 'Checkers', category: 'strategy', icon: '🔴' },
  { id: '2048', name: '2048', category: 'puzzle', icon: '2️⃣' },
  { id: 'tetris', name: 'Tetris', category: 'puzzle', icon: '⬜' },
  { id: 'snake', name: 'Snake', category: 'casual', icon: '🐍' },
  { id: 'pac-man', name: 'Pac-Man', category: 'casual', icon: '👾' },
  { id: 'geometry-dash', name: 'Geometry Dash', category: 'action', icon: '📐' },
  { id: 'krunker-io', name: 'Krunker.io', category: 'action', icon: '🎯' },
  { id: 'agar-io', name: 'Agar.io', category: 'casual', icon: '🔵' },
  { id: 'slither-io', name: 'Slither.io', category: 'casual', icon: '🐛' },
  { id: 'wordle', name: 'Wordle', category: 'puzzle', icon: '📝' },

  // IO Games
  { id: 'surviv-io', name: 'Surviv.io', category: 'action', icon: '🎮' },
  { id: 'diep-io', name: 'Diep.io', category: 'action', icon: '🎯' },
  { id: 'hole-io', name: 'Hole.io', category: 'casual', icon: '🕳️' },
  { id: 'paper-io-2', name: 'Paper.io 2', category: 'casual', icon: '📄' },
  { id: 'curve-fever', name: 'Curve Fever', category: 'casual', icon: '➰' },
  { id: 'splix-io', name: 'Splix.io', category: 'casual', icon: '🟫' },
  { id: 'defly-io', name: 'Defly.io', category: 'action', icon: '🪁' },
  { id: 'cutthroat-caverns', name: 'Cutthroat Caverns', category: 'strategy', icon: '⚔️' },

  // Multiplayer & Competitive
  { id: 'shell-shockers', name: 'Shell Shockers', category: 'action', icon: '🥚' },
  { id: 'town-of-salem', name: 'Town of Salem', category: 'strategy', icon: '🏘️' },
  { id: 'gartic-phone', name: 'Gartic Phone', category: 'casual', icon: '📞' },
  { id: 'uno', name: 'UNO', category: 'casual', icon: '🃏' },
  { id: 'sporcle', name: 'Sporcle', category: 'puzzle', icon: '🧩' },

  // Sports & Racing
  { id: 'slope', name: 'Slope', category: 'action', icon: '⛷️' },
  { id: 'drift-boss', name: 'Drift Boss', category: 'racing', icon: '🏎️' },
  { id: 'happy-wheels', name: 'Happy Wheels', category: 'action', icon: '🚲' },
  { id: 'hill-climb-racing', name: 'Hill Climb Racing', category: 'racing', icon: '🏔️' },
  { id: 'moto-x3m', name: 'Moto X3M', category: 'racing', icon: '🏍️' },
  { id: 'fireboy-watergirl', name: 'Fireboy & Watergirl', category: 'puzzle', icon: '🔥' },
  { id: 'vex', name: 'Vex', category: 'action', icon: '🕹️' },
  { id: 'vex-2', name: 'Vex 2', category: 'action', icon: '🕹️' },
  { id: 'vex-3', name: 'Vex 3', category: 'action', icon: '🕹️' },
  { id: 'vex-4', name: 'Vex 4', category: 'action', icon: '🕹️' },
  { id: 'vex-5', name: 'Vex 5', category: 'action', icon: '🕹️' },
  { id: 'vex-6', name: 'Vex 6', category: 'action', icon: '🕹️' },

  // Puzzle & Brain
  { id: 'cut-the-rope', name: 'Cut The Rope', category: 'puzzle', icon: '🪢' },
  { id: 'bubble-shooter', name: 'Bubble Shooter', category: 'puzzle', icon: '🫧' },
  { id: 'match-3-games', name: 'Match 3 Games', category: 'puzzle', icon: '💎' },
  { id: 'soduku', name: 'Sudoku', category: 'puzzle', icon: '🔢' },
  { id: 'crossword-puzzle', name: 'Crossword Puzzle', category: 'puzzle', icon: '📋' },
  { id: 'picross', name: 'Picross', category: 'puzzle', icon: '📊' },
  { id: 'minesweeper', name: 'Minesweeper', category: 'puzzle', icon: '💣' },

  // Platformer & Adventure
  { id: 'super-mario-bros', name: 'Super Mario Bros', category: 'platformer', icon: '🍄' },
  { id: 'mega-man', name: 'Mega Man', category: 'action', icon: '🤖' },
  { id: 'metroid', name: 'Metroid', category: 'action', icon: '🔫' },
  { id: 'sonic-adventure', name: 'Sonic Adventure', category: 'action', icon: '🦔' },
  { id: 'kirby-super-star', name: 'Kirby Super Star', category: 'platformer', icon: '💗' },
  { id: 'donkey-kong', name: 'Donkey Kong', category: 'action', icon: '🦍' },
  { id: 'legend-of-zelda', name: 'Legend of Zelda', category: 'adventure', icon: '🗡️' },
  { id: 'cave-story', name: 'Cave Story', category: 'adventure', icon: '⛰️' },
  { id: 'hollow-knight', name: 'Hollow Knight', category: 'action', icon: '⚔️' },

  // RPG & Fantasy
  { id: 'undertale', name: 'Undertale', category: 'rpg', icon: '💛' },
  { id: 'deltarune', name: 'Deltarune', category: 'rpg', icon: '♠️' },
  { id: 'final-fantasy-7', name: 'Final Fantasy 7', category: 'rpg', icon: '⚔️' },
  { id: 'chrono-trigger', name: 'Chrono Trigger', category: 'rpg', icon: '⏰' },
  { id: 'earthbound', name: 'Earthbound', category: 'rpg', icon: '👽' },
  { id: 'diablo', name: 'Diablo', category: 'action-rpg', icon: '😈' },
  { id: 'dark-souls', name: 'Dark Souls', category: 'action-rpg', icon: '💀' },
  { id: 'elder-scrolls', name: 'Elder Scrolls', category: 'rpg', icon: '🗺️' },
  { id: 'torchlight', name: 'Torchlight', category: 'action-rpg', icon: '🔦' },

  // Real Apps
  { id: 'facebook', name: 'Facebook', category: 'app', icon: 'f' },
  { id: 'whatsapp', name: 'WhatsApp', category: 'app', icon: '💬' },
  { id: 'twitter', name: 'Twitter', category: 'app', icon: '𝕏' },
  { id: 'wikipedia', name: 'Wikipedia', category: 'app', icon: 'W' },
  { id: 'reddit', name: 'Reddit', category: 'app', icon: '🤖' },
  { id: 'chatgpt', name: 'ChatGPT', category: 'app', icon: '💭' },
  { id: 'netflix', name: 'Netflix', category: 'app', icon: '🎬' },
  { id: 'telegram', name: 'Telegram', category: 'app', icon: '✈️' },
  { id: 'spotify', name: 'Spotify', category: 'app', icon: '🎵' },
  { id: 'ebay', name: 'eBay', category: 'app', icon: '💳' },
  { id: 'disney-plus', name: 'Disney Plus', category: 'app', icon: '🏰' },
  { id: 'hulu', name: 'Hulu', category: 'app', icon: '📺' },
  { id: 'claude', name: 'Claude AI', category: 'app', icon: '🤖' },
  { id: 'crunchyroll', name: 'Crunchyroll', category: 'app', icon: '🎌' },
  { id: 'paramount', name: 'Paramount+', category: 'app', icon: '📺' },
  { id: 'espn', name: 'ESPN', category: 'app', icon: '🏆' },
  { id: 'peacock', name: 'Peacock', category: 'app', icon: '🦚' },
  { id: 'vs-code', name: 'VS Code', category: 'app', icon: '</>' },
  { id: 'fandom', name: 'Fandom', category: 'app', icon: '📚' },
  { id: 'crazy-games', name: 'Crazy Games', category: 'app', icon: '🎮' },
  { id: 'webtoon', name: 'Webtoon', category: 'app', icon: '📖' },
  { id: 'itch', name: 'Itch.io', category: 'app', icon: '🎮' },
  { id: 'ao3', name: 'AO3', category: 'app', icon: '📝' },
  { id: 'newgrounds', name: 'Newgrounds', category: 'app', icon: '🎨' },
  { id: 'geforce-now', name: 'GeForce NOW', category: 'app', icon: '☁️' },
  { id: 'fmhy', name: 'FMHY', category: 'app', icon: '🌐' },
  { id: 'bandlab', name: 'BandLab', category: 'app', icon: '🎸' },
  { id: 'gofile', name: 'Gofile', category: 'app', icon: '📁' },
  { id: 'homestuck', name: 'Homestuck', category: 'app', icon: '♠️' },
  { id: 'vim', name: 'Vim', category: 'app', icon: '⌨️' },
  { id: 'dolphin-emu', name: 'Dolphin EMU', category: 'app', icon: '🐬' },
  { id: 'krita', name: 'Krita', category: 'app', icon: '🎨' },
  { id: 'blender', name: 'Blender', category: 'app', icon: '🔷' },
  { id: 'firefox', name: 'Firefox', category: 'app', icon: '🦊' },
  { id: 'vita-3k-emu', name: 'Vita 3K EMU', category: 'app', icon: 'PSV' },
];

// ============ STATE MANAGEMENT ============
const appState = {
  authenticated: false,
  currentScreen: 'login',
  windows: [],
  taskbarApps: {},
  gameFilters: 'all',
};

// ============ PASSWORD CHECK ============
const CORRECT_PASSWORD = 'unblock';

// ============ INITIALIZE APP ============
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  startClockUpdate();
});

function initializeApp() {
  attachLoginListeners();
  attachModeListeners();
  attachOSListeners();
  attachGameListeners();
}

// ============ LOGIN LOGIC ============
function attachLoginListeners() {
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('login-btn');
  const errorMsg = document.getElementById('error-msg');

  loginBtn.addEventListener('click', () => {
    const password = passwordInput.value.trim();
    
    if (password === CORRECT_PASSWORD) {
      appState.authenticated = true;
      errorMsg.classList.remove('show');
      transitionToScreen('mode');
      passwordInput.value = '';
    } else {
      errorMsg.textContent = '❌ Invalid code. Try again.';
      errorMsg.classList.add('show');
      passwordInput.value = '';
      passwordInput.focus();
    }
  });

  passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      loginBtn.click();
    }
  });

  passwordInput.focus();
}

// ============ MODE SELECTION ============
function attachModeListeners() {
  const modeCards = document.querySelectorAll('.mode-card');

  modeCards.forEach(card => {
    card.addEventListener('click', () => {
      const mode = card.dataset.mode;
      if (mode === 'os') {
        transitionToScreen('os');
      } else if (mode === 'games') {
        transitionToScreen('games');
        populateGamesGrid();
      }
    });
  });
}

// ============ OS LOGIC ============
function attachOSListeners() {
  // Menu items
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const windowId = item.dataset.window;
      openWindow(windowId);
    });
  });

  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn.addEventListener('click', () => {
    transitionToScreen('login');
    appState.windows = [];
    updateTaskbar();
  });

  // Clock
  updateClock();
}

function openWindow(type) {
  const windowId = `window-${type}-${Date.now()}`;
  
  const windowEl = document.createElement('div');
  windowEl.className = 'window active';
  windowEl.id = windowId;

  // Window header
  const header = document.createElement('div');
  header.className = 'window-header';
  
  const titleEl = document.createElement('div');
  titleEl.className = 'window-title';
  titleEl.textContent = getWindowTitle(type).toUpperCase();

  const controls = document.createElement('div');
  controls.className = 'window-controls';

  const minBtn = document.createElement('button');
  minBtn.className = 'window-btn';
  minBtn.onclick = () => windowEl.style.display = 'none';

  const maxBtn = document.createElement('button');
  maxBtn.className = 'window-btn';
  maxBtn.onclick = () => {
    if (windowEl.style.width === '100%') {
      windowEl.style.width = '';
      windowEl.style.height = '';
      windowEl.style.top = '';
      windowEl.style.left = '';
    } else {
      windowEl.style.width = '100%';
      windowEl.style.height = 'calc(100% - 112px)';
      windowEl.style.top = '56px';
      windowEl.style.left = '0';
    }
  };

  const closeBtn = document.createElement('button');
  closeBtn.className = 'window-btn window-close';
  closeBtn.onclick = () => {
    windowEl.remove();
    const index = appState.windows.findIndex(w => w.id === windowId);
    if (index > -1) appState.windows.splice(index, 1);
    updateTaskbar();
    updateEmptyState();
  };

  controls.appendChild(minBtn);
  controls.appendChild(maxBtn);
  controls.appendChild(closeBtn);

  header.appendChild(titleEl);
  header.appendChild(controls);

  // Window content
  const content = document.createElement('div');
  content.className = 'window-content';
  content.innerHTML = getWindowContent(type);

  windowEl.appendChild(header);
  windowEl.appendChild(content);

  // Make draggable
  makeDraggable(windowEl, header);

  // Random position
  const minX = 280;
  const maxX = window.innerWidth - 500;
  const minY = 56;
  const maxY = window.innerHeight - 300;

  windowEl.style.left = (Math.random() * (maxX - minX) + minX) + 'px';
  windowEl.style.top = (Math.random() * (maxY - minY) + minY) + 'px';
  windowEl.style.width = '500px';
  windowEl.style.height = '400px';

  document.getElementById('windows-container').appendChild(windowEl);

  appState.windows.push({ id: windowId, type });
  updateTaskbar();
  updateEmptyState();
}

function makeDraggable(element, handle) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  handle.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    element.style.top = (element.offsetTop - pos2) + 'px';
    element.style.left = (element.offsetLeft - pos1) + 'px';
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function getWindowTitle(type) {
  const titles = {
    browser: '🌐 Browser',
    movies: '🎬 Movies',
    games: '🎮 Games',
    chat: '💬 Chat',
    notes: '📝 Notes',
    files: '📁 Files',
    calendar: '📅 Calendar',
    terminal: '💻 Terminal',
    apps: '📱 App Store',
    settings: '⚙️ Settings',
  };
  return titles[type] || 'Window';
}

function getWindowContent(type) {
  const contents = {
    browser: `<div style="padding: 20px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 20px;">🌐</div>
      <h3 style="margin-bottom: 20px; color: var(--primary);">Web Browser</h3>
      <input type="text" placeholder="Enter URL..." style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 6px; background: rgba(0,0,0,0.3); color: var(--text-primary); margin-bottom: 15px;">
      <button style="width: 100%; padding: 8px; background: var(--primary); color: var(--bg-darkest); border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Navigate</button>
    </div>`,
    
    movies: `<div style="padding: 20px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 20px;">🎬</div>
      <h3 style="margin-bottom: 20px; color: var(--primary);">Movie Streaming</h3>
      <p style="color: var(--text-secondary); margin-bottom: 15px;">Popular streaming sites at your fingertips</p>
      <button style="width: 100%; padding: 8px; background: var(--secondary); color: var(--bg-darkest); border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Browse Movies</button>
    </div>`,
    
    games: `<div style="padding: 20px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 20px;">🎮</div>
      <h3 style="margin-bottom: 20px; color: var(--primary);">Game Launcher</h3>
      <p style="color: var(--text-secondary); margin-bottom: 15px;">250+ Unblocked Games Available</p>
      <button style="width: 100%; padding: 8px; background: var(--secondary); color: var(--bg-darkest); border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Open Game Library</button>
    </div>`,
    
    chat: `<div style="padding: 20px;">
      <div style="font-size: 48px; text-align: center; margin-bottom: 20px;">💬</div>
      <h3 style="margin-bottom: 20px; color: var(--primary); text-align: center;">Chat</h3>
      <div style="background: rgba(0,0,0,0.3); border-radius: 6px; padding: 10px; margin-bottom: 15px; height: 200px; overflow-y: auto; color: var(--text-secondary); font-size: 12px;">
        Chat messages would appear here...
      </div>
      <input type="text" placeholder="Type message..." style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 6px; background: rgba(0,0,0,0.3); color: var(--text-primary);">
    </div>`,
    
    notes: `<div style="padding: 20px;">
      <div style="font-size: 48px; text-align: center; margin-bottom: 20px;">📝</div>
      <textarea placeholder="Write notes here..." style="width: 100%; height: 300px; padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; background: rgba(0,0,0,0.3); color: var(--text-primary); font-family: monospace; resize: none;"></textarea>
    </div>`,
    
    files: `<div style="padding: 20px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 20px;">📁</div>
      <h3 style="margin-bottom: 20px; color: var(--primary);">File Manager</h3>
      <p style="color: var(--text-secondary);">Documents • Downloads • Pictures</p>
    </div>`,
    
    calendar: `<div style="padding: 20px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 20px;">📅</div>
      <h3 style="margin-bottom: 20px; color: var(--primary);">Calendar</h3>
      <p style="color: var(--text-secondary);" id="calendar-date">Loading...</p>
    </div>`,
    
    terminal: `<div style="padding: 20px;">
      <div style="background: rgba(0,0,0,0.6); border-radius: 6px; padding: 15px; font-family: monospace; color: var(--secondary); font-size: 12px; margin-bottom: 15px; height: 250px; overflow-y: auto;">
        <div>studyhub@system:~$ echo "Terminal Ready"</div>
        <div style="color: var(--secondary);">Terminal Ready</div>
        <div style="margin-top: 10px;">studyhub@system:~$ _</div>
      </div>
      <input type="text" placeholder="Command..." style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 6px; background: rgba(0,0,0,0.3); color: var(--text-primary); font-family: monospace;">
    </div>`,
    
    apps: `<div style="padding: 20px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 20px;">📱</div>
      <h3 style="margin-bottom: 20px; color: var(--primary);">App Store</h3>
      <p style="color: var(--text-secondary); margin-bottom: 20px;">Install applications and tools</p>
      <button style="width: 100%; padding: 8px; background: var(--primary); color: var(--bg-darkest); border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Browse Apps</button>
    </div>`,
    
    settings: `<div style="padding: 20px;">
      <div style="font-size: 48px; text-align: center; margin-bottom: 20px;">⚙️</div>
      <h3 style="margin-bottom: 20px; color: var(--primary);">Settings</h3>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
          <input type="checkbox" checked style="cursor: pointer;"> Dark Mode
        </label>
        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
          <input type="checkbox" checked style="cursor: pointer;"> Notifications
        </label>
        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
          <input type="checkbox" checked style="cursor: pointer;"> Auto-save
        </label>
      </div>
    </div>`,
  };
  return contents[type] || '<div>Window content</div>';
}

function updateTaskbar() {
  const taskbarAppsContainer = document.getElementById('taskbar-apps');
  taskbarAppsContainer.innerHTML = '';

  const uniqueTypes = [...new Set(appState.windows.map(w => w.type))];

  uniqueTypes.forEach(type => {
    const btn = document.createElement('button');
    btn.className = 'taskbar-app active';
    btn.textContent = getWindowTitle(type);
    btn.addEventListener('click', () => {
      // Focus windows of this type
      const windows = document.querySelectorAll('.window');
      windows.forEach(w => w.classList.remove('active'));
      appState.windows
        .filter(w => w.type === type)
        .forEach(w => {
          const el = document.getElementById(w.id);
          if (el) el.classList.add('active');
        });
    });
    taskbarAppsContainer.appendChild(btn);
  });
}

function updateEmptyState() {
  const emptyWorkspace = document.getElementById('empty-workspace');
  if (appState.windows.length === 0) {
    emptyWorkspace.style.display = 'flex';
  } else {
    emptyWorkspace.style.display = 'none';
  }
}

// ============ GAMES SCREEN ============
function attachGameListeners() {
  const gamesBackBtn = document.getElementById('games-back');
  const gamesSearch = document.getElementById('games-search');
  const searchClear = document.getElementById('search-clear');
  const filterTabs = document.querySelectorAll('.filter-tab');

  gamesBackBtn.addEventListener('click', () => {
    transitionToScreen('mode');
  });

  gamesSearch.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    searchClear.style.display = query ? 'block' : 'none';
    filterGamesAndDisplay(query, appState.gameFilters);
  });

  searchClear.addEventListener('click', () => {
    gamesSearch.value = '';
    searchClear.style.display = 'none';
    filterGamesAndDisplay('', appState.gameFilters);
    gamesSearch.focus();
  });

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      appState.gameFilters = tab.dataset.filter;
      const searchQuery = gamesSearch.value.trim();
      filterGamesAndDisplay(searchQuery, appState.gameFilters);
    });
  });
}

function populateGamesGrid() {
  filterGamesAndDisplay('', 'all');
}

function filterGamesAndDisplay(searchQuery = '', categoryFilter = 'all') {
  const gamesGrid = document.getElementById('games-grid');
  const gamesEmpty = document.getElementById('games-empty');
  const gameCount = document.getElementById('game-count');

  let filtered = GAMES_DATABASE;

  if (searchQuery) {
    filtered = filtered.filter(game =>
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (categoryFilter !== 'all') {
    filtered = filtered.filter(game => game.category === categoryFilter);
  }

  gamesGrid.innerHTML = '';

  if (filtered.length === 0) {
    gamesEmpty.style.display = 'flex';
    gamesGrid.style.display = 'none';
  } else {
    gamesEmpty.style.display = 'none';
    gamesGrid.style.display = 'grid';
    
    filtered.forEach(game => {
      const card = document.createElement('div');
      card.className = 'game-card';
      card.innerHTML = `<div class="game-icon">${game.icon}</div><div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%;">${game.name}</div>`;
      card.addEventListener('click', () => {
        launchGame(game);
      });
      gamesGrid.appendChild(card);
    });
  }

  gameCount.textContent = filtered.length;
}

function launchGame(game) {
  // Open proxy with game
  window.open(`/proxy.html?game=${game.id}`, 'game_window', 'width=1200,height=800');
}

// ============ SCREEN TRANSITIONS ============
function transitionToScreen(screenName) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.remove('active'));

  const targetScreen = {
    'login': '#login-screen',
    'mode': '#mode-screen',
    'os': '#os-screen',
    'games': '#games-screen',
  }[screenName];

  if (targetScreen) {
    document.querySelector(targetScreen).classList.add('active');
    appState.currentScreen = screenName;
  }
}

// ============ CLOCK & TIME ============
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });

  const clockEl = document.getElementById('system-clock');
  const dateEl = document.getElementById('system-date');

  if (clockEl) clockEl.textContent = `${hours}:${minutes}`;
  if (dateEl) dateEl.textContent = dayName;
}

function startClockUpdate() {
  setInterval(updateClock, 1000);
}

// ============ APP INITIALIZATION COMPLETE ============
console.log('StudyHub v4 initialized. Password: unblock');
