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
