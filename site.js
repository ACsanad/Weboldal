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

    const inEl       = container.querySelector('#calc-checkin');
    const outEl      = container.querySelector('#calc-checkout');
    const adultsEl   = container.querySelector('#calc-adults');
    const childrenEl = container.querySelector('#calc-children');
    const resultEl   = container.querySelector('#calc-result');
    const inquiryEl  = container.querySelector('#calc-inquiry');

    inEl.min = todayStr;
    inEl.value = todayStr;
    outEl.min = tomorrow;
    outEl.value = tomorrow;

    adultsEl.min = 1;
    adultsEl.max = cfg.maxGuests;
    adultsEl.value = 1;

    childrenEl.min = 0;
    childrenEl.max = cfg.maxGuests - 1;
    childrenEl.value = 0;

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

      let adults   = parseInt(adultsEl.value, 10) || 0;
      let children = parseInt(childrenEl.value, 10) || 0;
      let guestWarning = '';

      if (adults < 1) {
        adults = 1;
        adultsEl.value = adults;
      }

      if (adults + children > cfg.maxGuests) {
        // Fewer children if over the limit, keep adults as entered
        children = Math.max(0, cfg.maxGuests - adults);
        childrenEl.value = children;
        guestWarning = `<p class="calc-warning">Ez a szoba legfeljebb ${cfg.maxGuests} főt fogad.</p>`;
      }

      if (!nights || nights < (PRICING_CONFIG.minNights || 1) || isNaN(nights)) {
        const minN = PRICING_CONFIG.minNights || 1;
        resultEl.innerHTML = `<p class="calc-warning">Válassz érvényes dátumokat (legalább ${minN} éjszaka).</p>`;
        inquiryEl.setAttribute('aria-disabled', 'true');
        inquiryEl.href = '#';
        return;
      }

      const season = seasonMultiplierFor(inEl.value);
      const adultRate = cfg.pricePerAdultNight * season.m;
      const childRate = cfg.pricePerChildNight * season.m;

      const adultsTotal = adultRate * adults * nights;
      const childrenTotal = childRate * children * nights;
      const cleaningFee = cfg.cleaningFee || 0;
      const total = adultsTotal + childrenTotal + cleaningFee;

      let rows = `<div class="calc-line"><span>${adults} felnőtt × ${fmt(adultRate)} × ${nights} éj</span><span>${fmt(adultsTotal)}</span></div>`;
      if (children > 0) {
        rows += `<div class="calc-line"><span>${children} gyermek × ${fmt(childRate)} × ${nights} éj</span><span>${fmt(childrenTotal)}</span></div>`;
      }
      if (season.label) {
        rows += `<div class="calc-line calc-line-note"><span>${season.label} időszak — árban érvényesítve</span></div>`;
      }
      rows += `<div class="calc-line"><span>Takarítási díj (egyszeri)</span><span>${fmt(cleaningFee)}</span></div>`;
      rows += `<div class="calc-line calc-total"><span>Összesen</span><span>${fmt(total)}</span></div>`;

      resultEl.innerHTML = guestWarning + rows;

      const subject = `Ajánlatkérés – ${room.name}`;
      const body =
        `Szép napot!\n\nÉrdeklődnék az alábbi foglalás felől:\n\n` +
        `Szoba: ${room.name}\n` +
        `Érkezés: ${inEl.value}\n` +
        `Távozás: ${outEl.value}\n` +
        `Éjszakák száma: ${nights}\n` +
        `Felnőttek száma: ${adults} fő\n` +
        `Gyermekek száma: ${children} fő\n` +
        `Becsült ár a kalkulátor alapján (takarítással együtt): ${fmt(total)}\n\n` +
        `Kérlek, erősítsétek meg a foglalást / az árat.\n\nKöszönöm!`;
      inquiryEl.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      inquiryEl.removeAttribute('aria-disabled');
    }

    // 'input' esemény: azonnal frissít gépelés/csúszka mozgatás közben is
    // 'change' esemény: dátumválasztóknál (néhány böngészőben ez a megbízhatóbb)
    [inEl, outEl, adultsEl, childrenEl].forEach(el => {
      el.addEventListener('input', () => {
        if (el === inEl || el === outEl) {
          if (new Date(outEl.value) <= new Date(inEl.value)) {
            const next = new Date(inEl.value); next.setDate(next.getDate() + 1);
            outEl.value = next.toISOString().slice(0, 10);
          }
          outEl.min = (() => { const d = new Date(inEl.value); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); })();
        }
        calc();
      });
      el.addEventListener('change', calc);
    });

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
