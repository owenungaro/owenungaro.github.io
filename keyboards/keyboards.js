document.addEventListener("DOMContentLoaded", () => {
    const hoverDarkLayer = document.querySelector('.hover-dark');
  
    document.body.addEventListener('mousemove', (e) => {
      hoverDarkLayer.style.setProperty('--x', `${e.clientX}px`);
      hoverDarkLayer.style.setProperty('--y', `${e.clientY}px`);
    });
  
    document.body.addEventListener('mouseleave', () => {
      hoverDarkLayer.style.setProperty('--x', `-1000px`);
      hoverDarkLayer.style.setProperty('--y', `-1000px`);
    });
  });  

document.addEventListener("DOMContentLoaded", function () {
    function setupAnimation(imageClass, svgClass) {
        const svgText = document.querySelector(svgClass);
        let isReversing = false;

        function restartAnimation(direction) {
            const computedStyle = getComputedStyle(svgText);
            const dashOffset = parseFloat(computedStyle.getPropertyValue("stroke-dashoffset"));

            // Calculate animation duration based on progress
            const totalLength = 150;
            const progress = dashOffset / totalLength;
            const remainingTime = 2 * (direction === "forwards" ? progress : 1 - progress);

            // Apply animation dynamically
            svgText.style.animation = "none";
            setTimeout(() => {
                svgText.style.animation = `textAnimation ${remainingTime}s ease-in-out ${direction}`;
            }, 10);
        }

        document.querySelector(imageClass).addEventListener("mouseenter", function () {
            isReversing = false;
            restartAnimation("forwards");
        });

        document.querySelector(imageClass).addEventListener("mouseleave", function () {
            if (!isReversing) {
                isReversing = true;
                restartAnimation("reverse");
            }
        });
    }

    // Apply animation to all three images
    setupAnimation(".left", ".overlay-svg-left");
    setupAnimation(".middle", ".overlay-svg-middle");
    setupAnimation(".right", ".overlay-svg-right");
});
