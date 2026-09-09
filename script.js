const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); }); }, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
const carousel = document.getElementById('photoCarousel');
document.querySelector('.next')?.addEventListener('click', () => carousel.scrollBy({ left: carousel.clientWidth * 0.82, behavior: 'smooth' }));
document.querySelector('.prev')?.addEventListener('click', () => carousel.scrollBy({ left: -carousel.clientWidth * 0.82, behavior: 'smooth' }));
document.querySelectorAll('.facts-grid .fact').forEach((fact) => {
  fact.setAttribute('role', 'button');
  fact.setAttribute('tabindex', '0');
  fact.setAttribute('aria-expanded', 'false');

  const toggleFact = () => {
    const isOpen = fact.classList.toggle('open');
    fact.setAttribute('aria-expanded', String(isOpen));
  };

  fact.addEventListener('click', toggleFact);
  fact.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleFact();
    }
  });
});