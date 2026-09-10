// ============ CONFIGURATION & STATE ============

const CONFIG = {
  PASSWORD: 'unblock',
  ANIMATION_DURATION: 300,
  WINDOW_Z_START: 1000,
  DEBOUNCE_DELAY: 150,
};

const STATE = {
  windows: new Map(),
  windowZ: CONFIG.WINDOW_Z_START,
  chatMessages: JSON.parse(localStorage.getItem('studyhub_chat') || '[]'),
  currentMode: null,
  activeWindow: null,
  systemUptime: Date.now(),
};

// ============ UTILITY FUNCTIONS ============

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function createElement(tag, attrs = {}, content = '') {
  const el = document.createElement(tag);
  Object.assign(el, attrs);
  if (content) el.innerHTML = content;
  return el;
}

// ============ SCREEN NAVIGATION ============

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById(screenId);
  if (screen) screen.classList.add('active');
}

// ============ LOGIN HANDLER ============

function initLogin() {
  const loginBtn = document.getElementById('login-btn');
  const passwordInput = document.getElementById('password-input');
  const errorMsg = document.getElementById('error-msg');

  loginBtn.addEventListener('click', handleLoginAttempt);
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLoginAttempt();
  });

  function handleLoginAttempt() {
    const password = passwordInput.value.trim();
    
    if (password === CONFIG.PASSWORD) {
      errorMsg.textContent = '';
      passwordInput.value = '';
      showScreen('mode-screen');
    } else {
      errorMsg.textContent = 'Invalid access code. Try again.';
      passwordInput.select();
      passwordInput.style.animation = 'shake 0.3s';
      setTimeout(() => {
        passwordInput.style.animation = '';
      }, 300);
    }
  }
}

// ============ MODE SELECTION ============

function initModeSelection() {
  const modeCards = document.querySelectorAll('.mode-option');
  
  modeCards.forEach(card => {
    card.addEventListener('click', () => {
      const mode = card.dataset.mode;
      if (mode === 'os') {
        STATE.currentMode = 'os';
        showScreen('os-screen');
        initDesktop();
      } else if (mode === 'games') {
        STATE.currentMode = 'games';
        showScreen('games-screen');
        initGamesMode();
      }
    });
  });
}

// ============ DESKTOP INITIALIZATION ============

function initDesktop() {
  updateSystemClock();
  setInterval(updateSystemClock, 1000);
  
  const sidebarItems = document.querySelectorAll('.menu-item:not(.sidebar-action)');
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const windowType = item.dataset.window;
      openWindow(windowType);
      updateSidebarActive(item);
    });
  });

  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn.addEventListener('click', handleLogout);
}

function updateSystemClock() {
  const now = new Date();
  const clockEl = document.getElementById('system-clock');
  const dateEl = document.getElementById('system-date');
  
  if (clockEl) clockEl.textContent = formatTime(now);
  if (dateEl) dateEl.textContent = formatDate(now);
}

function updateSidebarActive(activeItem) {
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
  });
  activeItem.classList.add('active');
}

function handleLogout() {
  closeAllWindows();
  STATE.windows.clear();
  STATE.activeWindow = null;
  showScreen('mode-screen');
}

// ============ WINDOW MANAGEMENT ============

function openWindow(type) {
  const id = generateId(type);
  const container = document.getElementById('windows-area');
  
  const windowEl = createElement('div', { className: 'window active', id });
  windowEl.style.left = `${120 + Math.random() * 400}px`;
  windowEl.style.top = `${80 + Math.random() * 250}px`;
  windowEl.style.width = type === 'browser' ? '1000px' : '650px';
  windowEl.style.height = type === 'browser' ? '600px' : '500px';
  windowEl.style.zIndex = STATE.windowZ++;

  const content = generateWindowContent(type);
  windowEl.innerHTML = content;
  container.appendChild(windowEl);

  STATE.windows.set(id, windowEl);
  
  makeWindowDraggable(windowEl);
  makeWindowResizable(windowEl);
  setupWindowControls(windowEl, id);
  setupWindowHandlers(windowEl, type);
  updateTaskbar();
}

