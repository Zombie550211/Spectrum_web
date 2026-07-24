// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// Navbar scroll shadow
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 10
      ? '0 2px 20px rgba(0,0,0,0.10)'
      : 'none';
  });
}

// Plans carousel — auto-advance every 3s, with dot navigation
const plansTrack = document.getElementById('plansTrack');
const plansDots  = document.getElementById('plansDots');

if (plansTrack && plansDots) {
  const slides = Array.from(plansTrack.children);
  let current = 0;
  let autoplayTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Ir al plan ${i + 1}`);
    dot.addEventListener('click', () => {
      goToSlide(i);
      restartAutoplay();
    });
    plansDots.appendChild(dot);
  });
  const dots = Array.from(plansDots.children);
  slides[0].classList.add('active');

  function goToSlide(index) {
    current = index;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  function nextSlide() {
    goToSlide((current + 1) % slides.length);
  }

  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 3000);
  }

  function restartAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  const carousel = plansTrack.closest('.plans-carousel');
  carousel.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  carousel.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
}
