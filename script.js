document.addEventListener("DOMContentLoaded", function () {
    function setupAnimation(imageClass, svgClass) {
        const svgText = document.querySelector(svgClass);

        document.querySelector(imageClass).addEventListener("mouseenter", function () {
            svgText.style.animation = "textAnimation 2s ease-in-out forwards";
        });

        document.querySelector(imageClass).addEventListener("mouseleave", function () {
            svgText.style.animation = "none"; // Instantly reset
            svgText.style.strokeDashoffset = "150"; // Reset to full image

            // Trigger fast reverse animation
            setTimeout(() => {
                svgText.style.animation = "textAnimation 0.5s ease-in-out reverse";
            }, 10);
        });
    }

    // Apply animation logic to all three images
    setupAnimation(".left", ".overlay-svg-left");
    setupAnimation(".middle", ".overlay-svg-middle");
    setupAnimation(".right", ".overlay-svg-right");
});
