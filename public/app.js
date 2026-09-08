const PASSWORD = 'unblock';
let windows = {};
let windowZ = 100;

// Screen management
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// Password verification
document.getElementById('enter-btn').addEventListener('click', () => {
  const input = document.getElementById('password-input');
  const error = document.getElementById('error-msg');
  
  if (input.value === PASSWORD) {
    error.classList.add('error-hidden');
    showScreen('loading-screen');
    setTimeout(() => showScreen('mode-screen'), 1500);
  } else {
    error.classList.remove('error-hidden');
    input.value = '';
  }
});

document.getElementById('password-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') document.getElementById('enter-btn').click();
});

// Mode selection
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    if (mode === 'os') {
      showScreen('os-screen');
      initDesktop();
    } else if (mode === 'games') {
      showScreen('games-screen');
      initGamesMode();
    }
  });
});

// Desktop initialization
function initDesktop() {
  updateClock();
  setInterval(updateClock, 1000);
  
  document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      const windowType = icon.dataset.window;
      openWindow(windowType);
    });
  });
}

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  document.getElementById('system-clock').textContent = time;
}

function openWindow(type) {
  const id = `${type}-${Date.now()}`;
  const container = document.getElementById('windows-container');
  const window = document.createElement('div');
  window.className = 'window active';
  window.id = id;
  window.style.left = `${100 + Math.random() * 300}px`;
  window.style.top = `${80 + Math.random() * 200}px`;
  window.style.width = type === 'browser' ? '800px' : '600px';
  window.style.height = type === 'browser' ? '500px' : '400px';
  window.style.zIndex = windowZ++;

  let content = '';
  
  switch(type) {
    case 'browser':
      content = `
        <div class="window-header" data-movable="true">
          <div class="window-header-title">🌐 Browser</div>
          <div class="window-controls">
            <div class="window-control"></div>
            <div class="window-control"></div>
            <div class="window-control window-close">✕</div>
          </div>
        </div>
        <div class="window-content">
          <div class="browser-header">
            <input type="text" class="url-bar" placeholder="Enter URL (http://example.com)">
            <button class="browser-go-btn">Go</button>
          </div>
          <div class="browser-frame">
            <iframe></iframe>
          </div>
        </div>
      `;
      break;
      
    case 'games':
      content = `
        <div class="window-header" data-movable="true">
          <div class="window-header-title">🎮 Games</div>
          <div class="window-controls">
            <div class="window-control"></div>
            <div class="window-control"></div>
            <div class="window-control window-close">✕</div>
          </div>
        </div>
        <div class="window-content">
          <input type="text" placeholder="Search games..." class="games-search" style="margin-bottom: 10px;">
          <div class="games-list"></div>
        </div>
      `;
      break;
      
    case 'chat':
      content = `
        <div class="window-header" data-movable="true">
          <div class="window-header-title">💬 Study Group Chat</div>
          <div class="window-controls">
            <div class="window-control"></div>
            <div class="window-control"></div>
            <div class="window-control window-close">✕</div>
          </div>
        </div>
        <div class="window-content">
          <div class="chat-messages">
            <div class="chat-message">
              <div class="author">Alex</div>
              <div>Anyone done the math homework?</div>
            </div>
            <div class="chat-message">
              <div class="author">Jordan</div>
              <div>Still working on it, chapter 5 is tough</div>
            </div>
            <div class="chat-message">
              <div class="author">Casey</div>
              <div>Let's work on it together after class</div>
            </div>
          </div>
          <div class="chat-input">
            <input type="text" placeholder="Type message..." />
            <button>Send</button>
          </div>
        </div>
      `;
      break;
      
    case 'files':
      content = `
        <div class="window-header" data-movable="true">
          <div class="window-header-title">📁 Files</div>
          <div class="window-controls">
            <div class="window-control"></div>
            <div class="window-control"></div>
            <div class="window-control window-close">✕</div>
          </div>
        </div>
        <div class="window-content">
          <div style="color: var(--text-dim); font-size: 12px;">
            📄 homework.docx<br>
            📊 project_data.xlsx<br>
            🖼️ presentation.pptx<br>
            📝 notes.txt<br>
            📁 Study Materials
          </div>
        </div>
      `;
      break;
      
    case 'settings':
      content = `
        <div class="window-header" data-movable="true">
          <div class="window-header-title">⚙️ Settings</div>
          <div class="window-controls">
            <div class="window-control"></div>
            <div class="window-control"></div>
            <div class="window-control window-close">✕</div>
          </div>
        </div>
        <div class="window-content">
          <div style="font-size: 12px; line-height: 1.8;">
            <div style="color: var(--primary); margin-bottom: 15px;">Display</div>
            <div style="color: var(--text-dim); margin-bottom: 10px;">Theme: Dark (Custom)</div>
            <div style="color: var(--text-dim); margin-bottom: 15px;">Resolution: Auto</div>
            
            <div style="color: var(--primary); margin-bottom: 15px;">System</div>
            <div style="color: var(--text-dim); margin-bottom: 10px;">Version: 1.0.0</div>
            <div style="color: var(--text-dim);">Status: Online</div>
          </div>
        </div>
      `;
      break;
      
    case 'apps':
      content = `
        <div class="window-header" data-movable="true">
          <div class="window-header-title">📱 Apps</div>
          <div class="window-controls">
            <div class="window-control"></div>
            <div class="window-control"></div>
            <div class="window-control window-close">✕</div>
          </div>
        </div>
        <div class="window-content">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 11px;">
            <div style="padding: 10px; background: rgba(0,217,255,0.1); border-radius: 6px; text-align: center;">
              📚 Study<br>Tools
            </div>
            <div style="padding: 10px; background: rgba(0,217,255,0.1); border-radius: 6px; text-align: center;">
              🎯 Focus<br>Timer
            </div>
            <div style="padding: 10px; background: rgba(0,217,255,0.1); border-radius: 6px; text-align: center;">
              📈 Notes<br>App
            </div>
            <div style="padding: 10px; background: rgba(0,217,255,0.1); border-radius: 6px; text-align: center;">
              🔔 Schedule<br>Manager
            </div>
          </div>
        </div>
      `;
  }
  
  window.innerHTML = content;
  container.appendChild(window);
  
  // Make window movable
  makeWindowMovable(window);
  
  // Close button
  window.querySelector('.window-close').addEventListener('click', () => {
    window.remove();
    updateTaskbar();
  });
  
  // Browser functionality
  if (type === 'browser') {
    const urlBar = window.querySelector('.url-bar');
    const goBtn = window.querySelector('.browser-go-btn');
    const iframe = window.querySelector('iframe');
    
    const loadUrl = () => {
      let url = urlBar.value.trim();
      if (url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'http://' + url;
        }
        iframe.src = `/proxy.html?url=${encodeURIComponent(url)}`;
      }
    };
    
    goBtn.addEventListener('click', loadUrl);
    urlBar.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') loadUrl();
    });
  }
  
  // Games functionality
  if (type === 'games') {
    const gamesList = window.querySelector('.games-list');
    const gamesSearch = window.querySelector('.games-search');
    const games = getGamesList();
    
    const renderGames = (filter = '') => {
      gamesList.innerHTML = games
        .filter(g => g.toLowerCase().includes(filter.toLowerCase()))
        .map(g => `<div class="game-item">${g}</div>`)
        .join('');
    };
    
    renderGames();
    gamesSearch.addEventListener('input', (e) => renderGames(e.target.value));
  }
  
  updateTaskbar();
}

