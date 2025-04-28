document.addEventListener('DOMContentLoaded', () => {
    const crop = document.querySelector('.crop-image');
    const cropstates = ['state1', 'state2', 'state3'];
    let cropidx = 0;
  
    setInterval(() => {
        crop.classList.remove(cropstates[cropidx]);
        cropidx = (cropidx + 1) % cropstates.length;
        crop.classList.add(cropstates[cropidx]);
    }, 4000);

    const star = document.querySelector('.star-image');
    const starstates = ['state1', 'state2'];
    let staridx = 0;
  
    setInterval(() => {
        star.classList.remove(starstates[staridx]);
        staridx = (staridx + 1) % starstates.length;
        star.classList.add(starstates[staridx]);
    }, 4000);
  });