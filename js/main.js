// =============================================
// Bug N' Out LLC - Core Template & Navigation
// =============================================

const headerHTML = `
<header id="site-header">
  <div class="top-bar">
    <div>📞 <a href="tel:+13042407748">(304) 240-7748</a> · ✉ <a href="mailto:marshall@bugnoutllc.com">marshall@bugnoutllc.com</a></div>
    <div>📍 Serving Central Pennsylvania</div>
  </div>

  <nav class="main-nav" id="mainNav">
    <a href="/" class="logo">
      <img src="https://cdn.bugnoutllc.com/branding/logo-transparent.png" alt="Bug N Out Logo">
      <span class="logo-text">
        Bug N' Out
        <span>Pest Control</span>
      </span>
    </a>

    <button class="menu-toggle" id="menuToggle" aria-label="Toggle navigation menu">
      <span></span>
      <span></span>
      <span></span>
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
</header>
`;

const footerHTML = `
<footer>
  <div class="footer-grid">
    <div class="footer-brand">
      <img src="https://cdn.bugnoutllc.com/branding/logo-transparent.png" alt="Bug N Out Logo">
      <p>Bug N' Out LLC provides professional, reliable pest control solutions across Central Pennsylvania. Family-owned and trusted since 2009.</p>

      <div class="footer-socials">
        <a href="https://www.facebook.com/BugNoutLLC/" target="_blank" rel="noopener" aria-label="Facebook">📘</a>
        <a href="https://www.instagram.com/bugnoutllc/" target="_blank" rel="noopener" aria-label="Instagram">📸</a>
        <a href="#" target="_blank" rel="noopener" aria-label="Twitter / X">🐦</a>
        <a href="#" target="_blank" rel="noopener" aria-label="LinkedIn">💼</a>
        <a href="#" target="_blank" rel="noopener" aria-label="YouTube">▶️</a>
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
      <a href="services.html#wildlife">Wildlife Removal</a>
      <a href="services.html#commercial">Commercial Services</a>
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
    <span>&copy; ${new Date().getFullYear()} Bug N' Out LLC - Professional Pest Control</span>
    <span>Website designed & built by <strong>Tanner Swartz</strong></span>
  </div>
</footer>
`;

document.addEventListener("DOMContentLoaded", () => {
  // Inject header and footer
  const headerContainer = document.getElementById("header-container");
  const footerContainer = document.getElementById("footer-container");

  if (headerContainer) {
    headerContainer.innerHTML = headerHTML;
  }
  if (footerContainer) {
    footerContainer.innerHTML = footerHTML;
  }

  // ----- Mobile Menu Toggle -----
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      navLinks.classList.toggle("open");
      document.body.style.overflow = navLinks.classList.contains("open") ? "hidden" : "";
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        navLinks.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  // ----- Scroll Shadow Effect -----
  const header = document.getElementById("site-header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 50);
    }, { passive: true });

    // Check initial state (in case page loads mid-scroll)
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    }
  }

  // ----- Contact Form Handler -----
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      // If using Formspree or similar, replace this with actual action
      setTimeout(() => {
        submitBtn.textContent = "✓ Message Sent!";
        submitBtn.style.background = "var(--teal)";
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = "";
          submitBtn.disabled = false;
          contactForm.reset();
        }, 2000);
      }, 1500);
    });
  }
});