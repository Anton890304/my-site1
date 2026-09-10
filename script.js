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
const qaTrack = document.getElementById('qaTrack');
const qaPrevious = document.querySelector('.qa-prev');
const qaNext = document.querySelector('.qa-next');
const qaCurrent = document.getElementById('qaCurrent');

if (qaTrack && qaPrevious && qaNext && qaCurrent) {
  const qaCards = [...qaTrack.querySelectorAll('.qa-card')];
  let scrollFrame;

  const getMetrics = () => {
    const firstCard = qaCards[0];
    const styles = window.getComputedStyle(qaTrack);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    const step = firstCard.getBoundingClientRect().width + gap;
    const visibleCards = Math.max(1, Math.round((qaTrack.clientWidth + gap) / step));
    return { step, visibleCards };
  };

  const getCurrentIndex = () => {
    const { step } = getMetrics();
    return Math.max(0, Math.min(qaCards.length - 1, Math.round(qaTrack.scrollLeft / step)));
  };

  const updateQaControls = () => {
    const currentIndex = getCurrentIndex();
    const { visibleCards } = getMetrics();
    qaCurrent.textContent = String(currentIndex + 1).padStart(2, '0');
    qaPrevious.disabled = currentIndex === 0;
    qaNext.disabled = currentIndex >= qaCards.length - visibleCards;
  };

  const moveQaCarousel = (direction) => {
    const currentIndex = getCurrentIndex();
    const { step, visibleCards } = getMetrics();
    const lastStart = Math.max(0, qaCards.length - visibleCards);
    const targetIndex = Math.max(0, Math.min(lastStart, currentIndex + direction * visibleCards));
    qaTrack.scrollTo({ left: targetIndex * step, behavior: 'smooth' });
  };

  qaPrevious.addEventListener('click', () => moveQaCarousel(-1));
  qaNext.addEventListener('click', () => moveQaCarousel(1));

  qaTrack.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      moveQaCarousel(event.key === 'ArrowRight' ? 1 : -1);
    }
  });

  qaTrack.addEventListener('scroll', () => {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(updateQaControls);
  }, { passive: true });

  window.addEventListener('resize', updateQaControls);
  updateQaControls();
}