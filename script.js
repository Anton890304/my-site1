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
const questionDataElement = document.getElementById('questionRandomizerData');
const questionMachine = document.getElementById('questionMachine');
const questionMachineWindow = document.getElementById('questionMachineWindow');
const questionReel = document.getElementById('questionReel');
const randomCategory = document.getElementById('randomCategory');
const topicButtons = [...document.querySelectorAll('.topic-button')];

if (questionDataElement && questionMachine && questionMachineWindow && questionReel && randomCategory && topicButtons.length) {
  const questionData = JSON.parse(questionDataElement.textContent);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const allQuestions = Object.values(questionData)
    .filter((category) => Array.isArray(category.questions))
    .flatMap((category) => category.questions);
  let activeRun = 0;
  let finishTimeout;

  const shuffleQuestions = (questions) => {
    const shuffled = [...questions];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
  };

  const renderQuestionReel = (questions) => {
    const items = questions.map((question) => {
      const item = document.createElement('p');
      item.className = 'question-reel-item';
      item.textContent = question;
      return item;
    });
    questionReel.replaceChildren(...items);
  };

  topicButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const currentRun = ++activeRun;
      const topic = button.dataset.topic;
      const category = questionData[topic];
      if (!category) return;

      const sourceQuestions = category.mode === 'all' ? allQuestions : category.questions;
      if (!sourceQuestions?.length) return;

      window.clearTimeout(finishTimeout);
      topicButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      randomCategory.textContent = category.label;
      questionReel.setAttribute('aria-busy', 'true');

      const shuffled = shuffleQuestions(sourceQuestions);
      const finalQuestion = shuffled[0];
      const reelQuestions = shuffled.slice(1, Math.min(12, shuffled.length));
      reelQuestions.push(finalQuestion);

      const finish = () => {
        if (currentRun !== activeRun) return;
        questionMachine.classList.remove('is-spinning');
        questionReel.style.transition = 'none';
        questionReel.style.transform = 'translateY(0)';
        renderQuestionReel([finalQuestion]);
        questionReel.setAttribute('aria-busy', 'false');
      };

      if (reduceMotion.matches) {
        finish();
        return;
      }

      renderQuestionReel(reelQuestions);
      const windowHeight = questionMachineWindow.clientHeight;
      const distance = (reelQuestions.length - 1) * windowHeight;
      const duration = 1250 + reelQuestions.length * 35;
      questionReel.style.setProperty('--question-window-height', `${windowHeight}px`);
      questionReel.style.transition = 'none';
      questionReel.style.transform = 'translateY(0)';
      questionMachine.classList.add('is-spinning');
      void questionReel.offsetHeight;

      window.requestAnimationFrame(() => {
        if (currentRun !== activeRun) return;
        questionReel.style.transition = `transform ${duration}ms cubic-bezier(.12, .72, .18, 1)`;
        questionReel.style.transform = `translateY(-${distance}px)`;
      });

      finishTimeout = window.setTimeout(finish, duration + 80);
    });
  });
}