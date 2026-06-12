
const headerHTML = `
<header id="site-header">
  <div class="top-bar">
    <div>📞 <a href="tel:+13042407748">(304) 240-7748</a> · ✉ <a href="mailto:marshall@bugnoutllc.com">marshall@bugnoutllc.com</a></div>
    <div>📍 Serving Central Pennsylvania</div>
  </div>
  <nav class="main-nav" id="mainNav">
    <a href="/" class="logo">
      <img src="https://cdn.bugnoutllc.com/branding/logo-transparent.png" alt="Bug N' Out LLC Logo">
      <span class="logo-text">
        Bug N' Out
        <span>Professional Pest Control</span>
      </span>
    </a>
    <button class="menu-toggle" id="menuToggle" aria-label="Toggle navigation menu">
      <span></span><span></span><span></span>
    </button>
    <div class="nav-links" id="navLinks">
      <a href="index.html">Home</a>
      <a href="services.html">Services</a>
      <a href="projects.html">Projects</a>
      <a href="about.html">About</a>
      <a href="contractors.html">Contractors</a>
      <a href="faq.html">FAQ</a>
      <a href="contact.html">Contact</a>
      <a href="contact.html" class="btn btn-primary nav-cta">Get a Quote</a>
    </div>
  </nav>
</header>`;
const footerHTML = `
<footer>
  <div class="footer-grid">
    <div class="footer-brand">
      <img src="https://cdn.bugnoutllc.com/branding/logo-transparent.png" alt="Bug N' Out LLC Logo">
      <p>Bug N' Out LLC provides professional, reliable pest control solutions across Central Pennsylvania. Family-owned and trusted since 2009.</p>
      <div class="footer-socials">
        <a href="https://www.facebook.com/BugNoutLLC/" target="_blank" rel="noopener" aria-label="Facebook">📘</a>
        <a href="https://www.instagram.com/bugnoutllc/" target="_blank" rel="noopener" aria-label="Instagram">📸</a>
      </div>
    </div>
    <div class="footer-col">
      <h4>Quick Links</h4>
      <a href="index.html">Home</a>
      <a href="services.html">Services</a>
      <a href="projects.html">Projects</a>
      <a href="about.html">About Us</a>
      <a href="contractors.html">Contractors</a>
      <a href="faq.html">FAQ</a>
      <a href="contact.html">Contact</a>
    </div>
    <div class="footer-col">
      <h4>Services</h4>
      <a href="services.html#general">General Pest Control</a>
      <a href="services.html#termite">Termite Treatment</a>
      <a href="services.html#rodent">Rodent Control</a>
      <a href="services.html#commercial">Commercial Services</a>
      <a href="services.html#wildlife">Wildlife Removal</a>
      <a href="services.html#bedbug">Bed Bug Treatment</a>
    </div>
    <div class="footer-col">
      <h4>Contact</h4>
      <a href="tel:+13042407748">(304) 240-7748</a>
      <a href="mailto:marshall@bugnoutllc.com">marshall@bugnoutllc.com</a>
      <a href="contact.html">Get a Quote</a>
      <a href="contact.html">Schedule Inspection</a>
      <a href="about.html#licensing">Licensing & Insurance</a>
      <a href="#">Privacy Policy</a>
    </div>
  </div>
  <div class="footer-bottom">
    <span>&copy; 2026 Bug N' Out LLC - Professional Pest Control</span>
    <span>Website designed & built by <strong>Tanner Swartz</strong></span>
  </div>
</footer>`;

document.addEventListener("DOMContentLoaded", () => {
  const hc = document.getElementById("header-container");
  const fc = document.getElementById("footer-container");
  if (hc) hc.innerHTML = headerHTML;
  if (fc) fc.innerHTML = footerHTML;

  // Mobile menu toggle
  const mt = document.getElementById("menuToggle");
  const nl = document.getElementById("navLinks");
  if (mt && nl) {
    mt.addEventListener("click", () => {
      mt.classList.toggle("active");
      nl.classList.toggle("open");
      document.body.style.overflow = nl.classList.contains("open") ? "hidden" : "";
    });
    nl.querySelectorAll("a").forEach(l => l.addEventListener("click", () => {
      mt.classList.remove("active");
      nl.classList.remove("open");
      document.body.style.overflow = "";
    }));
  }

  // Scroll shadow
  const h = document.getElementById("site-header");
  if (h) {
    window.addEventListener("scroll", () => h.classList.toggle("scrolled", window.scrollY > 50), { passive: true });
    if (window.scrollY > 50) h.classList.add("scrolled");
  }

  // Contact form
  const cf = document.getElementById("contact-form");
  if (cf) {
    cf.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = cf.querySelector("button[type='submit']");
      const orig = btn.textContent;
      btn.textContent = "Sending...";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = "✓ Message Sent!";
        btn.style.background = "var(--teal)";
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = "";
          btn.disabled = false;
          cf.reset();
        }, 2000);
      }, 1500);
    });
  }
});
