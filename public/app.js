// ============ CONFIGURATION & STATE ============

const CONFIG = {
  PASSWORD: 'unblock',
  ANIMATION_DURATION: 300,
  WINDOW_Z_START: 1000,
  DEBOUNCE_DELAY: 150,
  MAX_WINDOWS: 15,
};

const STATE = {
  windows: new Map(),
  windowZ: CONFIG.WINDOW_Z_START,
  chatMessages: JSON.parse(localStorage.getItem('studyhub_chat') || '[]'),
  currentMode: null,
  activeWindow: null,
  systemUptime: Date.now(),
  isDragging: false,
  isResizing: false,
  dragData: { pos1: 0, pos2: 0, pos3: 0, pos4: 0 },
  resizeData: { startX: 0, startY: 0, startWidth: 0, startHeight: 0 },
  appInstances: {},
};

// ============ UTILITY FUNCTIONS ============

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

function throttle(func, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
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

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getRandomPosition() {
  return {
    x: 120 + Math.random() * 400,
    y: 80 + Math.random() * 250
  };
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
      addChatSystemMessage('System', 'Login successful. Welcome to StudyHub v4');
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

  addChatSystemMessage('System', 'Desktop initialized. Open apps from sidebar.');
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
  STATE.chatMessages = [];
  localStorage.removeItem('studyhub_chat');
  showScreen('mode-screen');
}

// ============ WINDOW MANAGEMENT ============

function openWindow(type) {
  if (STATE.windows.size >= CONFIG.MAX_WINDOWS) {
    alert('Maximum windows open. Close some first.');
    return;
  }

  const id = generateId(type);
  const container = document.getElementById('windows-area');
  const emptyState = document.getElementById('workspace-empty');
  
  if (emptyState) emptyState.style.display = 'none';
  
  const windowEl = createElement('div', { className: 'window active', id });
  const pos = getRandomPosition();
  windowEl.style.left = `${pos.x}px`;
  windowEl.style.top = `${pos.y}px`;
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
  
  addChatSystemMessage('System', `Opened ${getWindowTitle(type)}`);
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
    'apps': '📱 App Store',
    'music': '🎵 Music',
    'clock': '⏰ Clock',
    'calendar': '📅 Calendar'
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
        <textarea style="flex: 1; padding: 10px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--text-primary); resize: none; outline: none; font-size: 12px;" placeholder="Write your notes here..." data-note-id="${generateId('note')}"></textarea>
      </div>
    `;
  } else if (type === 'files') {
    contentHtml = `
      <div class="window-content">
        <div style="font-size: 11px; line-height: 2; color: var(--text-secondary);">
          <div style="cursor: pointer; padding: 8px; border-radius: 4px; transition: all 0.2s;">
            📄 homework.docx
          </div>
          <div style="cursor: pointer; padding: 8px; border-radius: 4px; transition: all 0.2s;">
            📊 project-data.xlsx
          </div>
          <div style="cursor: pointer; padding: 8px; border-radius: 4px; transition: all 0.2s;">
            🖼️ presentation.pptx
          </div>
          <div style="cursor: pointer; padding: 8px; border-radius: 4px; transition: all 0.2s;">
            📝 notes.txt
          </div>
          <div style="cursor: pointer; padding: 8px; border-radius: 4px; transition: all 0.2s; color: var(--primary); font-weight: 700;">
            📁 Study Materials
          </div>
          <div style="cursor: pointer; padding: 8px; border-radius: 4px; transition: all 0.2s; color: var(--primary); font-weight: 700;">
            📁 Assignments
          </div>
          <div style="cursor: pointer; padding: 8px; border-radius: 4px; transition: all 0.2s; color: var(--primary); font-weight: 700;">
            📁 Archived
          </div>
        </div>
      </div>
    `;
  } else if (type === 'settings') {
    contentHtml = `
      <div class="window-content">
        <div style="font-size: 11px; line-height: 2.4;">
          <div style="color: var(--primary); margin-bottom: 15px; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid rgba(0,217,255,0.2); padding-bottom: 10px;">System</div>
          <div style="color: var(--text-secondary); margin-bottom: 6px;">StudyHub v4.0</div>
          <div style="color: var(--text-secondary); margin-bottom: 6px;">Status: Online ✓</div>
          <div style="color: var(--text-secondary); margin-bottom: 15px;">Uptime: ${Math.floor((Date.now() - STATE.systemUptime) / 1000)}s</div>
          
          <div style="color: var(--primary); margin-bottom: 15px; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid rgba(0,217,255,0.2); padding-bottom: 10px;">Display</div>
          <div style="color: var(--text-secondary); margin-bottom: 6px;">Theme: Dark Galaxy</div>
          <div style="color: var(--text-secondary); margin-bottom: 6px;">Resolution: Auto</div>
          <div style="color: var(--text-secondary); margin-bottom: 15px;">Brightness: 100%</div>
          
          <div style="color: var(--primary); margin-bottom: 15px; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid rgba(0,217,255,0.2); padding-bottom: 10px;">Network</div>
          <div style="color: var(--text-secondary); margin-bottom: 6px;">Connection: Secure ✓</div>
          <div style="color: var(--text-secondary);">Speed: Fast (42ms)</div>
        </div>
      </div>
    `;
  } else if (type === 'terminal') {
    contentHtml = `
      <div class="window-content">
        <div style="font-size: 11px; font-family: 'Monaco', monospace; color: var(--primary); line-height: 1.8; overflow-y: auto;">
          <div>&gt; system initialized at ${new Date().toLocaleTimeString()}</div>
          <div>&gt; all modules loaded</div>
          <div>&gt; network connected (secure)</div>
          <div>&gt; desktop environment active</div>
          <div>&gt; window manager ready</div>
          <div>&gt; ready for input</div>
          <br>
          <div style="color: var(--text-secondary);">type 'help' for commands...</div>
          <div style="margin-top: 10px;">
            <input type="text" style="width: 100%; padding: 6px; background: rgba(0,0,0,0.6); border: 1px solid var(--primary); border-radius: 4px; color: var(--primary); font-family: 'Monaco', monospace; outline: none;" placeholder="Enter command...">
          </div>
        </div>
      </div>
    `;
  } else if (type === 'apps') {
    contentHtml = `
      <div class="window-content">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 11px;">
          <div style="padding: 12px; background: rgba(0,217,255,0.1); border-radius: 6px; text-align: center; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(0,217,255,0.2)';" onmouseout="this.style.background='rgba(0,217,255,0.1)';">
            📚 Study Tools
          </div>
          <div style="padding: 12px; background: rgba(0,217,255,0.1); border-radius: 6px; text-align: center; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(0,217,255,0.2)';" onmouseout="this.style.background='rgba(0,217,255,0.1)';">
            🎯 Focus Timer
          </div>
          <div style="padding: 12px; background: rgba(0,217,255,0.1); border-radius: 6px; text-align: center; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(0,217,255,0.2)';" onmouseout="this.style.background='rgba(0,217,255,0.1)';">
            📈 Analytics
          </div>
          <div style="padding: 12px; background: rgba(0,217,255,0.1); border-radius: 6px; text-align: center; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(0,217,255,0.2)';" onmouseout="this.style.background='rgba(0,217,255,0.1)';">
            🔔 Notifications
          </div>
          <div style="padding: 12px; background: rgba(0,217,255,0.1); border-radius: 6px; text-align: center; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(0,217,255,0.2)';" onmouseout="this.style.background='rgba(0,217,255,0.1)';">
            🎨 Themes
          </div>
          <div style="padding: 12px; background: rgba(0,217,255,0.1); border-radius: 6px; text-align: center; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(0,217,255,0.2)';" onmouseout="this.style.background='rgba(0,217,255,0.1)';">
            🔧 Tools
          </div>
        </div>
      </div>
    `;
  } else if (type === 'music') {
    contentHtml = `
      <div class="window-content">
        <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
          <div style="font-size: 48px; margin-bottom: 20px;">🎵</div>
          <div style="font-size: 12px; margin-bottom: 20px;">Music Player</div>
          <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 20px;">
            <button style="padding: 8px 12px; background: rgba(0,217,255,0.1); border: 1px solid rgba(0,217,255,0.3); border-radius: 4px; cursor: pointer; color: var(--primary);">⏮</button>
            <button style="padding: 8px 12px; background: var(--primary); border: none; border-radius: 4px; cursor: pointer; color: var(--bg-darkest); font-weight: 700;">▶</button>
            <button style="padding: 8px 12px; background: rgba(0,217,255,0.1); border: 1px solid rgba(0,217,255,0.3); border-radius: 4px; cursor: pointer; color: var(--primary);">⏭</button>
          </div>
          <div style="font-size: 10px; color: var(--text-dimmed);">No song playing</div>
        </div>
      </div>
    `;
  } else if (type === 'clock') {
    contentHtml = `
      <div class="window-content" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="font-size: 64px; font-weight: 700; color: var(--primary); font-family: 'Monaco', monospace; letter-spacing: 4px; margin-bottom: 20px;" id="clock-display">00:00</div>
        <div style="font-size: 14px; color: var(--text-secondary);" id="clock-date"></div>
        <div style="margin-top: 30px; width: 100%; padding-top: 20px; border-top: 1px solid rgba(0,217,255,0.2);">
          <div style="font-size: 11px; color: var(--primary); margin-bottom: 12px; text-transform: uppercase; font-weight: 700;">Timers</div>
          <div style="display: flex; gap: 8px;">
            <input type="number" min="1" max="60" value="5" style="width: 50px; padding: 6px; background: rgba(0,0,0,0.4); border: 1px solid rgba(0,217,255,0.3); border-radius: 4px; color: var(--text-primary); font-size: 11px;">
            <button style="flex: 1; padding: 6px; background: var(--primary); border: none; border-radius: 4px; color: var(--bg-darkest); font-weight: 700; font-size: 11px; cursor: pointer;">Start Timer</button>
          </div>
        </div>
      </div>
    `;
  } else if (type === 'calendar') {
    contentHtml = `
      <div class="window-content">
        <div style="font-size: 11px; color: var(--text-secondary); line-height: 1.8;">
          <div style="color: var(--primary); margin-bottom: 12px; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid rgba(0,217,255,0.2); padding-bottom: 8px;">Today</div>
          <div style="margin-bottom: 6px;">${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          <div style="margin-bottom: 20px; color: var(--text-dimmed);">No events</div>
          
          <div style="color: var(--primary); margin-bottom: 12px; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid rgba(0,217,255,0.2); padding-bottom: 8px;">Upcoming</div>
          <div style="margin-bottom: 8px;">• Monday - Study Session</div>
          <div style="margin-bottom: 8px;">• Wednesday - Project Due</div>
          <div>• Friday - Review Test</div>
        </div>
      </div>
    `;
  }

  return headerHtml + contentHtml;
}

function getWindowTitle(type) {
  const titles = {
    'browser': '🌐 Browser',
    'movies': '🎬 Movies',
    'games': '🎮 Games',
    'chat': '💬 Friends Chat',
    'notes': '📝 Notes',
    'files': '📁 Files',
    'settings': '⚙️ Settings',
    'terminal': '💻 Terminal',
    'apps': '📱 App Store',
    'music': '🎵 Music',
    'clock': '⏰ Clock',
    'calendar': '📅 Calendar'
  };
  return titles[type] || 'Window';
}

function setupWindowControls(windowEl, windowId) {
  const closeBtn = windowEl.querySelector('.window-close');
  const minBtn = windowEl.querySelector('.window-min');
  const maxBtn = windowEl.querySelector('.window-max');

  closeBtn.addEventListener('click', () => {
    windowEl.style.animation = 'fadeOut 0.3s';
    setTimeout(() => {
      windowEl.remove();
      STATE.windows.delete(windowId);
      updateTaskbar();
      
      const emptyState = document.getElementById('workspace-empty');
      if (emptyState && STATE.windows.size === 0) {
        emptyState.style.display = 'flex';
      }
    }, 300);
  });

  minBtn.addEventListener('click', () => {
    windowEl.style.display = windowEl.style.display === 'none' ? 'flex' : 'none';
  });

  maxBtn.addEventListener('click', () => {
    const isMaxed = windowEl.dataset.maxed === 'true';
    if (isMaxed) {
      windowEl.style.width = windowEl.dataset.prevWidth;
      windowEl.style.height = windowEl.dataset.prevHeight;
      windowEl.style.left = windowEl.dataset.prevLeft;
      windowEl.style.top = windowEl.dataset.prevTop;
      windowEl.dataset.maxed = 'false';
    } else {
      windowEl.dataset.prevWidth = windowEl.style.width;
      windowEl.dataset.prevHeight = windowEl.style.height;
      windowEl.dataset.prevLeft = windowEl.style.left;
      windowEl.dataset.prevTop = windowEl.style.top;
      windowEl.style.width = '100%';
      windowEl.style.height = '100%';
      windowEl.style.left = '0';
      windowEl.style.top = '0';
      windowEl.dataset.maxed = 'true';
    }
  });
}

function setupWindowHandlers(windowEl, type) {
  if (type === 'browser') setupBrowser(windowEl);
  if (type === 'movies') setupMovies(windowEl);
  if (type === 'games') setupGames(windowEl);
  if (type === 'chat') setupChat(windowEl);
  if (type === 'clock') setupClock(windowEl);
  if (type === 'notes') setupNotes(windowEl);
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
        <div class="movie-item" onclick="window.open('${m.url}', '_blank')" style="cursor: pointer;">
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
      .map(g => `<div class="game-item" style="cursor: pointer;">${g}</div>`)
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
          <div class="chat-author">${escapeHtml(msg.author)}</div>
          <div>${escapeHtml(msg.text)}</div>
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

function setupClock(windowEl) {
  const clockDisplay = windowEl.querySelector('#clock-display');
  const clockDate = windowEl.querySelector('#clock-date');

  const updateClock = () => {
    const now = new Date();
    clockDisplay.textContent = formatTime(now);
    clockDate.textContent = formatDate(now);
  };

  updateClock();
  setInterval(updateClock, 1000);
}

function setupNotes(windowEl) {
  const textarea = windowEl.querySelector('textarea');
  const noteId = textarea.dataset.noteId;

  const saved = localStorage.getItem(`note-${noteId}`);
  if (saved) textarea.value = saved;

  textarea.addEventListener('input', debounce(() => {
    localStorage.setItem(`note-${noteId}`, textarea.value);
  }, 500));
}

function makeWindowDraggable(windowEl) {
  const header = windowEl.querySelector('.window-header');
  
  header.onmousedown = (e) => {
    if (e.target.classList.contains('window-btn')) return;
    
    STATE.isDragging = true;
    windowEl.classList.add('active');
    windowEl.style.zIndex = STATE.windowZ++;
    
    STATE.dragData.pos3 = e.clientX;
    STATE.dragData.pos4 = e.clientY;
    
    document.onmouseup = stopDragging;
    document.onmousemove = dragElement;
  };

  function dragElement(e) {
    if (!STATE.isDragging) return;
    
    STATE.dragData.pos1 = STATE.dragData.pos3 - e.clientX;
    STATE.dragData.pos2 = STATE.dragData.pos4 - e.clientY;
    STATE.dragData.pos3 = e.clientX;
    STATE.dragData.pos4 = e.clientY;
    
    const newTop = windowEl.offsetTop - STATE.dragData.pos2;
    const newLeft = windowEl.offsetLeft - STATE.dragData.pos1;
    
    windowEl.style.top = clamp(newTop, 0, window.innerHeight - 100) + 'px';
    windowEl.style.left = clamp(newLeft, 0, window.innerWidth - 100) + 'px';
  }

  function stopDragging() {
    STATE.isDragging = false;
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function makeWindowResizable(windowEl) {
  const resizeHandle = createElement('div', { 
    style: 'position: absolute; bottom: 0; right: 0; width: 20px; height: 20px; cursor: se-resize; z-index: 9999;' 
  });
  windowEl.appendChild(resizeHandle);

  resizeHandle.onmousedown = (e) => {
    STATE.isResizing = true;
    STATE.resizeData.startX = e.clientX;
    STATE.resizeData.startY = e.clientY;
    STATE.resizeData.startWidth = windowEl.offsetWidth;
    STATE.resizeData.startHeight = windowEl.offsetHeight;
    
    document.onmousemove = resizeElement;
    document.onmouseup = stopResizing;
  };

  function resizeElement(e) {
    if (!STATE.isResizing) return;
    
    const newWidth = clamp(
      STATE.resizeData.startWidth + (e.clientX - STATE.resizeData.startX),
      300,
      window.innerWidth - windowEl.offsetLeft
    );
    const newHeight = clamp(
      STATE.resizeData.startHeight + (e.clientY - STATE.resizeData.startY),
      200,
      window.innerHeight - windowEl.offsetTop
    );
    
    windowEl.style.width = newWidth + 'px';
    windowEl.style.height = newHeight + 'px';
  }

  function stopResizing() {
    STATE.isResizing = false;
    document.onmousemove = null;
    document.onmouseup = null;
  }
}

function updateTaskbar() {
  const taskbarApps = document.getElementById('taskbar-apps');
  const divider = taskbarApps.querySelector('.taskbar-divider-left');
  
  const existingApps = taskbarApps.querySelectorAll('.taskbar-app');
  existingApps.forEach(app => app.remove());

  STATE.windows.forEach((windowEl, id) => {
    const title = windowEl.querySelector('.window-title').textContent;
    const item = createElement('div', { className: 'taskbar-app active' });
    item.textContent = title;
    item.addEventListener('click', () => {
      windowEl.style.zIndex = STATE.windowZ++;
      windowEl.classList.add('active');
      if (windowEl.style.display === 'none') {
        windowEl.style.display = 'flex';
      }
    });
    taskbarApps.appendChild(item);
  });
}

function closeAllWindows() {
  STATE.windows.forEach(windowEl => {
    windowEl.style.animation = 'fadeOut 0.2s';
    setTimeout(() => windowEl.remove(), 200);
  });
  STATE.windows.clear();
  updateTaskbar();
}

// ============ GAMES MODE ============

function initGamesMode() {
  const grid = document.getElementById('games-grid');
  const searchInput = document.getElementById('games-search');
  const searchClear = document.getElementById('search-clear');
  const games = getGamesList();

  const render = (filter = '') => {
    const filtered = games.filter(g => g.toLowerCase().includes(filter.toLowerCase()));
    
    if (filtered.length === 0) {
      grid.innerHTML = '';
      document.getElementById('games-empty').style.display = 'block';
    } else {
      grid.innerHTML = filtered
        .map(g => `
          <div class="game-card" style="cursor: pointer;">
            <div class="game-icon">🎮</div>
            <div>${g}</div>
          </div>
        `)
        .join('');
      document.getElementById('games-empty').style.display = 'none';
    }
    
    document.getElementById('game-count').textContent = filtered.length;
  };

  render();
  
  searchInput.addEventListener('input', debounce((e) => {
    render(e.target.value);
    searchClear.style.display = e.target.value ? 'block' : 'none';
  }, CONFIG.DEBOUNCE_DELAY));

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.style.display = 'none';
    render('');
  });
  
  const backBtn = document.getElementById('games-back');
  backBtn.addEventListener('click', () => {
    showScreen('mode-screen');
  });

  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      render(searchInput.value);
    });
  });
}

function getGamesList() {
  return [
    '2048', 'Cookie Clicker', 'Flappy Bird', 'Dino Runner', 'Pac-Man', 'Snake',
    'Tetris', 'Breakout', 'Space Invaders', 'Pong', 'Minesweeper', 'Sudoku',
    'Chess', 'Checkers', 'Memory Game', 'Tic-Tac-Toe', 'Geometry Dash', 'Jump King',
    'Crossy Road', 'Krunker.io', 'Agar.io', 'Slither.io', 'Wordle', 'Hangman',
    'Platformer Quest', 'Racing Legends', 'Shooting Gallery', 'Puzzle Blast',
    'Adventure Time', 'Multiplayer Arena', 'Basketball Stars', 'Soccer Physics',
    'Stickman Fight', 'Temple Run', 'Subway Surfers', 'Candy Crush', 'Angry Birds',
    'Super Mario', 'Zelda Quest', 'Sonic Dash', 'PacMan Battle', 'Crazy Cars'
  ];
}

// ============ CHAT SYSTEM ============

function addChatSystemMessage(author, text) {
  STATE.chatMessages.push({ author, text });
  localStorage.setItem('studyhub_chat', JSON.stringify(STATE.chatMessages));
}

// ============ UTILITY HELPERS ============

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============ SERVICE WORKER ============

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      console.log('Service worker registration skipped');
    });
  }
}

// ============ INITIALIZATION ============

document.addEventListener('DOMContentLoaded', () => {
  initLogin();
  initModeSelection();
  registerServiceWorker();

  // Prevent right-click context menu (optional)
  document.addEventListener('contextmenu', (e) => {
    // Uncomment to disable right-click
    // e.preventDefault();
  });

  // Prevent text selection on UI elements
  document.addEventListener('selectstart', (e) => {
    if (e.target.classList.contains('no-select') || 
        e.target.closest('.window-header') ||
        e.target.closest('.sidebar')) {
      e.preventDefault();
    }
  });
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  localStorage.setItem('studyhub_chat', JSON.stringify(STATE.chatMessages));
});
