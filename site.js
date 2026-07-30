// ============================================================
//  KÖZÖS OLDAL-LOGIKA — slideshow, lightbox, mobil menü, fade-in
//  Használja: index.html és szoba.html
// ============================================================

const Site = (() => {
  'use strict';

  // ── Lightbox ──────────────────────────────────────────────
  let lbOverlay, lbImg, lbCounter, lbImages = [], lbCur = 0;

  function initLightbox() {
    lbOverlay = document.getElementById('lb-overlay');
    lbImg     = document.getElementById('lb-img');
    lbCounter = document.getElementById('lb-counter');
    if (!lbOverlay) return;

    document.getElementById('lb-close').addEventListener('click', closeLightbox);
    document.getElementById('lb-prev').addEventListener('click', () => lbNav(-1));
    document.getElementById('lb-next').addEventListener('click', () => lbNav(1));
    lbOverlay.addEventListener('click', e => { if (e.target === lbOverlay) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (!lbOverlay.classList.contains('open')) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  lbNav(-1);
      if (e.key === 'ArrowRight') lbNav(1);
    });
  }

  function openLightbox(imgs, idx) {
    lbImages = imgs;
    lbCur = idx;
    lbOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateLightbox();
  }
  function closeLightbox() {
    lbOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  function updateLightbox() {
    lbImg.src = lbImages[lbCur];
    lbCounter.textContent = `${lbCur + 1} / ${lbImages.length}`;
  }
  function lbNav(dir) {
    lbCur = (lbCur + dir + lbImages.length) % lbImages.length;
    updateLightbox();
  }

  // ── Slideshow gyár ────────────────────────────────────────
  function initSlideshow(container, imagePaths, autoDelay) {
    const track  = container.querySelector('.slideshow-track');
    const dotsEl = container.querySelector('.slide-dots');
    const prevBtn = container.querySelector('.slide-btn.prev');
    const nextBtn = container.querySelector('.slide-btn.next');

    imagePaths.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.loading = 'lazy';
      track.appendChild(img);
    });

    const slides = Array.from(track.children);
    const count  = slides.length;

    if (count <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
    }

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `${i + 1}. kép`);
      dot.addEventListener('click', () => { goTo(i); resetTimer(); });
      dotsEl.appendChild(dot);
    });

    let current = 0;
    let timer = null;

    function goTo(n) {
      current = ((n % count) + count) % count;
      track.style.transition = 'none';
      track.style.transform  = `translateX(-${current * 100}%)`;
      requestAnimationFrame(() => {
        track.style.transition = 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)';
      });
      dotsEl.querySelectorAll('.slide-dot').forEach((d, i) =>
        d.classList.toggle('active', i === current)
      );
    }

    track.style.transition = 'none';
    track.style.transform  = 'translateX(0)';

    function resetTimer() {
      if (!autoDelay) return;
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), autoDelay);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

    if (autoDelay) timer = setInterval(() => goTo(current + 1), autoDelay);

    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { goTo(current + (diff > 0 ? 1 : -1)); resetTimer(); }
    }, { passive: true });

    slides.forEach((img, idx) => {
      img.addEventListener('click', () => openLightbox(imagePaths, idx));
    });
  }

  // ── Mobil menü ────────────────────────────────────────────
  function initMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const menu   = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => menu.classList.remove('open'))
    );
    document.addEventListener('click', e => {
      if (!menu.classList.contains('open')) return;
      if (!menu.contains(e.target) && !toggle.contains(e.target)) menu.classList.remove('open');
    });
  }

  // ── Fade-in megfigyelő ────────────────────────────────────
  function initFadeIn() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => io.observe(el));
    return io;
  }

  function refreshFadeIn(io, selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.remove('visible');
      io.observe(el);
    });
  }

  // ── Árkalkulátor ──────────────────────────────────────────
  function initPriceCalculator(container, room, contactEmail) {
    const cfg = (typeof PRICING_CONFIG !== 'undefined') && PRICING_CONFIG.rooms[room.id];
    if (!cfg) {
      container.innerHTML = `<p class="calc-missing">Az árkalkulátor jelenleg nem elérhető ehhez a szobához — kérjük, érdeklődj telefonon vagy e-mailben.</p>`;
      return;
    }

    const fmt = n => new Intl.NumberFormat('hu-HU').format(Math.round(n)) + ' ' + PRICING_CONFIG.currency;
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const tomorrow = new Date(today.getTime() + 86400000).toISOString().slice(0, 10);

    const inEl      = container.querySelector('#calc-checkin');
    const outEl     = container.querySelector('#calc-checkout');
    const guestsEl  = container.querySelector('#calc-guests');
    const resultEl  = container.querySelector('#calc-result');
    const inquiryEl = container.querySelector('#calc-inquiry');

    inEl.min = todayStr;
    inEl.value = todayStr;
    outEl.min = tomorrow;
    outEl.value = tomorrow;
    guestsEl.min = 1;
    guestsEl.max = cfg.maxGuests;
    guestsEl.value = Math.min(cfg.includedGuests, cfg.maxGuests);

    function seasonMultiplierFor(dateStr) {
      const seasons = (typeof PRICING_CONFIG !== 'undefined') && PRICING_CONFIG.seasons || [];
      const d = new Date(dateStr);
      for (const s of seasons) {
        if (d >= new Date(s.start) && d <= new Date(s.end)) return { m: s.multiplier, label: s.label };
      }
      return { m: 1, label: null };
    }

    function calc() {
      const inDate  = new Date(inEl.value);
      const outDate = new Date(outEl.value);
      const nights = Math.round((outDate - inDate) / 86400000);

      let guests = parseInt(guestsEl.value, 10) || 1;
      let guestWarning = '';
      if (guests > cfg.maxGuests) {
        guests = cfg.maxGuests;
        guestsEl.value = guests;
        guestWarning = `<p class="calc-warning">Ez a szoba legfeljebb ${cfg.maxGuests} főt fogad.</p>`;
      }

      if (!nights || nights < (PRICING_CONFIG.minNights || 1) || isNaN(nights)) {
        const minN = PRICING_CONFIG.minNights || 1;
        resultEl.innerHTML = `<p class="calc-warning">Válassz érvényes dátumokat (legalább ${minN} éjszaka).</p>`;
        inquiryEl.setAttribute('aria-disabled', 'true');
        inquiryEl.href = '#';
        return;
      }

      const extraGuests = Math.max(0, guests - cfg.includedGuests);
      const season = seasonMultiplierFor(inEl.value);
      const perNight = cfg.pricePerNight * season.m;
      const roomTotal = perNight * nights;
      const extraTotal = extraGuests * cfg.extraGuestFee * nights;
      const total = roomTotal + extraTotal;

      let rows = `<div class="calc-line"><span>${nights} éjszaka × ${fmt(perNight)}</span><span>${fmt(roomTotal)}</span></div>`;
      if (extraGuests > 0) {
        rows += `<div class="calc-line"><span>+${extraGuests} fő × ${fmt(cfg.extraGuestFee)} × ${nights} éj</span><span>${fmt(extraTotal)}</span></div>`;
      }
      if (season.label) {
        rows += `<div class="calc-line calc-line-note"><span>${season.label} időszak — árban érvényesítve</span></div>`;
      }
      rows += `<div class="calc-line calc-total"><span>Összesen</span><span>${fmt(total)}</span></div>`;

      resultEl.innerHTML = guestWarning + rows;

      const subject = `Ajánlatkérés – ${room.name}`;
      const body =
        `Szia!\n\nÉrdeklődnék az alábbi foglalás felől:\n\n` +
        `Szoba: ${room.name}\n` +
        `Érkezés: ${inEl.value}\n` +
        `Távozás: ${outEl.value}\n` +
        `Éjszakák száma: ${nights}\n` +
        `Vendégek száma: ${guests} fő\n` +
        `Becsült ár a kalkulátor alapján: ${fmt(total)}\n\n` +
        `Kérlek, erősítsétek meg a foglalást / az árat.\n\nKöszönöm!`;
      inquiryEl.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      inquiryEl.removeAttribute('aria-disabled');
    }

    [inEl, outEl, guestsEl].forEach(el => el.addEventListener('change', () => {
      if (new Date(outEl.value) <= new Date(inEl.value)) {
        const next = new Date(inEl.value); next.setDate(next.getDate() + 1);
        outEl.value = next.toISOString().slice(0, 10);
      }
      outEl.min = (() => { const d = new Date(inEl.value); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); })();
      calc();
    }));

    calc();
  }

  // ── Térkép beágyazás ──────────────────────────────────────
  function initMap(iframeEl, address) {
    if (!iframeEl) return;
    iframeEl.src = 'https://www.google.com/maps?q=' + encodeURIComponent(address) + '&output=embed';
  }

  document.addEventListener('DOMContentLoaded', () => {
    initLightbox();
    initMobileMenu();
  });

  return { initSlideshow, initFadeIn, refreshFadeIn, openLightbox, initPriceCalculator, initMap };
})();
