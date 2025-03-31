const rightColumn = document.querySelector('.right');
const hoverDarkLayer = rightColumn.querySelector('.hover-dark');

rightColumn.addEventListener('mousemove', (e) => { /*mouse move inside column*/
  const rect = rightColumn.getBoundingClientRect(); /*bound box*/
  /*x and y relative to element*/
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  /*updates css variables to mask*/
  hoverDarkLayer.style.setProperty('--x', `${x}px`);
  hoverDarkLayer.style.setProperty('--y', `${y}px`);
});

/*when the mouse moves, hides the effect*/
rightColumn.addEventListener('mouseleave', () => {
  hoverDarkLayer.style.setProperty('--x', `-1000px`);
  hoverDarkLayer.style.setProperty('--y', `-1000px`);
});

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
      document.querySelector('.right').appendChild(container);
  
      setInterval(() => {
        const topLeft = document.querySelector('.corner-img.top-right');
        if (topLeft) {
          topLeft.classList.toggle('alt-state');
        }
      }, 4000);      
});

fetch('/nowplaying.json')
  .then(res => res.json())
  .then(data => {
    if (!data.playing) return;

    const widget = document.createElement('div');
    widget.classList.add('spotify-widget');

    widget.innerHTML = `
      <div class="spotify-header">
        <img src="/images/assets/spotify.svg" alt="Spotify" class="spotify-logo" />
        <span>Now Playing</span>
      </div>
      <div class="spotify-body">
      <img class="spotify-album-art" src="${data.image}" alt="Album Art">
      <div class="spotify-track-info">
        <a href="${data.url}" class="spotify-track-name" target="_blank">${data.name}</a>
        <div class="spotify-artist">${data.artist}</div>
        <div class="spotify-album">${data.album}</div>
        <div class="spotify-extra">
          <span>${data.device}</span> • 
          <span>${data.progress} / ${data.duration}</span>
        </div>
      </div>
    </div>

    `;

    const githubWidget = document.querySelector('.github-widget');
    function waitForGitHubWidget(callback) {
      const check = setInterval(() => {
        const githubWidget = document.querySelector('.github-widget');
        if (githubWidget) {
          clearInterval(check);
          callback(githubWidget);
        }
      }, 100);
    }
    
    waitForGitHubWidget(githubWidget => {
      githubWidget.insertAdjacentElement('afterend', widget);
    });
    
  })
  .catch(err => console.error("Spotify widget error:", err));

