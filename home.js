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
    
    document.querySelector('.right .widget-stack').appendChild(container);

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

document.querySelector('.widget-stack').appendChild(spotifyWidget);

// Refresh Spotify widget every 30 seconds
function updateSpotifyWidget() {
  fetch('https://spotify-now-playing.oungaro.workers.dev')
    .then(res => res.json())
    .then(data => {
      const albumArt = document.getElementById('albumArt');
      const title = document.getElementById('trackTitle');
      const artist = document.getElementById('trackArtist');

      if (!data || !data.is_playing) {
        title.textContent = 'Nothing playing';
        artist.textContent = '';
        albumArt.style.backgroundImage = '';
        albumArt.style.animationPlayState = 'paused';
        return;
      }

      albumArt.style.backgroundImage = `url('${data.album_image_url}')`;
      albumArt.style.animationPlayState = 'running';
      title.textContent = data.title;
      artist.textContent = data.artist;
    })
    .catch(() => {
      document.getElementById('trackTitle').textContent = 'Failed to load';
      document.getElementById('trackArtist').textContent = '';
    });
}

updateSpotifyWidget(); //Initial
setInterval(updateSpotifyWidget, 5000); //Timer
