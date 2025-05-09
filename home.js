// ======== HOME.JS FULL FIXED ======== //

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

// Add the corner image ONCE to the RIGHT COLUMN (not GitHub)
const cornerImg = document.createElement('div');
cornerImg.className = 'corner-img top-right fade-in';
rightColumn.appendChild(cornerImg);

setInterval(() => {
  cornerImg.classList.toggle('alt-state');
}, 4000);

// Spotify Widget (CREATE FIRST)
const spotifyWidget = document.createElement('div');
spotifyWidget.classList.add('spotify-widget', 'fade-in');
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

// Add fade-in class only to left-side elements initially, no need to re-add
const initialLeftFadeElements = [
  document.querySelector('#img1'),
  ...document.querySelectorAll('.svg-icon'),
  document.querySelector('.intro'),
  document.querySelector('.footer-note')
];
initialLeftFadeElements.forEach((el, i) => {
  if (!el) return;
  el.classList.add('fade-in');
  setTimeout(() => el.classList.add('show'), i * 150);
});

// Fetch GitHub repos and BUILD WIDGETS
fetch('/repos.json')
  .then(res => res.json())
  .then(repos => {
    const container = document.createElement('div');
    container.classList.add('github-widget', 'fade-in');

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

    container.innerHTML = `${header}<div class="repo-list">${list}</div>${footer}`;

    const widgetStack = document.querySelector('.widget-stack');
    widgetStack.innerHTML = '';
    widgetStack.appendChild(container);
    widgetStack.appendChild(spotifyWidget);

    setTimeout(() => {
      [container, spotifyWidget, cornerImg].forEach((el, i) => {
        if (!el) return;
        el.classList.add('fade-in');
        setTimeout(() => el.classList.add('show'), i * 150);
      });
    }, 100);
  });

// === Spotify playback ===
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
        title.textContent = 'Nothing';
        artist.textContent = '';
        elapsedEl.textContent = '—';
        durationEl.textContent = '—';
        progressBar.style.opacity = '0';
        albumArt.innerHTML = '';
        albumArt.style.backgroundImage = '';
        albumArt.style.backgroundColor = 'transparent';
        currentTrack = null;
        return;
      }

      albumArt.style.backgroundImage = `url('${data.album_image_url}')`;
      title.textContent = data.title;
      artist.textContent = data.artist;
      progressBar.style.opacity = '1';

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

updateSpotifyWidget();
setInterval(updateSpotifyWidget, 5000);
requestAnimationFrame(loop);

function adjustContainerHeight() {
  const widgetStack = document.querySelector('.widget-stack');
  const container = document.querySelector('.container');
  if (spotifyWidget && container) {
    const widgetHeight = widgetStack.scrollHeight;
    const buffer = 100;
    container.style.height = `${widgetHeight + buffer}px`;
  }
}

window.addEventListener('load', () => {
  setTimeout(adjustContainerHeight, 1000);
  const introVideo = document.getElementById('intro-video');
  if (introVideo) introVideo.playbackRate = 0.7;
});

window.addEventListener('resize', adjustContainerHeight);
