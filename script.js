const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.getElementById('contactButton').addEventListener('click', () => {
  const hint = document.getElementById('contactHint');
  hint.hidden = false;
  hint.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