function generateWindowContent(type) {
  const titleMap = {
    'browser': '🌐 Browser',
    'movies': '🎬 Movies',
    'games': '🎮 Games',
    'chat': '💬 Friends Chat',
    'notes': '📝 Notes',
    'files': '📁 Files',
    'settings': '⚙️ Settings',
    'terminal': '💻 Terminal',
    'apps': '📱 App Store'
  };

  const headerHtml = `
    <div class="window-header" data-movable="true">
      <div class="window-title">${titleMap[type] || 'Window'}</div>
      <div class="window-controls">
        <button class="window-btn window-min" title="Minimize"></button>
        <button class="window-btn window-max" title="Maximize"></button>
        <button class="window-btn window-close" title="Close">✕</button>
      </div>
    </div>
  `;

  let contentHtml = '';

  if (type === 'browser') {
    contentHtml = `
      <div class="window-content">
        <div class="browser-top">
          <input type="text" class="url-input" placeholder="Enter URL (http://example.com)...">
          <button class="go-btn">Go</button>
        </div>
        <div class="browser-frame"><iframe></iframe></div>
      </div>
    `;
  } else if (type === 'movies') {
    contentHtml = `
      <div class="window-content">
        <input type="text" class="movies-search" placeholder="Search movies...">
        <div class="movies-grid"></div>
      </div>
    `;
  } else if (type === 'games') {
    contentHtml = `
      <div class="window-content">
        <input type="text" class="games-search" placeholder="Search games...">
        <div class="games-grid"></div>
      </div>
    `;
  } else if (type === 'chat') {
    contentHtml = `
      <div class="window-content">
        <div class="chat-display"></div>
        <div class="chat-input-box">
          <input type="text" placeholder="Type message...">
          <button>Send</button>
        </div>
      </div>
    `;
  } else if (type === 'notes') {
    contentHtml = `
      <div class="window-content">
        <textarea style="flex: 1; padding: 10px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--text-primary); resize: none; outline: none; font-size: 12px;" placeholder="Write your notes here..."></textarea>
      </div>
    `;
  } else if (type === 'files') {
    contentHtml = `
      <div class="window-content">
        <div style="font-size: 11px; line-height: 2; color: var(--text-secondary);">
          📄 homework.docx<br>
          📊 project-data.xlsx<br>
          🖼️ presentation.pptx<br>
          📝 notes.txt<br>
          📁 Study Materials<br>
          📁 Assignments<br>
          📁 Archived
        </div>
      </div>
    `;
  } else if (type === 'settings') {
    contentHtml = `
      <div class="window-content">
        <div style="font-size: 11px; line-height: 2.2;">
          <div style="color: var(--primary); margin-bottom: 15px; font-weight: 700; text-transform: uppercase;">System</div>
          <div style="color: var(--text-secondary); margin-bottom: 8px;">StudyHub v4.0</div>
          <div style="color: var(--text-secondary); margin-bottom: 15px;">Status: Online ✓</div>
          
          <div style="color: var(--primary); margin-bottom: 15px; font-weight: 700; text-transform: uppercase;">Display</div>
          <div style="color: var(--text-secondary); margin-bottom: 8px;">Theme: Dark Galaxy</div>
          <div style="color: var(--text-secondary); margin-bottom: 15px;">Resolution: Auto</div>
          
          <div style="color: var(--primary); margin-bottom: 15px; font-weight: 700; text-transform: uppercase;">Network</div>
          <div style="color: var(--text-secondary);">Connection: Secure ✓</div>
        </div>
      </div>
    `;
  } else if (type === 'terminal') {
    contentHtml = `
      <div class="window-content">
        <div style="font-size: 11px; font-family: monospace; color: var(--primary); line-height: 1.8;">
          &gt; system initialized<br>
          &gt; all modules loaded<br>
          &gt; network connected<br>
          &gt; ready for input<br>
          <br>
          <span style="color: var(--text-secondary);">Type commands here...</span>
        </div>
      </div>
    `;
  } else if (type === 'apps') {
    contentHtml = `
      <div class="window-content">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 11px;">
          <div style="padding: 12px; background: rgba(0,217,255,0.1); border-radius: 6px; text-align: center; cursor: pointer;">
            📚 Study Tools
          </div>
          <div style="padding: 12px; background: rgba(0,217,255,0.1); border-radius: 6px; text-align: center; cursor: pointer;">
            🎯 Focus Timer
          </div>
          <div style="padding: 12px; background: rgba(0,217,255,0.1); border-radius: 6px; text-align: center; cursor: pointer;">
            📈 Analytics
          </div>
          <div style="padding: 12px; background: rgba(0,217,255,0.1); border-radius: 6px; text-align: center; cursor: pointer;">
            🔔 Notifications
          </div>
        </div>
      </div>
    `;
  }

  return headerHtml + contentHtml;
}

