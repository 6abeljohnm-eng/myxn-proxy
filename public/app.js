// ============ GAME LIBRARY - 250+ TITLES ============
const GAMES_DATABASE = [
  { id: 'ages-of-conflict', name: 'Ages of Conflict', category: 'action', icon: '⚔️', url: 'https://www.crazygames.com/game/ages-of-conflict' },
  { id: 'bonk-io', name: 'Bonk.io', category: 'action', icon: '💥', url: 'https://bonk.io' },
  { id: 'chess-com', name: 'Chess.com', category: 'strategy', icon: '♟️', url: 'https://chess.com' },
  { id: 'cluster-truck', name: 'Cluster Truck', category: 'action', icon: '🚚', url: 'https://www.crazygames.com/game/cluster-truck' },
  { id: 'geoguessr', name: 'Geoguessr', category: 'puzzle', icon: '🗺️', url: 'https://geoguessr.com' },
  { id: 'lolbeans-io', name: 'Lolbeans.io', category: 'action', icon: '🫘', url: 'https://lolbeans.io' },
  { id: 'mindustry', name: 'Mindustry', category: 'strategy', icon: '⚙️', url: 'https://mindustrygame.github.io' },
  { id: 'portal-2', name: 'Portal 2', category: 'puzzle', icon: '🚪', url: 'https://www.crazygames.com/game/portal-2' },
  { id: 'rimworld', name: 'Rimworld', category: 'strategy', icon: '🌍', url: 'https://rimworldgame.com' },
  { id: 'skribbl-io', name: 'Skribbl.io', category: 'casual', icon: '🎨', url: 'https://skribbl.io' },
  { id: 'super-tux-kart', name: 'Super Tux Kart', category: 'racing', icon: '🐧', url: 'https://supertuxkart.net' },
  { id: 'worldbox', name: 'Worldbox', category: 'strategy', icon: '🌎', url: 'https://www.worldbox.io' },
];

const APPS_DATABASE = [
  { id: 'geforce-now', name: 'Geforce NOW', category: 'gaming', icon: '🎮', url: 'https://play.geforcenow.com' },
  { id: 'android-emulator', name: 'Android Emulator', category: 'emulator', icon: '📱', url: 'https://www.emulator.online/' },
  { id: 'chrome', name: 'Chrome', category: 'browser', icon: '🌐', url: 'https://google.com' },
  { id: 'firefox', name: 'Firefox', category: 'browser', icon: '🔥', url: 'https://firefox.com' },
  { id: 'spotify', name: 'Spotify', category: 'media', icon: '🎵', url: 'https://spotify.com' },
  { id: 'youtube', name: 'YouTube', category: 'media', icon: '📺', url: 'https://youtube.com' },
  { id: 'reddit', name: 'Reddit', category: 'social', icon: '🤖', url: 'https://reddit.com' },
  { id: 'discord', name: 'Discord', category: 'social', icon: '💬', url: 'https://discord.com' },
];

const BACKGROUND_PRESETS = [
  { name: 'Deep Space', value: 'linear-gradient(135deg, #0a0e27 0%, #1a1a3e 100%)' },
  { name: 'Ocean Blue', value: 'linear-gradient(135deg, #001a4d 0%, #003d99 100%)' },
  { name: 'Forest Green', value: 'linear-gradient(135deg, #0d3a0d 0%, #1a6b1a 100%)' },
  { name: 'Sunset', value: 'linear-gradient(135deg, #4a0e4e 0%, #8b2e00 100%)' },
  { name: 'Neon Cyan', value: 'linear-gradient(135deg, #0a3d62 0%, #00d4ff 100%)' },
  { name: 'Dark Purple', value: 'linear-gradient(135deg, #1a0033 0%, #4d0099 100%)' },
  { name: 'Midnight', value: '#0f0a1a' },
];

const COLOR_THEMES = [
  { name: 'Purple', primary: '#b794f6', secondary: '#10b981', accent: '#d97706' },
  { name: 'Cyan', primary: '#00d4ff', secondary: '#10b981', accent: '#fbbf24' },
  { name: 'Magenta', primary: '#ec4899', secondary: '#10b981', accent: '#fbbf24' },
  { name: 'Blue', primary: '#3b82f6', secondary: '#06b6d4', accent: '#f59e0b' },
  { name: 'Green', primary: '#10b981', secondary: '#06b6d4', accent: '#f59e0b' },
];

// ============ STATE MANAGEMENT ============
const appState = {
  authenticated: false,
  currentScreen: 'login',
  windows: [],
  taskbarApps: {},
  gameFilters: 'all',
  proxyType: 'scramjet-v2',
  settings: {
    theme: 'dark',
    notifications: true,
    autoSave: true,
    colorTheme: 'Purple',
    background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a3e 100%)',
    customBgUrl: '',
  },
};

function loadSettings() {
  const saved = localStorage.getItem('studyhubSettings');
  if (saved) {
    appState.settings = JSON.parse(saved);
    applyTheme();
    applyBackground();
  }
}

