const headerHTML = `
<header>
  <div class="top-bar">
    <div>📞 <a href="tel:+13042407748">(304) 240-7748</a> · ✉ <a href="mailto:marshall@bugnoutllc.com">marshall@bugnoutllc.com</a></div>
    <div>📍 Serving Central Pennslyvannia</div>
  </div>

  <nav class="main-nav" id="mainNav">
    <a href="/" class="logo">
      <img src="https://cdn.bugnoutllc.com/branding/logo-transparent.png" alt="Bug N Out Logo">
    </a>

    <div class="nav-links">
      <a href="index.html">Home</a>
      <a href="services.html">Services</a>
      <a href="projects.html">Projects</a>
      <a href="contractors.html">Contractors</a>
      <a href="contact.html">Contact</a>
    </div>

    <a href="contact.html" class="btn primary nav-cta">Get a Quote</a>
  </nav>
</header>
`;

const footerHTML = `
<footer>
  <div class="footer-grid">
    <div>
      <img class="footer-logo" src="https://cdn.bugnoutllc.com/branding/logo-transparent.png">
      <p>Bug N’ Out LLC provides professional, reliable pest control solutions across Central Pennslyvannia.</p>

      <div class="socials">
        <a href="#">🐦</a>
        <a href="https://www.facebook.com/BugNoutLLC/">📘</a>
        <a href="https://www.instagram.com/bugnoutllc/">📸</a>
      </div>
    </div>

    <div>
      <h4>Company</h4>
      <a href="/">Home</a>
      <a href="/services.html">Services</a>
      <a href="/projects.html">Projects</a>
      <a href="/contractors.html">Contractors</a>
      <a href="/contact.html">Contact</a>
    </div>

    <div>
      <h4>Services</h4>
      <a>Residential Pest Control</a>
      <a>Commercial Services</a>
      <a>Termite Treatment</a>
      <a>Rodent Control</a>
      <a>Wildlife Removal</a>
    </div>

    <div>
      <h4>Legal & Info</h4>
      <a>Licensing</a>
      <a>Insurance</a>
      <a>Privacy Policy</a>
      <a>Terms of Service</a>
    </div>
  </div>

  <div class="footer-bottom">
    <span>© ${new Date().getFullYear()} Bug N’ Out LLC - Pest Control</span>
    <span>Website designed & built by <strong>Tanner Swartz</strong></span>
  </div>
</footer>
`;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("header-container").innerHTML = headerHTML;
  document.getElementById("footer-container").innerHTML = footerHTML;

  const nav = document.getElementById("mainNav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 50);
  });
});
