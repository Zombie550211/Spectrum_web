// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

// Intersection Observer for bar animations
const bars = document.querySelectorAll('.bar-fill');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
}, { threshold: 0.3 });

bars.forEach(bar => {
  bar.style.animationPlayState = 'paused';
  observer.observe(bar);
});

// Smooth reveal on scroll
const revealElements = document.querySelectorAll(
  '.service-card, .pricing-card, .testimonial-card, .support-card, .use-case'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = entry.target.classList.contains('pricing-card popular')
          ? 'scale(1.02) translateY(0)'
          : 'translateY(0)';
      }, i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = el.classList.contains('pricing-card popular')
    ? 'scale(1.02) translateY(20px)'
    : 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});

// Verificador rápido (barra superior)
const addressInput = document.getElementById('addressInput');
const checkBtn = document.getElementById('checkCoverage');

if (checkBtn && addressInput) {
  checkBtn.addEventListener('click', () => {
    const address = addressInput.value.trim();
    if (!address) {
      addressInput.style.borderColor = '#ef4444';
      addressInput.focus();
      setTimeout(() => { addressInput.style.borderColor = ''; }, 2500);
      return;
    }
    document.getElementById('cobertura').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const cfAddress = document.getElementById('cfAddress');
      if (cfAddress) cfAddress.value = address;
    }, 600);
  });
  addressInput.addEventListener('keydown', e => { if (e.key === 'Enter') checkBtn.click(); });
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

function openAppStore(e) {
  e.preventDefault();
  const ua = navigator.userAgent || '';
  if (/iPad|iPhone|iPod/.test(ua)) {
    window.open('https://apps.apple.com/app/my-spectrum/id1018014752', '_blank');
  } else if (/Android/.test(ua)) {
    window.open('https://play.google.com/store/apps/details?id=com.charter.spectrum.my', '_blank');
  } else {
    window.open('https://www.spectrum.com/my-spectrum-app', '_blank');
  }
}

function resetForm() {
  coverageForm.reset();
  coverageForm.classList.remove('hidden');
  formSuccess.classList.remove('visible');
  const btn = coverageForm.querySelector('.form-submit-btn');
  btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar solicitud';
  btn.disabled = false;
}
