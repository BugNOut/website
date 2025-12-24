document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();
    form.innerHTML = "<h3>Thank you! We'll be in touch shortly.</h3>";
  });
});