function makeWindowDraggable(windowEl) {
  const header = windowEl.querySelector('.window-header');
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let isDragging = false;

  header.onmousedown = (e) => {
    if (e.target.classList.contains('window-btn')) return;
    isDragging = true;
    windowEl.classList.add('active');
    windowEl.style.zIndex = STATE.windowZ++;
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = dragElement;
  };

  function dragElement(e) {
    if (!isDragging) return;
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    windowEl.style.top = (windowEl.offsetTop - pos2) + 'px';
    windowEl.style.left = (windowEl.offsetLeft - pos1) + 'px';
  }

  function stopDragging() {
    isDragging = false;
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function makeWindowResizable(windowEl) {
  const resizeHandle = createElement('div', { 
    style: 'position: absolute; bottom: 0; right: 0; width: 20px; height: 20px; cursor: se-resize; z-index: 9999;' 
  });
  windowEl.appendChild(resizeHandle);

  let isResizing = false;
  let startX, startY, startWidth, startHeight;

  resizeHandle.onmousedown = (e) => {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = windowEl.offsetWidth;
    startHeight = windowEl.offsetHeight;
    document.onmousemove = resizeElement;
    document.onmouseup = stopResizing;
  };

  function resizeElement(e) {
    if (!isResizing) return;
    windowEl.style.width = (startWidth + (e.clientX - startX)) + 'px';
    windowEl.style.height = (startHeight + (e.clientY - startY)) + 'px';
  }

  function stopResizing() {
    isResizing = false;
    document.onmousemove = null;
    document.onmouseup = null;
  }
}

function setupWindowControls(windowEl, windowId) {
  const closeBtn = windowEl.querySelector('.window-close');
  closeBtn.addEventListener('click', () => {
    windowEl.style.animation = 'fadeOut 0.3s';
    setTimeout(() => {
      windowEl.remove();
      STATE.windows.delete(windowId);
      updateTaskbar();
    }, 300);
  });
}

function setupWindowHandlers(windowEl, type) {
  if (type === 'browser') setupBrowser(windowEl);
  if (type === 'movies') setupMovies(windowEl);
  if (type === 'games') setupGames(windowEl);
  if (type === 'chat') setupChat(windowEl);
}

function setupBrowser(windowEl) {
  const urlInput = windowEl.querySelector('.url-input');
  const goBtn = windowEl.querySelector('.go-btn');
  const iframe = windowEl.querySelector('iframe');

  const loadUrl = () => {
    let url = urlInput.value.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }
    iframe.src = `/proxy.html?url=${encodeURIComponent(url)}`;
  };

  goBtn.addEventListener('click', loadUrl);
  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loadUrl();
  });
}

function setupMovies(windowEl) {
  const searchInput = windowEl.querySelector('.movies-search');
  const grid = windowEl.querySelector('.movies-grid');

  const movies = [
    { icon: '🎬', name: 'Tubi', url: 'https://www.tubi.tv' },
    { icon: '📺', name: 'Pluto TV', url: 'https://www.plutotv.com' },
    { icon: '🎥', name: 'YouTube Free', url: 'https://youtube.com' },
    { icon: '📽️', name: 'Internet Archive', url: 'https://archive.org/details/movies' },
    { icon: '🎭', name: 'Public Domain', url: 'https://www.publicdomainreview.org' },
    { icon: '🎪', name: 'Kanopy', url: 'https://www.kanopy.com' },
    { icon: '🎞️', name: 'Hoopla', url: 'https://www.hoopladigital.com' },
    { icon: '🍿', name: 'Plex', url: 'https://www.plex.tv' },
  ];

  const render = (filter = '') => {
    grid.innerHTML = movies
      .filter(m => m.name.toLowerCase().includes(filter.toLowerCase()))
      .map(m => `
        <div class="movie-item" onclick="window.open('${m.url}', '_blank')">
          <div>${m.icon}</div>
          <div>${m.name}</div>
        </div>
      `)
      .join('');
  };

  render();
  searchInput.addEventListener('input', debounce((e) => render(e.target.value), CONFIG.DEBOUNCE_DELAY));
}

