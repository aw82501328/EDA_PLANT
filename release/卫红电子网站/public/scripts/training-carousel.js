import { escapeHtml as html, icon } from './ui.js';

export function trainingCarousel(photos) {
  return `<section class="training-carousel" aria-label="培训照片" aria-roledescription="轮播图">
    <div class="training-carousel-stage" data-carousel-stage>
      ${photos.map(({ src, width, height, alt, caption }, index) => `
        <figure class="training-carousel-slide"${index ? ' hidden' : ''}>
          <img src="${html(src)}" width="${width}" height="${height}" alt="${html(alt)}" loading="lazy" decoding="async" draggable="false">
          <figcaption>${html(caption)}</figcaption>
        </figure>`).join('')}
    </div>
    <div class="training-carousel-toolbar">
      <button type="button" class="training-carousel-rotation" data-carousel-rotation>播放轮播</button>
      <div class="training-carousel-controls">
        <button type="button" data-carousel-step="-1" aria-label="上一张照片">${icon('chevron')}</button>
        <span data-carousel-count>1 / ${photos.length}</span>
        <button type="button" data-carousel-step="1" aria-label="下一张照片">${icon('chevron')}</button>
      </div>
    </div>
    <span class="training-carousel-announcement" role="status" data-carousel-status></span>
  </section>`;
}

export function bindTrainingCarousel(container) {
  const carousel = container.querySelector('.training-carousel');
  const stage = carousel.querySelector('[data-carousel-stage]');
  const slides = [...stage.querySelectorAll('figure')];
  const rotation = carousel.querySelector('[data-carousel-rotation]');
  const count = carousel.querySelector('[data-carousel-count]');
  const status = carousel.querySelector('[data-carousel-status]');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let playing = !motionPreference.matches;
  let inView = false;
  let hovering = false;
  let timer;
  let touchStart;

  function show(index) {
    slides[active].hidden = true;
    active = (index + slides.length) % slides.length;
    slides[active].hidden = false;
    count.textContent = `${active + 1} / ${slides.length}`;
  }

  function schedule() {
    clearTimeout(timer);
    if (playing && inView && !hovering && !document.hidden) {
      timer = setTimeout(() => {
        show(active + 1);
        schedule();
      }, 6500);
    }
  }

  function setPlaying(value) {
    playing = value;
    rotation.textContent = playing ? '暂停轮播' : '播放轮播';
    schedule();
  }

  function step(direction) {
    setPlaying(false);
    show(active + direction);
    status.textContent = `第 ${active + 1} 张，共 ${slides.length} 张。${slides[active].querySelector('figcaption').textContent}`;
  }

  for (const button of carousel.querySelectorAll('[data-carousel-step]')) {
    button.addEventListener('click', () => step(Number(button.dataset.carouselStep)));
  }
  rotation.addEventListener('click', () => setPlaying(!playing));
  carousel.addEventListener('keydown', (event) => {
    const direction = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (!direction) return;
    event.preventDefault();
    step(direction);
  });
  carousel.addEventListener('focusin', (event) => {
    if (playing && event.target.matches(':focus-visible')) setPlaying(false);
  });
  carousel.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse') return;
    hovering = true;
    schedule();
  });
  carousel.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse') return;
    hovering = false;
    schedule();
  });
  stage.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch' && event.isPrimary) touchStart = [event.clientX, event.clientY];
  });
  stage.addEventListener('pointerup', (event) => {
    if (!touchStart || event.pointerType !== 'touch' || !event.isPrimary) return;
    const shiftX = event.clientX - touchStart[0];
    const shiftY = event.clientY - touchStart[1];
    touchStart = undefined;
    if (Math.abs(shiftX) > 45 && Math.abs(shiftX) > Math.abs(shiftY)) step(shiftX < 0 ? 1 : -1);
  });
  stage.addEventListener('pointercancel', () => { touchStart = undefined; });
  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches) setPlaying(false);
  });
  document.addEventListener('visibilitychange', schedule);
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.intersectionRatio >= .4;
    schedule();
  }, { threshold: .4 });
  observer.observe(stage);
  setPlaying(playing);
}
