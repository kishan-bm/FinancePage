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

// ---- Load WordPress Blog Posts → About section ----

async function loadAboutFromWP() {
  try {
    // Fetch from your actual WordPress site
    const url = "https://klantroef.cloud/wp-json/wp/v2/posts?per_page=5&_embed";
    const res = await fetch(url);
    const posts = await res.json();

    console.log(posts); // Check response in browser console

    if (!posts || posts.length === 0) {
      console.log("No posts found");
      return;
    }

    const aboutEl = document.querySelector("#about");
    
    // Display all posts
    let postsHTML = '<h2>Latest Blog Posts</h2>';
    
    posts.forEach(post => {
      postsHTML += `
        <article class="blog-post">
          <h3>${post.title.rendered}</h3>
          <p class="post-date">${new Date(post.date).toLocaleDateString()}</p>
          <div class="post-content">${post.excerpt.rendered}</div>
          <a href="${post.link}" target="_blank" class="read-more">Read More →</a>
        </article>
      `;
    });
    
    aboutEl.innerHTML = postsHTML;

  } catch (error) {
    console.error("WP Fetch Error:", error);
    document.querySelector("#about").innerHTML = `
      <h2>Blog Posts</h2>
      <p>Unable to load posts at this time.</p>
    `;
  }
}

// Load posts when page loads
loadAboutFromWP();
