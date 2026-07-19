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

// Formulario de cobertura
const coverageForm = document.getElementById('coverageForm');
const formSuccess  = document.getElementById('formSuccess');

if (coverageForm) {
  coverageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('cfName').value.trim();
    const address = document.getElementById('cfAddress').value.trim();
    const phone   = document.getElementById('cfPhone').value.trim();
    const email   = document.getElementById('cfEmail').value.trim();
    const message = document.getElementById('cfMessage').value.trim();

    if (!name || !address) return;
    if (!phone && !email) {
      alert('Por favor ingresa al menos un teléfono o email de contacto.');
      return;
    }

    const btn = coverageForm.querySelector('.form-submit-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;

    fetch('/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, address, phone, email, message }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          coverageForm.classList.add('hidden');
          formSuccess.classList.add('visible');
        } else {
          alert('Error: ' + (data.error || 'No se pudo enviar. Intenta de nuevo.'));
          btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar solicitud';
          btn.disabled = false;
        }
      })
      .catch(() => {
        alert('No se pudo conectar al servidor. Intenta de nuevo.');
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar solicitud';
        btn.disabled = false;
      });
  });
}

function resetForm() {
  if (!coverageForm) return;
  coverageForm.reset();
  coverageForm.classList.remove('hidden');
  formSuccess.classList.remove('visible');
  const btn = coverageForm.querySelector('.form-submit-btn');
  btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar solicitud';
  btn.disabled = false;
}

// Plans section tab switching
const tabBtns = document.querySelectorAll('.tab-btn');
if (tabBtns.length) {
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById('tab-' + btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
}

// Animate provider cards on scroll
const pcards = document.querySelectorAll('.pcard:not(.pcard-photo)');
if (pcards.length) {
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 50);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  pcards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(18px)';
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    cardObserver.observe(card);
  });
}
