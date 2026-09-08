const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); }); }, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
const carousel = document.getElementById('photoCarousel');
document.querySelector('.next')?.addEventListener('click', () => carousel.scrollBy({ left: carousel.clientWidth * 0.82, behavior: 'smooth' }));
document.querySelector('.prev')?.addEventListener('click', () => carousel.scrollBy({ left: -carousel.clientWidth * 0.82, behavior: 'smooth' }));