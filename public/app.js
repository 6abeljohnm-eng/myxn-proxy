const PASSWORD = 'unblock';
let windows = {};
let windowZ = 100;
let chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];

// Screen management
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// Login
document.getElementById('login-btn').addEventListener('click', () => {
  const input = document.getElementById('password-input');
  const error = document.getElementById('error-msg');
  
  if (input.value === PASSWORD) {
    error.classList.add('error-hidden');
    showScreen('mode-screen');
  } else {
    error.classList.remove('error-hidden');
    input.value = '';
  }
});

document.getElementById('password-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') document.getElementById('login-btn').click();
});

// Mode selection
document.querySelectorAll('.mode-card').forEach(btn => {
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

// Desktop init
function initDesktop() {
  updateClock();
  setInterval(updateClock, 1000);
  
  document.querySelectorAll('.sidebar-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      openWindow(icon.dataset.window);
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
  document.getElementById('clock').textContent = time;
}

function openWindow(type) {
  const id = `${type}-${Date.now()}`;
  const container = document.getElementById('windows-area');
  const win = document.createElement('div');
  win.className = 'window active';
  win.id = id;
  win.style.left = `${100 + Math.random() * 400}px`;
  win.style.top = `${80 + Math.random() * 200}px`;
  win.style.width = type === 'browser' ? '900px' : '600px';
  win.style.height = type === 'browser' ? '550px' : '450px';
  win.style.zIndex = windowZ++;

  let content = '';
  
  if (type === 'browser') {
    content = `
      <div class="window-header" data-movable="true">
        <div class="window-title">🌐 Browser</div>
        <div class="window-controls">
          <div class="window-control"></div>
          <div class="window-control"></div>
          <div class="window-control window-close">✕</div>
        </div>
      </div>
      <div class="window-content">
        <div class="browser-controls">
          <input type="text" class="url-bar" placeholder="Enter URL (http://example.com)">
          <button class="url-go">Go</button>
        </div>
        <div class="browser-frame">
          <iframe></iframe>
        </div>
      </div>
    `;
  } else if (type === 'movies') {
    content = `
      <div class="window-header" data-movable="true">
        <div class="window-title">🎬 Movies</div>
        <div class="window-controls">
          <div class="window-control"></div>
          <div class="window-control"></div>
          <div class="window-control window-close">✕</div>
        </div>
      </div>
      <div class="window-content">
        <input type="text" class="movies-search" placeholder="Search movies...">
        <div class="movies-grid"></div>
      </div>
    `;
  } else if (type === 'games') {
    content = `
      <div class="window-header" data-movable="true">
        <div class="window-title">🎮 Games</div>
        <div class="window-controls">
          <div class="window-control"></div>
          <div class="window-control"></div>
          <div class="window-control window-close">✕</div>
        </div>
      </div>
      <div class="window-content">
        <input type="text" class="games-search" placeholder="Search games...">
        <div class="games-list"></div>
      </div>
    `;
  } else if (type === 'chat') {
    content = `
      <div class="window-header" data-movable="true">
        <div class="window-title">💬 Friends Chat</div>
        <div class="window-controls">
          <div class="window-control"></div>
          <div class="window-control"></div>
          <div class="window-control window-close">✕</div>
        </div>
      </div>
      <div class="window-content">
        <div class="chat-messages"></div>
        <div class="chat-input-area">
          <input type="text" placeholder="Type message...">
          <button>Send</button>
        </div>
      </div>
    `;
  } else if (type === 'settings') {
    content = `
      <div class="window-header" data-movable="true">
        <div class="window-title">⚙️ Settings</div>
        <div class="window-controls">
          <div class="window-control"></div>
          <div class="window-control"></div>
          <div class="window-control window-close">✕</div>
        </div>
      </div>
      <div class="window-content">
        <div style="font-size: 12px; line-height: 1.8;">
          <div style="color: var(--primary); margin-bottom: 15px;">System</div>
          <div style="color: var(--text-dim); margin-bottom: 10px;">Version: 2.0</div>
          <div style="color: var(--text-dim); margin-bottom: 15px;">Status: Online</div>
          
          <div style="color: var(--primary); margin-bottom: 15px;">Display</div>
          <div style="color: var(--text-dim);">Theme: Dark (Galaxy Inspired)</div>
        </div>
      </div>
    `;
  }
  
  win.innerHTML = content;
  container.appendChild(win);
  
  makeWindowMovable(win);
  
  win.querySelector('.window-close').addEventListener('click', () => {
    win.remove();
    updateTaskbar();
  });
  
  // Browser functionality
  if (type === 'browser') {
    const urlBar = win.querySelector('.url-bar');
    const goBtn = win.querySelector('.url-go');
    const iframe = win.querySelector('iframe');
    
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
  
  // Movies functionality
  if (type === 'movies') {
    const moviesSearch = win.querySelector('.movies-search');
    const moviesGrid = win.querySelector('.movies-grid');
    const movies = getMovies();
    
    const renderMovies = (filter = '') => {
      moviesGrid.innerHTML = movies
        .filter(m => m.name.toLowerCase().includes(filter.toLowerCase()))
        .map(m => `
          <div class="movie-item" onclick="window.open('${m.url}', '_blank')">
            <div>${m.icon}</div>
            <div>${m.name}</div>
          </div>
        `)
        .join('');
    };
    
    renderMovies();
    moviesSearch.addEventListener('input', (e) => renderMovies(e.target.value));
  }
  
  // Games functionality
  if (type === 'games') {
    const gamesSearch = win.querySelector('.games-search');
    const gamesList = win.querySelector('.games-list');
    const games = getGames();
    
    const renderGames = (filter = '') => {
      gamesList.innerHTML = games
        .filter(g => g.toLowerCase().includes(filter.toLowerCase()))
        .map(g => `<div class="game-item">${g}</div>`)
        .join('');
    };
    
    renderGames();
    gamesSearch.addEventListener('input', (e) => renderGames(e.target.value));
  }
  
  // Chat functionality
  if (type === 'chat') {
    const chatMessagesDiv = win.querySelector('.chat-messages');
    const input = win.querySelector('input');
    const sendBtn = win.querySelector('button');
    
    const renderChat = () => {
      chatMessagesDiv.innerHTML = chatMessages.map(msg => `
        <div class="chat-msg">
          <div class="chat-author">${msg.author}</div>
          <div>${msg.text}</div>
        </div>
      `).join('');
      chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
    };
    
    const sendMessage = () => {
      if (input.value.trim()) {
        chatMessages.push({
          author: 'You',
          text: input.value.trim()
        });
        localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
        input.value = '';
        renderChat();
      }
    };
    
    renderChat();
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
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
  const taskbarLeft = document.getElementById('taskbar-left');
  const winEls = document.querySelectorAll('.window');
  
  taskbarLeft.innerHTML = '';
  
  winEls.forEach(w => {
    const title = w.querySelector('.window-title').textContent;
    const item = document.createElement('div');
    item.className = 'taskbar-item active';
    item.textContent = title;
    item.addEventListener('click', () => {
      w.style.zIndex = windowZ++;
    });
    taskbarLeft.appendChild(item);
  });
}

function getMovies() {
  return [
    { icon: '🎬', name: 'Tubi', url: 'https://www.tubi.tv' },
    { icon: '📺', name: 'Pluto TV', url: 'https://www.plutotv.com' },
    { icon: '🎥', name: 'YouTube Movies', url: 'https://www.youtube.com/results?search_query=free+movies' },
    { icon: '📽️', name: 'Internet Archive', url: 'https://archive.org/details/movies' },
    { icon: '🎭', name: 'Public Domain', url: 'https://www.publicdomainreview.org/collections/films/' },
    { icon: '🎪', name: 'Kanopy', url: 'https://www.kanopy.com' },
    { icon: '🎞️', name: 'Hoopla', url: 'https://www.hoopladigital.com' },
    { icon: '🍿', name: 'Plex', url: 'https://www.plex.tv' },
  ];
}

function getGames() {
  return [
    '2048', 'Cookie Clicker', 'Flappy Bird', 'Dino Runner',
    'Pac-Man', 'Snake', 'Tetris', 'Breakout',
    'Space Invaders', 'Pong', 'Minesweeper', 'Sudoku',
    'Chess', 'Checkers', 'Tic-Tac-Toe', 'Memory Game',
    'Geometry Dash', 'Jump King', 'Platform Quest', 'Parkour',
    'Basketball Stars', 'Soccer Physics', 'Racing Legends', 'Bike Stunt',
    'Crossy Road', 'Krunker.io', 'Agar.io', 'Slither.io',
    'Wordle', 'Hangman', 'Word Search', 'Crossword'
  ];
}

function initGamesMode() {
  const gamesGrid = document.getElementById('games-grid');
  const gamesSearch = document.getElementById('games-search');
  const games = getGames();
  
  const renderGames = (filter = '') => {
    gamesGrid.innerHTML = games
      .filter(g => g.toLowerCase().includes(filter.toLowerCase()))
      .map(g => `
        <div class="game-card">
          <div class="game-card-icon">🎮</div>
          <div>${g}</div>
        </div>
      `)
      .join('');
  };
  
  renderGames();
  gamesSearch.addEventListener('input', (e) => renderGames(e.target.value));
}

// Service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