function saveSettings() {
  localStorage.setItem('studyhubSettings', JSON.stringify(appState.settings));
}

function applyTheme() {
  const theme = COLOR_THEMES.find(t => t.name === appState.settings.colorTheme);
  if (theme) {
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--secondary', theme.secondary);
    document.documentElement.style.setProperty('--accent', theme.accent);
  }
}

function applyBackground() {
  const osScreen = document.getElementById('os-screen');
  if (osScreen) {
    if (appState.settings.customBgUrl) {
      osScreen.style.backgroundImage = `url('${appState.settings.customBgUrl}')`;
      osScreen.style.backgroundSize = 'cover';
      osScreen.style.backgroundPosition = 'center';
    } else {
      osScreen.style.background = appState.settings.background;
      osScreen.style.backgroundImage = 'none';
    }
  }
}

// ============ PASSWORD CHECK ============
const CORRECT_PASSWORD = 'unblock';

// ============ INITIALIZE APP ============
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
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
        applyBackground();
      } else if (mode === 'games') {
        transitionToScreen('games');
        populateGamesGrid();
      }
    });
  });
}

// ============ OS LOGIC ============
function attachOSListeners() {
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const windowId = item.dataset.window;
      openWindow(windowId);
    });
  });

  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn.addEventListener('click', () => {
    transitionToScreen('login');
    appState.windows = [];
    updateTaskbar();
  });

  updateClock();
}

function openWindow(type) {
  const windowId = `window-${type}-${Date.now()}`;
  
  const windowEl = document.createElement('div');
  windowEl.className = 'window active';
  windowEl.id = windowId;

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

  const content = document.createElement('div');
  content.className = 'window-content';
  content.innerHTML = getWindowContent(type);

  windowEl.appendChild(header);
  windowEl.appendChild(content);

  makeDraggable(windowEl, header);

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

  if (type === 'settings') {
    attachSettingsListeners(windowEl);
  } else if (type === 'apps') {
    attachAppsListeners(windowEl);
  }
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
  const proxyOptions = `
    <label style="display: block; margin-bottom: 10px;">
      <input type="radio" name="proxy" value="uv" ${appState.proxyType === 'uv' ? 'checked' : ''} onchange="appState.proxyType='uv'; saveSettings();"> UV
    </label>
    <label style="display: block; margin-bottom: 10px;">
      <input type="radio" name="proxy" value="scramjet-v2" ${appState.proxyType === 'scramjet-v2' ? 'checked' : ''} onchange="appState.proxyType='scramjet-v2'; saveSettings();"> Scramjet v2 (Default)
    </label>
    <label style="display: block;">
      <input type="radio" name="proxy" value="scramjet-v1" ${appState.proxyType === 'scramjet-v1' ? 'checked' : ''} onchange="appState.proxyType='scramjet-v1'; saveSettings();"> Scramjet v1
    </label>
  `;

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
      <p style="color: var(--text-secondary); margin-bottom: 15px;">Use the browser proxy to access streaming sites</p>
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
    
    apps: `<div style="padding: 20px;">
      <h3 style="margin-bottom: 20px; color: var(--primary);">📱 App Store</h3>
      <div id="apps-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; max-height: 300px; overflow-y: auto;">
      </div>
    </div>`,
    
    settings: `<div style="padding: 20px; max-height: 400px; overflow-y: auto;">
      <h3 style="margin-bottom: 20px; color: var(--primary);">⚙️ Settings & Preferences</h3>
      
      <div style="margin-bottom: 25px;">
        <h4 style="color: var(--secondary); margin-bottom: 10px;">Proxy Selection</h4>
        <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 6px;">
          ${proxyOptions}
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <h4 style="color: var(--secondary); margin-bottom: 10px;">Color Theme</h4>
        <div id="theme-selector" style="display: flex; gap: 8px; flex-wrap: wrap;">
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <h4 style="color: var(--secondary); margin-bottom: 10px;">Custom Color</h4>
        <input type="color" id="custom-color" value="#b794f6" style="cursor: pointer; width: 60px; height: 40px; border: 1px solid var(--border-color); border-radius: 6px;">
      </div>

      <div style="margin-bottom: 25px;">
        <h4 style="color: var(--secondary); margin-bottom: 10px;">Background</h4>
        <div id="bg-presets" style="display: flex; gap: 8px; margin-bottom: 10px; flex-wrap: wrap;">
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <h4 style="color: var(--secondary); margin-bottom: 10px;">Custom Background URL</h4>
        <input type="text" id="custom-bg-url" placeholder="https://example.com/image.jpg" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 6px; background: rgba(0,0,0,0.3); color: var(--text-primary); margin-bottom: 10px;">
        <button id="apply-bg-btn" style="width: 100%; padding: 8px; background: var(--primary); color: var(--bg-darkest); border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Apply Background</button>
      </div>

      <div style="margin-bottom: 25px;">
        <h4 style="color: var(--secondary); margin-bottom: 10px;">Display Preferences</h4>
        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; margin-bottom: 10px;">
          <input type="checkbox" id="theme-toggle" ${appState.settings.theme === 'dark' ? 'checked' : ''} style="cursor: pointer;"> Dark Mode
        </label>
      </div>

      <div style="margin-bottom: 25px;">
        <h4 style="color: var(--secondary); margin-bottom: 10px;">Notifications</h4>
        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
          <input type="checkbox" id="notif-toggle" ${appState.settings.notifications ? 'checked' : ''} style="cursor: pointer;"> Enable Notifications
        </label>
      </div>
    </div>`,
  };
  return contents[type] || '<div>Window content</div>';
}

