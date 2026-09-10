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
const shareButton = document.getElementById('shareSite');

if (shareButton) {
  const defaultLabel = shareButton.innerHTML;
  const publicUrl = /^https?:$/.test(window.location.protocol)
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://anton890304.github.io/my-site1/';

  const showShareStatus = (label, isSuccess = false) => {
    shareButton.innerHTML = `${label} <span>${isSuccess ? '✓' : '↗'}</span>`;
    shareButton.classList.toggle('is-success', isSuccess);

    window.setTimeout(() => {
      shareButton.innerHTML = defaultLabel;
      shareButton.classList.remove('is-success');
    }, 2400);
  };

  const copySiteUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
    } catch {
      const temporaryInput = document.createElement('textarea');
      temporaryInput.value = publicUrl;
      temporaryInput.setAttribute('readonly', '');
      temporaryInput.style.position = 'fixed';
      temporaryInput.style.opacity = '0';
      document.body.appendChild(temporaryInput);
      temporaryInput.select();
      document.execCommand('copy');
      temporaryInput.remove();
    }

    showShareStatus('Ссылка скопирована', true);
  };

  shareButton.addEventListener('click', async () => {
    const isMobileDevice = navigator.userAgentData?.mobile === true
      || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const prefersNativeShare = typeof navigator.share === 'function' && isMobileDevice;

    if (prefersNativeShare) {
      try {
        await navigator.share({
          title: document.title,
          text: 'Мне кажется, вам нужно пообщаться',
          url: publicUrl,
        });
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }

    await copySiteUrl();
  });
}