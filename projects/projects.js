const container = document.querySelector('.projects-wrapper');
const hoverDarkLayer = container.querySelector('.hover-dark');

container.addEventListener('mousemove', (e) => {
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  hoverDarkLayer.style.setProperty('--x', `${x}px`);
  hoverDarkLayer.style.setProperty('--y', `${y}px`);
});

container.addEventListener('mouseleave', () => {
  hoverDarkLayer.style.setProperty('--x', `-1000px`);
  hoverDarkLayer.style.setProperty('--y', `-1000px`);
});


(function() {
    const cards = document.querySelectorAll('.project-card');
    const backdrop = document.getElementById('card-backdrop');
    const modal = document.getElementById('projectModal');
    const modalContent = modal.querySelector('.modal-content');
  
    const projectExtraInfo = {
      "SpotiSync": "Convert YouTube audio to MP3 in-browser using ffmpeg.wasm and add directly to a Spotify playlist via API.",
      "KeyScraper": "Scrape GeekHack vendor listings, normalize data, and export results as CSV or JSON for analysis.",
      "EventBuddy": "Discord bot that posts scheduled event announcements with interactive RSVP buttons.",
      "Billsplitter": "A hackathon app to split group expenses and settle payments via Stripe Connect.",
      "Shors Algorithm - The Lion": "Quantum implementation of Shor's algorithm using QFT-based modular exponentiation for small semiprimes."
    };
  
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const title = card.querySelector('h2').textContent;
        const desc = card.querySelector('p').textContent;
  
        let bodyHTML = '';
        if(title === 'QuackTask') {
          bodyHTML = `
            <div class="modal-intro">
              <p>QuackTask brings all your Canvas assignments into Google Tasks, giving you a unified place to track due dates across courses. Its intuitive UI and robust syncing workflow mean you spend less time copying tasks and more time getting things done.</p>
              <p>Key highlights:</p>
              <ul class="modal-features">
                <li><strong>Secure OAuth2 Authentication:</strong> Connects to Canvas without ever storing your credentials.</li>
                <li><strong>Automatic Fetch & Sync:</strong> Retrieves upcoming assignments every 15 minutes and updates your task list.</li>
                <li><strong>Custom Reminders:</strong> Set lead-time alerts per course or assignment type.</li>
                <li><strong>Course Grouping:</strong> Organizes tasks into projects based on course codes.</li>
                <li><strong>Duplicate Detection:</strong> Prevents duplicate tasks when Canvas items haven’t changed.</li>
              </ul>
              <p>Under the hood, QuackTask is built with:</p>
              <ul class="modal-tech">
                <li>TypeScript for type-safe background and popup scripts</li>
                <li>React for the popup UI</li>
                <li>Chrome Storage API for persistent settings</li>
                <li>Canvas REST API for assignment data</li>
                <li>Google Tasks API for task creation</li>
              </ul>
            </div>
            <div class="modal-links">
              <a class="btn" href="https://chromewebstore.google.com/detail/quacktask/cpmbfihgmlpkgpadfbdfgbepkgoighie" target="_blank">Chrome Web Store</a>
              <a class="btn" href="https://github.com/owenungaro/QuackTask" target="_blank">GitHub Repository</a>
            </div>
          `;
        } else {
          const extra = projectExtraInfo[title] || '';
          if (extra) {
            bodyHTML = `<p class="modal-extra">${extra}</p>`;
          }
        }
  
        modalContent.innerHTML = `
          <h2>${title}</h2>
          <div class="modal-body">
            <p class="modal-desc">${desc}</p>
            ${bodyHTML}
            <div class="modal-gallery"><!-- images here --></div>
          </div>
        `;
  
        backdrop.classList.add('active');
        modal.classList.add('active');
      });
    });
  
    function closeModal() {
      backdrop.classList.remove('active');
      modal.classList.remove('active');
    }
  
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if(e.key === 'Escape') closeModal();
    });
  })();