function makeWindowMovable(windowEl) {
  const header = windowEl.querySelector('.window-header');
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
  header.onmousedown = (e) => {
    windowEl.style.zIndex = windowZ++;
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  };
  
  function elementDrag(e) {
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    windowEl.style.top = (windowEl.offsetTop - pos2) + 'px';
    windowEl.style.left = (windowEl.offsetLeft - pos1) + 'px';
  }
  
  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function updateTaskbar() {
  const taskbarItems = document.getElementById('taskbar-items');
  const windows = document.querySelectorAll('.window');
  
  taskbarItems.innerHTML = '';
  
  windows.forEach(w => {
    const title = w.querySelector('.window-header-title').textContent;
    const item = document.createElement('div');
    item.className = 'taskbar-item active';
    item.textContent = title;
    item.addEventListener('click', () => {
      w.style.zIndex = windowZ++;
    });
    taskbarItems.appendChild(item);
  });
}

function getGamesList() {
  return [
    '2048', 'Cookie Clicker', 'Flappy Bird', 'Dino Runner',
    'Pac-Man', 'Snake', 'Tetris', 'Breakout',
    'Space Invaders', 'Pong', 'Minesweeper', 'Sudoku',
    'Chess', 'Checkers', 'Tic-Tac-Toe', 'Memory',
    'Geometry Dash', 'Jump King', 'Platform Quest', 'Parkour Pro',
    'Basketball Stars', 'Soccer Physics', 'Racing Legends', 'Bike Stunt',
    'Crossy Road', 'Krunker.io', 'Agar.io', 'Slither.io',
    'Wordle', 'Hangman', 'Word Search', 'Crossword'
  ];
}

function initGamesMode() {
  const gamesGrid = document.getElementById('games-grid');
  const gamesSearch = document.getElementById('games-search');
  const games = getGamesList();
  
  const renderGames = (filter = '') => {
    gamesGrid.innerHTML = games
      .filter(g => g.toLowerCase().includes(filter.toLowerCase()))
      .map(g => `
        <div class="game-card">
          <div class="icon">🎮</div>
          <div>${g}</div>
        </div>
      `)
      .join('');
  };
  
  renderGames();
  gamesSearch.addEventListener('input', (e) => renderGames(e.target.value));
}

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(console.error);
}
