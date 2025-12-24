const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in");
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll("[data-animate]").forEach(el => observer.observe(el));

window.addEventListener("scroll", () => {
  const bg = document.querySelector(".hero-bg");
  if (bg) {
    bg.style.transform = `translateY(${window.scrollY * 0.4}px)`;
  }
});