function attachSettingsListeners(windowEl) {
  const themeToggle = windowEl.querySelector('#theme-toggle');
  const notifToggle = windowEl.querySelector('#notif-toggle');
  const customColorInput = windowEl.querySelector('#custom-color');
  const customBgInput = windowEl.querySelector('#custom-bg-url');
  const applyBgBtn = windowEl.querySelector('#apply-bg-btn');
  const themeSelector = windowEl.querySelector('#theme-selector');
  const bgPresets = windowEl.querySelector('#bg-presets');

  if (themeToggle) {
    themeToggle.addEventListener('change', (e) => {
      appState.settings.theme = e.target.checked ? 'dark' : 'light';
      saveSettings();
    });
  }

  if (notifToggle) {
    notifToggle.addEventListener('change', (e) => {
      appState.settings.notifications = e.target.checked;
      saveSettings();
    });
  }

  if (customColorInput) {
    customColorInput.addEventListener('change', (e) => {
      document.documentElement.style.setProperty('--primary', e.target.value);
      appState.settings.colorTheme = 'Custom';
      saveSettings();
    });
  }

  if (applyBgBtn) {
    applyBgBtn.addEventListener('click', () => {
      const url = customBgInput.value.trim();
      if (url) {
        appState.settings.customBgUrl = url;
        appState.settings.background = '';
        saveSettings();
        applyBackground();
      }
    });
  }

  // Populate theme selector
  if (themeSelector) {
    COLOR_THEMES.forEach(theme => {
      const btn = document.createElement('button');
      btn.style.cssText = `padding: 8px 12px; background: linear-gradient(90deg, ${theme.primary} 0%, ${theme.secondary} 100%); border: ${appState.settings.colorTheme === theme.name ? '2px solid white' : '1px solid rgba(255,255,255,0.3)'}; border-radius: 6px; cursor: pointer; color: white; font-weight: 600; font-size: 12px;`;
      btn.textContent = theme.name;
      btn.addEventListener('click', () => {
        appState.settings.colorTheme = theme.name;
        applyTheme();
        saveSettings();
        // Update button styles
        document.querySelectorAll('#theme-selector button').forEach(b => {
          b.style.border = '1px solid rgba(255,255,255,0.3)';
        });
        btn.style.border = '2px solid white';
      });
      themeSelector.appendChild(btn);
    });
  }

  // Populate background presets
  if (bgPresets) {
    BACKGROUND_PRESETS.forEach(bg => {
      const btn = document.createElement('button');
      btn.style.cssText = `padding: 8px 12px; background: ${bg.value}; border: ${appState.settings.background === bg.value ? '2px solid white' : '1px solid rgba(255,255,255,0.3)'}; border-radius: 6px; cursor: pointer; color: white; font-size: 12px;`;
      btn.textContent = bg.name;
      btn.addEventListener('click', () => {
        appState.settings.background = bg.value;
        appState.settings.customBgUrl = '';
        saveSettings();
        applyBackground();
        // Update button styles
        document.querySelectorAll('#bg-presets button').forEach(b => {
          b.style.border = '1px solid rgba(255,255,255,0.3)';
        });
        btn.style.border = '2px solid white';
      });
      bgPresets.appendChild(btn);
    });
  }
}

function attachAppsListeners(windowEl) {
  const appsGrid = windowEl.querySelector('#apps-grid');
  appsGrid.innerHTML = '';

  APPS_DATABASE.forEach(app => {
    const appCard = document.createElement('div');
    appCard.style.cssText = 'background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px; text-align: center; cursor: pointer; transition: all 0.3s;';
    appCard.innerHTML = `
      <div style="font-size: 32px; margin-bottom: 5px;">${app.icon}</div>
      <div style="font-size: 12px; color: var(--text-primary);">${app.name}</div>
    `;
    appCard.addEventListener('mouseover', () => {
      appCard.style.background = 'rgba(183, 148, 246, 0.2)';
    });
    appCard.addEventListener('mouseout', () => {
      appCard.style.background = 'rgba(0,0,0,0.3)';
    });
    appCard.addEventListener('click', () => {
      const encoded = btoa(app.url);
      window.open(`/proxy.html?url=${encoded}`, 'app_window', 'width=1200,height=800');
    });
    appsGrid.appendChild(appCard);
  });
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
  const url = game.url || `https://${game.id.replace(/-/g, '.')}.com`;
  const encoded = btoa(url);
  window.open(`/proxy.html?url=${encoded}`, 'game_window', 'width=1200,height=800');
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

console.log('StudyHub v4 initialized. Password: unblock');
