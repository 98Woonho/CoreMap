let currentIndex = 0;
const totalVideos = document.querySelectorAll('.video-container ul li').length;
const slide = document.querySelector('.video-container ul');

function slideVideo(direction) {
    if (direction === 'prev') {
        currentIndex = (currentIndex - 1 + totalVideos) % totalVideos;
    } else if (direction === 'next') {
        currentIndex = (currentIndex + 1) % totalVideos;
    }
    const translateValue = -currentIndex * 33.33333333333 + '%';
    slide.style.transform = 'translateX(' + translateValue + ')';
}