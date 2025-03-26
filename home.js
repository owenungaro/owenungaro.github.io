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
