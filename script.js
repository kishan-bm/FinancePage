// Sidebar toggle
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const toggle = document.getElementById('themeToggle');

// Sidebar open/close
hamburger.addEventListener('click', () => sidebar.classList.add('open'));
closeSidebar.addEventListener('click', () => sidebar.classList.remove('open'));

// Theme toggle
toggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
  document.querySelector('header').classList.toggle('dark-mode');
  document.querySelector('footer').classList.toggle('dark-mode');
  sidebar.classList.toggle('dark-mode');
  document.querySelector('.sidebar-header').classList.toggle('dark-mode');
});

// Carousel Logic
let track;
let nextBtn;
let prevBtn;
let scrollInterval;
const scrollAmount = 1;
const intervalTime = 20;

function startAutoScroll() {
  stopAutoScroll();
  const imageWidth = track.firstElementChild.offsetWidth + 20;
  const totalOriginalWidth = imageWidth * (track.children.length / 2);

  scrollInterval = setInterval(() => {
    track.scrollLeft += scrollAmount;
    if (track.scrollLeft >= totalOriginalWidth) {
      track.scrollLeft = 0;
    }
  }, intervalTime);
}

function stopAutoScroll() {
  clearInterval(scrollInterval);
}

function resumeScrollAfterDelay() {
  stopAutoScroll();
  setTimeout(startAutoScroll, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
  track = document.querySelector('.carousel-track');
  nextBtn = document.querySelector('.carousel-btn.next');
  prevBtn = document.querySelector('.carousel-btn.prev');

  if (!track || !nextBtn || !prevBtn) {
    console.error("Carousel elements not found.");
    return;
  }

  // Hover to pause/resume
  track.addEventListener('mouseenter', stopAutoScroll);
  track.addEventListener('mouseleave', startAutoScroll);

  // Buttons
  nextBtn.addEventListener('click', () => {
    const scrollStep = track.firstElementChild.offsetWidth + 20;
    track.scrollLeft += scrollStep;
    resumeScrollAfterDelay();
  });

  prevBtn.addEventListener('click', () => {
    const scrollStep = track.firstElementChild.offsetWidth + 20;
    track.scrollLeft -= scrollStep;
    resumeScrollAfterDelay();
  });

  // 🖱 Drag scroll (Desktop)
  let isDown = false;
  let startX;
  let scrollLeftStart;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.classList.add('dragging');
    startX = e.pageX - track.offsetLeft;
    scrollLeftStart = track.scrollLeft;
    stopAutoScroll();
  });

  document.addEventListener('mouseup', () => {
    isDown = false;
    track.classList.remove('dragging');
    resumeScrollAfterDelay();
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.classList.remove('dragging');
    resumeScrollAfterDelay();
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeftStart - walk;
  });

  //  Touch Scroll (Mobile)
  track.addEventListener('touchstart', () => stopAutoScroll(), { passive: true });
  track.addEventListener('touchend', () => resumeScrollAfterDelay());

  // Start
  startAutoScroll();
});
