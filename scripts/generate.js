import { readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outputDir = join(root, 'generated');

// Load site data
const data = JSON.parse(readFileSync(join(root, 'data', 'site.json'), 'utf-8'));

// Clean output directory
if (existsSync(outputDir)) {
  rmSync(outputDir, { recursive: true });
}

// ========================
// TEMPLATE HELPERS
// ========================

function html(strings, ...values) {
  return strings.reduce((result, str, i) => result + str + (values[i] || ''), '');
}

const s = data.site;

function buildHeader() {
  const navLinks = data.nav.map(n =>
    `<a href="${n.href}">${n.label}</a>`
  ).join('\n      ');

  return html`
<header id="site-header">
  <div class="top-bar">
    <div>📞 <a href="tel:${s.phoneRaw}">${s.phone}</a> · ✉ <a href="mailto:${s.email}">${s.email}</a></div>
    <div>📍 Serving ${s.serviceArea}</div>
  </div>
  <nav class="main-nav" id="mainNav">
    <a href="/" class="logo">
      <img src="${s.logoUrl}" alt="${s.title} Logo">
      <span class="logo-text">
        Bug N' Out
        <span>${s.tagline}</span>
      </span>
    </a>
    <button class="menu-toggle" id="menuToggle" aria-label="Toggle navigation menu">
      <span></span><span></span><span></span>
    </button>
    <div class="nav-links" id="navLinks">
      ${navLinks}
      <a href="contact.html" class="btn btn-primary nav-cta">Get a Quote</a>
    </div>
  </nav>
</header>`;
}

function buildFooter() {
  const socialLinks = s.socials.map(soc =>
    `<a href="${soc.url}" target="_blank" rel="noopener" aria-label="${soc.name}">${soc.icon}</a>`
  ).join('\n        ');

  return html`
<footer>
  <div class="footer-grid">
    <div class="footer-brand">
      <img src="${s.logoUrl}" alt="${s.title} Logo">
      <p>${s.title} provides professional, reliable pest control solutions across ${s.serviceArea}. Family-owned and trusted since ${s.founded}.</p>
      <div class="footer-socials">
        ${socialLinks}
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
      ${data.services.map(svc => `<a href="services.html#${svc.id}">${svc.title}</a>`).join('\n      ')}
    </div>
    <div class="footer-col">
      <h4>Contact</h4>
      <a href="tel:${s.phoneRaw}">${s.phone}</a>
      <a href="mailto:${s.email}">${s.email}</a>
      <a href="contact.html">Get a Quote</a>
      <a href="contact.html">Schedule Inspection</a>
      <a href="about.html#licensing">Licensing & Insurance</a>
      <a href="#">Privacy Policy</a>
    </div>
  </div>
  <div class="footer-bottom">
    <span>&copy; ${new Date().getFullYear()} ${s.title} - Professional Pest Control</span>
    <span>Website designed & built by <strong>${s.designer}</strong></span>
  </div>
</footer>`;
}

// Cache-busting build timestamp (changes every build)
const BUILD_TIME = Date.now();

function pageWrap(title, desc, content, extraHead = '') {
  return html`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${desc}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <title>${title}</title>
  <link rel="icon" href="${s.favicon}" />
  <link rel="stylesheet" href="css/main.css?v=${BUILD_TIME}" />
  ${extraHead}
  <script src="js/main.js?v=${BUILD_TIME}" defer></script>
  <script src="js/animations.js?v=${BUILD_TIME}" defer></script>
</head>
<body>
  <div id="header-container"></div>
  <main>
    ${content}
  </main>
  <div id="footer-container"></div>
</body>
</html>`;
}

function pageHero(title, subtitle) {
  return html`
    <section class="page-hero">
      <h1 class="reveal">${title}</h1>
      <p class="reveal">${subtitle}</p>
    </section>`;
}

function ctaSection(headline, text, btnLabel, btnLink) {
  return html`
    <section class="cta-section">
      <h2 class="reveal">${headline}</h2>
      <p class="reveal">${text}</p>
      <div class="cta-actions reveal">
        <a href="${btnLink}" class="btn btn-primary btn-lg">${btnLabel}</a>
        <a href="tel:${s.phoneRaw}" class="btn btn-secondary btn-lg">Call ${s.phone}</a>
      </div>
    </section>`;
}

// ========================
// GENERATE HEADER/FOOTER JS
// ========================

const headerHTML = buildHeader();
const footerHTML = buildFooter();

// Write a mini main.js that ONLY loads the header/footer
// The full main.js (with mobile menu, scroll, form) is separate
const mainJsContent = html`
const headerHTML = \`${headerHTML}\`;
const footerHTML = \`${footerHTML}\`;

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
`;

// ========================
// BUILD PAGES
// ========================

// Ensure output dirs
const dirs = ['css', 'js'];
for (const dir of dirs) {
  mkdirSync(join(outputDir, dir), { recursive: true });
}

// Copy static assets
for (const dir of dirs) {
  const src = join(root, dir);
  if (existsSync(src)) {
    const files = readdirSync(src);
    for (const file of files) {
      if (file === 'main.js') continue; // We'll generate it
      cpSync(join(src, file), join(outputDir, dir, file));
    }
  }
}

// Copy root files
for (const file of ['CNAME', 'sitemap.xml', '.gitignore']) {
  const srcPath = join(root, file);
  if (existsSync(srcPath)) cpSync(srcPath, join(outputDir, file));
}

// Write generated main.js
writeFileSync(join(outputDir, 'js', 'main.js'), mainJsContent);

// ========================
// INDEX PAGE
// ========================

function generateIndex() {
  const sections = [];

  // Hero section
  sections.push(html`
    <section class="hero">
      <div class="hero-bg"><img src="${s.heroBg}" alt="${s.title} Truck"></div>
      <div class="hero-overlay"></div>
      <div class="hero-particles"></div>
      <div class="hero-content">
        <span class="badge badge-white">Trusted Pest Control Since ${s.founded}</span>
        <h1>Protecting Homes & Businesses <span>From Unwanted Pests</span></h1>
        <p>${s.description}</p>
        <div class="hero-actions">
          <a href="contact.html" class="btn btn-primary btn-lg">Get a Free Quote</a>
          <a href="tel:${s.phoneRaw}" class="btn btn-secondary btn-lg">Call ${s.phone}</a>
        </div>
      </div>
      <div class="hero-scroll-indicator">
        <span>Scroll</span>
        <div class="scroll-arrow"></div>
      </div>
    </section>`);

  // Stats section
  if (data.stats.length > 0) {
    const statsHTML = data.stats.map(st =>
      `<div class="stat-item reveal"><div class="stat-number">${st.number}</div><div class="stat-label">${st.label}</div></div>`
    ).join('\n          ');
    sections.push(`<section class="stats"><div class="container"><div class="stats-grid">${statsHTML}</div></div></section>`);
  }

  // Services section
  if (data.services.length > 0) {
    const servicesHTML = data.services.map(svc =>
      html`
    <div class="service-card">
      <div class="service-icon">${svc.icon}</div>
      <h3>${svc.title}</h3>
      <p>${svc.shortDesc}</p>
      <ul class="service-features">
        ${svc.features.slice(0, 4).map(f => `<li>${f}</li>`).join('\n              ')}
      </ul>
    </div>`
    ).join('\n          ');
    sections.push(html`
    <section class="section services" id="services">
      <div class="container">
        <div class="section-header reveal">
          <span class="badge">What We Do</span>
          <h2>Complete Pest Control Solutions</h2>
        </div>
        <div class="services-grid stagger">${servicesHTML}</div>
        <div style="text-align:center;margin-top:var(--space-xl);" class="reveal">
          <a href="services.html" class="btn btn-outline">View All Services</a>
        </div>
      </div>
    </section>`);
  }

  // Testimonials section
  if (data.testimonials.length > 0) {
    const testimonialsHTML = data.testimonials.map(t =>
      html`
    <div class="testimonial-card">
      <p class="testimonial-text">${t.text}</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${t.author.charAt(0)}</div>
        <div class="testimonial-info">
          <h4>${t.author}</h4>
          <span>${t.role}</span>
        </div>
      </div>
    </div>`
    ).join('\n          ');
    sections.push(html`
    <section class="section testimonials">
      <div class="container">
        <div class="section-header reveal">
          <span class="badge">Testimonials</span>
          <h2>What Our Clients Say</h2>
        </div>
        <div class="testimonials-grid stagger">${testimonialsHTML}</div>
      </div>
    </section>`);
  }

  // Partners section
  if (data.partners.length > 0) {
    const partnerPairs = [...data.partners, ...data.partners];
    sections.push(html`
    <section class="partners">
      <div class="container">
        <div class="section-header reveal" style="margin-bottom:var(--space-lg);">
          <span class="badge">Trusted By</span>
          <h2>Partners & Clients</h2>
        </div>
      </div>
      <div class="partners-track">${partnerPairs.map(p => `<span class="partner-item">${p}</span>`).join('\n        ')}</div>
    </section>`);
  }

  // Projects section
  if (data.projects.commercial.length > 0) {
    const featuredProjects = data.projects.commercial.slice(0, 3).map(p =>
      html`
    <div class="project-card">
      <div style="background:linear-gradient(${p.gradient});width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;">${p.icon}</div>
      <span class="project-category">${p.category}</span>
      <div class="project-card-overlay">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
      </div>
    </div>`
    ).join('\n          ');
    sections.push(html`
    <section class="section projects-showcase">
      <div class="container">
        <div class="section-header reveal">
          <span class="badge badge-white">Our Work</span>
          <h2>Featured Projects</h2>
        </div>
        <div class="projects-grid-showcase stagger">${featuredProjects}</div>
        <div style="text-align:center;margin-top:var(--space-xl);" class="reveal">
          <a href="projects.html" class="btn btn-primary">View All Projects</a>
        </div>
      </div>
    </section>`);
  }

  // CTA
  sections.push(ctaSection('Need Pest Control Today?', 'Schedule a free inspection and get a same-day estimate. No obligation, no hidden fees.', 'Schedule Free Inspection', 'contact.html'));

  return pageWrap(
    `${s.title} - ${s.tagline} | ${s.serviceArea}`,
    s.description,
    sections.join('\n\n    ')
  );
}

// ========================
// SERVICES PAGE
// ========================

function generateServices() {
  const isEven = (i) => i % 2 === 0;

  const servicesHTML = data.services.map((svc, i) => {
    const gridClass = isEven(i) ? 'service-detail-grid' : 'service-detail-grid reverse';
    const imgReveal = isEven(i) ? 'reveal-left' : 'reveal-right';
    const contentReveal = isEven(i) ? 'reveal-right' : 'reveal-left';

    return html`
    <div class="${gridClass}" id="${svc.id}">
      <div class="service-detail-image ${imgReveal}">${svc.icon}</div>
      <div class="service-detail-content ${contentReveal}">
        <span class="badge">Service</span>
        <h2>${svc.title}</h2>
        <p>${svc.description}</p>
        <p>${svc.description2}</p>
        <ul class="service-features" style="margin-bottom:var(--space-lg);">
          ${svc.features.map(f => `<li>${f}</li>`).join('\n          ')}
        </ul>
        <a href="contact.html" class="btn btn-primary">${svc.cta}</a>
      </div>
    </div>`;
  }).join('\n\n        ');

  return pageWrap(
    `Pest Control Services | ${s.title}`,
    `Comprehensive pest control services including ${data.services.map(s => s.title.toLowerCase()).join(', ')}.`,
    pageHero('Our Services', 'Comprehensive pest control solutions tailored to your needs. Every service comes with a satisfaction guarantee.') +
    `<section class="section"><div class="container">${servicesHTML}</div></section>` +
    ctaSection('Not Sure Which Service You Need?', 'Call us for a free consultation. We\'ll help you identify the problem and recommend the right solution.', 'Free Consultation', 'contact.html')
  );
}

// ========================
// PROJECTS PAGE
// ========================

function generateProjects() {
  const sections = [];

  function projectGrid(items, badge, title, text) {
    if (items.length === 0) return '';
    const cards = items.map(p => html`
      <div class="project-card">
        <div style="background:linear-gradient(${p.gradient});width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;">${p.icon}</div>
        <span class="project-category">${p.category}</span>
        <div class="project-card-overlay">
          <h3>${p.title}</h3>
          <p>${p.description}</p>
        </div>
      </div>`
    ).join('\n          ');
    return html`
    <section class="section">
      <div class="container">
        <div class="section-header reveal">
          <span class="badge">${badge}</span>
          <h2>${title}</h2>
          <p>${text}</p>
        </div>
        <div class="projects-grid-showcase stagger" style="grid-template-columns:repeat(auto-fit,minmax(340px,1fr));">${cards}</div>
      </div>
    </section>`;
  }

  const commercial = projectGrid(data.projects.commercial, 'Commercial', 'Commercial & Institutional', 'We provide ongoing pest management for businesses, schools, and healthcare facilities.');
  if (commercial) sections.push(commercial);

  const residential = projectGrid(data.projects.residential, 'Residential', 'Residential & Historic', 'Protecting homes of all ages, from new construction to historic properties.');
  if (residential) sections.push(residential);

  const wildlife = projectGrid(data.projects.wildlife, 'Wildlife', 'Wildlife & Exclusion', 'Humane wildlife removal and property exclusion services.');
  if (wildlife) sections.push(wildlife);

  sections.push(ctaSection('Have a Similar Project?', 'We\'d love to help. Contact us today for a free consultation and estimate.', 'Start Your Project', 'contact.html'));

  return pageWrap(
    `Our Projects | ${s.title}`,
    `View ${s.title}'s pest control projects.`,
    pageHero('Our Projects', 'Trusted by homeowners, builders, property managers, and institutions across Central Pennsylvania.') +
    sections.join('\n\n    ')
  );
}

// ========================
// ABOUT PAGE
// ========================

function generateAbout() {
  const sections = [];

  sections.push(html`
    <section class="section">
      <div class="container">
        <div class="about-grid">
          <div class="about-image reveal-scale">🐛</div>
          <div class="about-content reveal-right">
            <span class="badge">Our Story</span>
            <h2>Protecting ${s.serviceArea} Since ${s.founded}</h2>
            ${data.about.story ? `<p>${data.about.story}</p>` : ''}
            ${data.about.story2 ? `<p>${data.about.story2}</p>` : ''}
            ${data.about.story3 ? `<p>${data.about.story3}</p>` : ''}
            <div style="margin-top:var(--space-lg);display:flex;gap:var(--space-md);flex-wrap:wrap;">
              <a href="contact.html" class="btn btn-primary">Get to Know Us</a>
              <a href="tel:${s.phoneRaw}" class="btn btn-outline">Call ${s.phone}</a>
            </div>
          </div>
        </div>
      </div>
    </section>`);

  if (data.about.values.length > 0) {
    const valuesHTML = data.about.values.map(v =>
      html`<div class="value-card"><div class="icon">${v.icon}</div><h3>${v.title}</h3><p>${v.text}</p></div>`
    ).join('\n          ');
    sections.push(html`
    <section class="section" style="background:var(--surface-alt);">
      <div class="container">
        <div class="section-header reveal">
          <span class="badge">Our Values</span>
          <h2>What Sets Us Apart</h2>
        </div>
        <div class="values-grid stagger">${valuesHTML}</div>
      </div>
    </section>`);
  }

  if (data.about.credentials.length > 0) {
    const credentialsHTML = data.about.credentials.map(c =>
      html`<div class="service-card" style="cursor:default;"><div class="service-icon">${c.icon}</div><h3>${c.title}</h3><p>${c.text}</p></div>`
    ).join('\n          ');
    sections.push(html`
    <section class="section" id="licensing">
      <div class="container">
        <div class="section-header reveal">
          <span class="badge">Credentials</span>
          <h2>Licensing & Certifications</h2>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:var(--space-lg);" class="stagger">${credentialsHTML}</div>
      </div>
    </section>`);
  }

  sections.push(ctaSection('Ready to Work With Us?', 'Join hundreds of satisfied customers who trust Bug N\' Out for their pest control needs.', 'Get Started Today', 'contact.html'));

  return pageWrap(
    `About Us | ${s.title}`,
    `Learn about ${s.title} - a family-owned pest control company serving ${s.serviceArea} since ${s.founded}.`,
    pageHero('About Bug N\' Out', 'Family-owned, professionally trained, and committed to protecting your property.') +
    sections.join('\n\n    ')
  );
}

// ========================
// CONTRACTORS PAGE
// ========================

function generateContractors() {
  const sections = [];

  sections.push(html`
    <section class="section">
      <div class="container">
        <div class="section-header reveal">
          <span class="badge">For Contractors</span>
          <h2>Built for the Trades</h2>
          <p>We understand the construction industry. Our contractor program keeps your projects on schedule and compliant.</p>
        </div>
        <div class="values-grid stagger">${data.contractors.benefits.length > 0 ? data.contractors.benefits.map(b =>
          html`<div class="value-card" style="text-align:left;"><div class="icon" style="text-align:center;">${b.icon}</div><h3>${b.title}</h3><p>${b.text}</p></div>`
        ).join('\n          ') : '<p style="grid-column:1/-1;text-align:center;color:var(--gray-400);">Add contractor benefits in data/site.json to display them here.</p>'}</div>
      </div>
    </section>`);

  if (data.contractors.steps.length > 0) {
    const stepsHTML = data.contractors.steps.map(st =>
      html`<div class="service-card" style="text-align:center;padding:var(--space-xl);">
        <div style="width:64px;height:64px;border-radius:50%;background:var(--accent);color:var(--white);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:800;margin:0 auto var(--space-lg);">${st.number}</div>
        <h3>${st.title}</h3>
        <p style="margin:0;">${st.text}</p>
      </div>`
    ).join('\n          ');
    sections.push(html`
    <section class="section" style="background:var(--surface-alt);">
      <div class="container">
        <div class="section-header reveal">
          <span class="badge">How It Works</span>
          <h2>Simple Partnership Process</h2>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:var(--space-lg);" class="stagger">${stepsHTML}</div>
      </div>
    </section>`);
  }

  sections.push(ctaSection('Become a Contractor Partner', 'Join the growing network of builders, developers, and property managers who trust Bug N\' Out.', 'Apply Now', 'contact.html'));

  return pageWrap(
    `Contractor Partnerships | ${s.title}`,
    `${s.title} offers contractor partnership programs with priority scheduling, multi-unit discounts, and full compliance documentation.`,
    pageHero('Contractor Partnerships', 'Reliable pest control solutions designed for construction and property professionals.') +
    sections.join('\n\n    ')
  );
}

// ========================
// FAQ PAGE
// ========================

function generateFaq() {
  const faqHTML = data.faq.length > 0 ? data.faq.map(f =>
    html`
    <div class="faq-item reveal">
      <button class="faq-question">
        <span>${f.question}</span>
        <span class="icon">+</span>
      </button>
      <div class="faq-answer"><p>${f.answer}</p></div>
    </div>`
  ).join('\n          ') : '<p style="text-align:center;color:var(--gray-400);padding:var(--space-xl);">No FAQs added yet. Edit data/site.json to add questions and answers.</p>';

  return pageWrap(
    `FAQ | ${s.title}`,
    `Frequently asked questions about ${s.title} pest control services, treatments, pricing, and service areas.`,
    pageHero('Frequently Asked Questions', 'Everything you need to know about our pest control services.') +
    `<section class="section"><div class="container-narrow"><div class="faq-list">${faqHTML}</div></div></section>` +
    ctaSection('Still Have Questions?', 'We\'re here to help. Reach out and we\'ll get back to you promptly.', 'Contact Us', 'contact.html')
  );
}

// ========================
// CONTACT PAGE
// ========================

function generateContact() {
  const contactCardsHTML = [
    { icon: '📞', title: 'Call Us', info: `<a href="tel:${s.phoneRaw}"><strong>${s.phone}</strong></a>`, extra: 'Mon–Fri, 8am–6pm<br>Saturday appointments available' },
    { icon: '✉️', title: 'Email', info: `<a href="mailto:${s.email}"><strong>${s.email}</strong></a>`, extra: 'We usually reply within 24 hours' },
    { icon: '📍', title: 'Service Area', info: `<strong>${s.serviceArea}</strong>`, extra: data.serviceAreas.join(' • ') },
    { icon: '🕐', title: 'Emergency Service', info: '<strong>Available 24/7 for urgent issues</strong>', extra: 'Call our emergency line for immediate assistance' },
  ].map(c =>
    html`<div class="contact-info-card"><div class="icon">${c.icon}</div><h3>${c.title}</h3><p>${c.info}</p><p style="font-size:0.85rem;margin-top:4px;">${c.extra}</p></div>`
  ).join('\n            ');

  const serviceOptions = data.services.map(svc =>
    `<option value="${svc.id}">${svc.title}</option>`
  ).join('\n                  ');

  return pageWrap(
    `Contact Us | ${s.title}`,
    `Contact ${s.title} for residential and commercial pest control services. Free inspections available across ${s.serviceArea}.`,
    pageHero('Contact Bug N\' Out', 'Have a pest problem? Reach out today for fast, professional service. Free inspections available.') +
    html`
    <section class="section">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-form-wrap reveal">
            <h2>Request Service</h2>
            <p style="color:var(--gray-500);margin-bottom:var(--space-lg);">Fill out the form below and our team will contact you shortly.</p>
            <form id="contact-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="name">Full Name *</label>
                  <input type="text" id="name" name="name" placeholder="Your full name" required>
                </div>
                <div class="form-group">
                  <label for="phone">Phone Number *</label>
                  <input type="tel" id="phone" name="phone" placeholder="(555) 123-4567" required>
                </div>
              </div>
              <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" placeholder="your@email.com">
              </div>
              <div class="form-group">
                <label for="service">Service Needed *</label>
                <select id="service" name="service" required>
                  <option value="">Select a service...</option>
                  ${serviceOptions}
                  <option value="other">Other / Not Sure</option>
                </select>
              </div>
              <div class="form-group">
                <label for="message">Describe Your Pest Issue</label>
                <textarea id="message" name="message" placeholder="Tell us about the problem you're experiencing..."></textarea>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;padding:16px;font-size:1.05rem;">Send Request</button>
            </form>
          </div>
          <div class="contact-info-cards stagger">${contactCardsHTML}</div>
        </div>
      </div>
    </section>` +
    ctaSection('We\'re Ready to Help', 'Call us now for immediate assistance or to schedule your free inspection.', `Call ${s.phone}`, `tel:${s.phoneRaw}`)
  );
}

// ========================
// 404 PAGE
// ========================

function generate404() {
  return html`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Page not found - ${s.title}" />
  <title>404 - Page Not Found | ${s.title}</title>
  <link rel="icon" href="${s.favicon}" />
  <link rel="stylesheet" href="css/main.css?v=${BUILD_TIME}" />
  <script src="js/main.js?v=${BUILD_TIME}" defer></script>
  <script src="js/animations.js?v=${BUILD_TIME}" defer></script>
</head>
<body>
  <div id="header-container"></div>
  <main class="page-404">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you're looking for doesn't exist or has been moved. Let us know if you think something's broken.</p>
    <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center;">
      <a href="index.html" class="btn btn-primary btn-lg">Return Home</a>
      <a href="contact.html" class="btn btn-secondary btn-lg" style="border-color:rgba(255,255,255,0.3);">Report Issue</a>
    </div>
  </main>
  <div id="footer-container"></div>
</body>
</html>`;
}

// ========================
// WRITE ALL PAGES
// ========================

const pages = {
  'index.html': generateIndex(),
  'services.html': generateServices(),
  'projects.html': generateProjects(),
  'about.html': generateAbout(),
  'contractors.html': generateContractors(),
  'faq.html': generateFaq(),
  'contact.html': generateContact(),
  '404.html': generate404(),
};

for (const [filename, content] of Object.entries(pages)) {
  const outputPath = join(outputDir, filename);
  writeFileSync(outputPath, content);
  console.log('Generated ' + filename);
}

console.log('\n✓ Build complete! Output in the "generated" directory.');