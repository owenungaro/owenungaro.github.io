const rightColumn = document.querySelector('.right');
const hoverDarkLayer = rightColumn.querySelector('.hover-dark');

rightColumn.addEventListener('mousemove', (e) => {
  const rect = rightColumn.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  hoverDarkLayer.style.setProperty('--x', `${x}px`);
  hoverDarkLayer.style.setProperty('--y', `${y}px`);
});

rightColumn.addEventListener('mouseleave', () => {
  hoverDarkLayer.style.setProperty('--x', `-1000px`);
  hoverDarkLayer.style.setProperty('--y', `-1000px`);
});

// GitHub Widget
fetch('/repos.json')
  .then(res => res.json())
  .then(repos => {
    const specificRepos = ['KeyScraper', 'EventBuddy', 'SpotiSync', 'QuackTask'];
    
    const container = document.createElement('div');
    container.classList.add('github-widget');

    const header = `
      <div class="github-header">
        <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" class="github-logo">
        <span class="github-title">GitHub Repositories</span>
      </div>
    `;

    const list = repos.map(repo => `
      <a class="repo-item" href="${repo.html_url}" target="_blank">
        <div class="repo-name">${repo.name}</div>
        <div class="repo-description">${repo.description || "No description"}</div>
      </a>
    `).join('');

    const footer = `
      <div class="github-footer">
        <a href="https://github.com/owenungaro" target="_blank" class="github-view-all">View all on GitHub →</a>
      </div>
    `;

    container.innerHTML = `
      <div class="corner-img top-right"></div>
      ${header}
      <div class="repo-list">${list}</div>
      ${footer}
    `;
    
    const widgetStack = document.querySelector('.right .widget-stack');
    widgetStack.appendChild(container);
    widgetStack.appendChild(spotifyWidget); // <- append Spotify after GitHub

    setInterval(() => {
      const topLeft = document.querySelector('.corner-img.top-right');
      if (topLeft) {
        topLeft.classList.toggle('alt-state');
      }
    }, 4000);
  });


// Spotify Widget
const spotifyWidget = document.createElement('div');
spotifyWidget.classList.add('spotify-widget');
spotifyWidget.innerHTML = `
  <div class="spotify-header">Now Playing</div>
  <div class="spotify-body">
    <div class="album-art" id="albumArt" style="background-image: url('');"></div>
    <div class="track-info">
      <div class="track-title" id="trackTitle">Loading...</div>
      <div class="track-artist" id="trackArtist"></div>
      <div class="track-meta">
        <span id="trackElapsed">0:00</span>
        <span id="trackDuration">0:00</span>
      </div>
      <div class="progress-bar"><div class="progress-bar-fill" id="trackProgress"></div></div>
    </div>
  </div>
`;

const widgetStack = document.querySelector('.widget-stack');
widgetStack.appendChild(spotifyWidget);

let currentTrack = null;
let lastUpdateTime = null;

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function renderProgress() {
  if (!currentTrack || !currentTrack.is_playing) return;

  const now = Date.now();
  const elapsed = Math.min(currentTrack.progress_ms + (now - lastUpdateTime), currentTrack.duration_ms);

  document.getElementById('trackElapsed').textContent = formatTime(elapsed);
  document.getElementById('trackDuration').textContent = formatTime(currentTrack.duration_ms);

  const progressPercent = (elapsed / currentTrack.duration_ms) * 100;
  document.getElementById('trackProgress').style.width = `${progressPercent}%`;
}

function updateSpotifyWidget() {
  fetch('https://spotify-now-playing.oungaro.workers.dev')
    .then(res => res.json())
    .then(data => {
      const albumArt = document.getElementById('albumArt');
      const title = document.getElementById('trackTitle');
      const artist = document.getElementById('trackArtist');
      const elapsedEl = document.getElementById('trackElapsed');
      const durationEl = document.getElementById('trackDuration');
      const progressBar = document.getElementById('trackProgress');

      if (!data || !data.is_playing) {
        title.textContent = 'Nothing playing';
        artist.textContent = '';
        elapsedEl.textContent = '—';
        durationEl.textContent = '—';
        progressBar.style.opacity = '0';
        albumArt.style.backgroundImage = "url('https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg')";
        albumArt.style.backgroundSize = '60%';
        albumArt.style.backgroundColor = '#282828';
        albumArt.style.backgroundRepeat = 'no-repeat';
        albumArt.style.backgroundPosition = 'center';
        currentTrack = null;
        return;
      }

      albumArt.style.backgroundImage = `url('${data.album_image_url}')`;
      title.textContent = data.title;
      artist.textContent = data.artist;
      progressBar.style.opacity = '1';

      // Store track data and start animation
      currentTrack = {
        ...data,
        progress_ms: data.progress_ms,
        duration_ms: data.duration_ms
      };
      lastUpdateTime = Date.now();

      renderProgress();
    })
    .catch(() => {
      document.getElementById('trackTitle').textContent = 'Failed to load';
      document.getElementById('trackArtist').textContent = '';
    });
}

function loop() {
  renderProgress();
  requestAnimationFrame(loop);
}

updateSpotifyWidget(); // Initial data load
setInterval(updateSpotifyWidget, 5000); // Refresh song info every 5 sec
requestAnimationFrame(loop); // Start animation loop

function adjustContainerHeight() {
  const widgetStack = document.querySelector('.widget-stack');
  const container = document.querySelector('.container');
  
  if (spotifyWidget && container) {
    const widgetHeight = widgetStack.scrollHeight;
    const buffer = 100; // adjust as needed
    container.style.height = `${widgetHeight + buffer}px`;
  }
}

window.addEventListener('load', () => {
  setTimeout(adjustContainerHeight, 1000); // Delay to ensure widgets are loaded
});

window.addEventListener('resize', adjustContainerHeight);