function setupGames(windowEl) {
  const searchInput = windowEl.querySelector('.games-search');
  const grid = windowEl.querySelector('.games-grid');
  const games = getGamesList();

  const render = (filter = '') => {
    grid.innerHTML = games
      .filter(g => g.toLowerCase().includes(filter.toLowerCase()))
      .map(g => `<div class="game-item">${g}</div>`)
      .join('');
  };

  render();
  searchInput.addEventListener('input', debounce((e) => render(e.target.value), CONFIG.DEBOUNCE_DELAY));
}

function setupChat(windowEl) {
  const display = windowEl.querySelector('.chat-display');
  const input = windowEl.querySelector('input');
  const sendBtn = windowEl.querySelector('button');

  const render = () => {
    display.innerHTML = STATE.chatMessages
      .map(msg => `
        <div class="chat-line">
          <div class="chat-author">${msg.author}</div>
          <div>${msg.text}</div>
        </div>
      `)
      .join('');
    display.scrollTop = display.scrollHeight;
  };

  const send = () => {
    if (!input.value.trim()) return;
    STATE.chatMessages.push({
      author: 'You',
      text: input.value.trim()
    });
    localStorage.setItem('studyhub_chat', JSON.stringify(STATE.chatMessages));
    input.value = '';
    render();
  };

  render();
  sendBtn.addEventListener('click', send);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') send();
  });
}

function updateTaskbar() {
  const taskbarApps = document.getElementById('taskbar-apps');
  taskbarApps.innerHTML = '';

  STATE.windows.forEach((windowEl, id) => {
    const title = windowEl.querySelector('.window-title').textContent;
    const item = createElement('div', { className: 'taskbar-app active' });
    item.textContent = title;
    item.addEventListener('click', () => {
      windowEl.style.zIndex = STATE.windowZ++;
      windowEl.classList.add('active');
    });
    taskbarApps.appendChild(item);
  });
}

function closeAllWindows() {
  STATE.windows.forEach(windowEl => windowEl.remove());
  STATE.windows.clear();
  updateTaskbar();
}

// ============ GAMES MODE ============

function initGamesMode() {
  const grid = document.getElementById('games-grid');
  const searchInput = document.getElementById('games-search');
  const games = getGamesList();

  const render = (filter = '') => {
    grid.innerHTML = games
      .filter(g => g.toLowerCase().includes(filter.toLowerCase()))
      .map(g => `
        <div class="game-card">
          <div class="game-icon">🎮</div>
          <div>${g}</div>
        </div>
      `)
      .join('');
  };

  render();
  searchInput.addEventListener('input', debounce((e) => render(e.target.value), CONFIG.DEBOUNCE_DELAY));
  
  const backBtn = document.getElementById('games-back');
  backBtn.addEventListener('click', () => {
    showScreen('mode-screen');
  });
}

function getGamesList() {
  return [
    '2048', 'Cookie Clicker', 'Flappy Bird', 'Dino Runner', 'Pac-Man', 'Snake',
    'Tetris', 'Breakout', 'Space Invaders', 'Pong', 'Minesweeper', 'Sudoku',
    'Chess', 'Checkers', 'Memory Game', 'Tic-Tac-Toe', 'Geometry Dash', 'Jump King',
    'Crossy Road', 'Krunker.io', 'Agar.io', 'Slither.io', 'Wordle', 'Hangman',
    'Platformer Quest', 'Racing Legends', 'Shooting Gallery', 'Puzzle Blast',
    'Adventure Time', 'Multiplayer Arena', 'Basketball Stars', 'Soccer Physics'
  ];
}

// ============ INITIALIZATION ============

document.addEventListener('DOMContentLoaded', () => {
  initLogin();
  initModeSelection();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
});
