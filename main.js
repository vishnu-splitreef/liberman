(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const SITE = 'https://liebermanfirm.com';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header scroll state ---------- */
  const header = $('#header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav ---------- */
  const burger = $('#burger');
  const nav = $('#nav');
  if (burger && nav && header) {
    const setNavTop = () => { nav.style.top = header.getBoundingClientRect().bottom + 'px'; };
    burger.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') !== 'true';
      if (open) setNavTop();
      burger.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('.has-mega > .nav__link').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const open = !item.classList.contains('is-open');
        item.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
      });
    });
    $$('#nav a').forEach(a => a.addEventListener('click', () => {
      burger.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
    }));
  }

  /* ---------- Reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    $$('.reveal').forEach(el => el.classList.add('is-in'));
  }

  /* ---------- Card / ledger pointer glow ---------- */
  const fine = window.matchMedia('(pointer: fine)').matches;
  $$('.card, .ledger a').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
      if (fine && card.hasAttribute('data-tilt')) {
        const rx = ((y / r.height) - .5) * -4;
        const ry = ((x / r.width) - .5) * 4;
        card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });

  /* ---------- Matter Navigator (home only) ---------- */
  const navForm = $('#navForm');
  if (navForm) {
    const routes = [
      { k: ['quiet title', 'title dispute', 'claim', 'claiming', 'ownership', 'boundary', 'heir', 'cloud on title', 'adverse', 'quit claim', 'quitclaim', 'deed'],
        area: 'Real Estate Law', name: 'Quiet Title', url: 'quiet-title-attorney-jacksonville-fl.html',
        desc: 'Clearing competing claims, defects or clouds on your property title so ownership is secure.' },
      { k: ['mortgage', 'foreclos', 'lien', 'refinanc', 'tax deed', 'loan modification'],
        area: 'Real Estate Law', name: 'Mortgage Law', url: 'mortgage-lawyer-jacksonville-fl.html',
        desc: 'Guidance on mortgages, liens, tax deed issues and the rights tied to your property.' },
      { k: ['zoning', 'rezoning', 'variance', 'land use', 'permit', 'develop'],
        area: 'Real Estate Law', name: 'Zoning & Land Development', url: 'zoning-land-development-attorney-jacksonville-fl.html',
        desc: 'Variances, rezoning, permits and land use approvals for owners, builders and developers.' },
      { k: ['title search', 'title insurance', 'closing', 'buying', 'selling', 'purchase', 'psa', 'contract', 'redline'],
        area: 'Real Estate Law', name: 'Title Search & Closings', url: 'title-search-lawyer-jacksonville-fl.html',
        desc: 'Title examinations, purchase agreement review and closings handled with precision.' },
      { k: ['evict', 'tenant', 'lease', 'landlord', 'rent'],
        area: 'Real Estate Law', name: 'Commercial Eviction', url: 'eviction-attorneys-jacksonville-fl.html',
        desc: 'Representation for commercial landlords and lease disputes in Florida.' },
      { k: ['commercial loan', 'lender', 'lending', 'borrower', 'financing', 'bank', 'loan', 'credit facility'],
        area: 'Finance', name: 'Commercial Lending', url: 'commercial-lending-lawyer-jacksonville-fl.html',
        desc: 'Counsel for lenders, borrowers and financial institutions on sound, secure loan agreements.' },
      { k: ['car', 'auto', 'crash', 'truck', 'collision', 'vehicle', 'motorcycle', 'rear-ended', 'hit'],
        area: 'Personal Injury', name: 'Car Accident', url: 'car-accident-lawyer-jacksonville-fl.html',
        desc: 'Pursuing the compensation you are entitled to after a vehicle accident.' },
      { k: ['died', 'death', 'killed', 'passed away', 'fatal', 'wrongful'],
        area: 'Personal Injury', name: 'Wrongful Death', url: 'wrongful-death-lawyer-jacksonville-fl.html',
        desc: 'Compassionate, determined representation for families who have lost a loved one.' },
      { k: ['doctor', 'hospital', 'surgery', 'misdiagnos', 'malpractice', 'medical', 'nurse'],
        area: 'Personal Injury', name: 'Medical Malpractice', url: 'medical-malpractice-lawyer-jacksonville-fl.html',
        desc: 'Holding providers accountable when medical care falls below the standard.' },
      { k: ['brain', 'head', 'concussion', 'tbi'],
        area: 'Personal Injury', name: 'Traumatic Brain Injury', url: 'traumatic-brain-injury-lawyer-jacksonville-fl.html',
        desc: 'Advocacy for victims of head and brain injuries and their long-term needs.' },
      { k: ['spinal', 'paralys', 'amputat', 'burn', 'catastroph', 'permanent'],
        area: 'Personal Injury', name: 'Catastrophic Injury', url: 'catastrophic-injury-lawyer-jacksonville-fl.html',
        desc: 'Life-changing injuries demand vigorous representation and full compensation.' },
      { k: ['injur', 'hurt', 'accident', 'slip', 'fall', 'pain'],
        area: 'Personal Injury', name: 'Personal Injury', url: 'personal-injury-lawyer-jacksonville-fl.html',
        desc: 'If you or a loved one has been injured, we fight for the compensation you deserve.' },
      { k: ['property', 'real estate', 'house', 'home', 'land', 'condo', 'commercial property'],
        area: 'Practice', name: 'Real Estate Law', url: 'real-estate-lawyer-jacksonville-fl.html',
        desc: 'Residential and commercial real estate matters, led by a Florida Bar certified expert.' }
    ];

    const navInput = $('#navInput');
    const navResult = $('#navResult');
    let timer;

    const match = q => {
      q = q.toLowerCase();
      let best = null, score = 0;
      routes.forEach(r => {
        const s = r.k.reduce((n, k) => n + (new RegExp('\\b' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(q) ? k.length : 0), 0);
        if (s > score) { score = s; best = r; }
      });
      return best;
    };

    const route = q => {
      if (!q.trim()) { navInput.focus(); return; }
      clearTimeout(timer);
      navResult.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
      timer = setTimeout(() => {
        const r = match(q);
        if (r) {
          navResult.innerHTML =
            `<small>Suggested · ${r.area}</small><strong>${r.name}</strong><p>${r.desc}</p>` +
            `<div class="res-actions"><a href="${r.url}">Learn more →</a><a href="#contact">Free consultation</a></div>`;
        } else {
          navResult.innerHTML =
            '<small>Let’s talk it through</small><strong>Every situation is different.</strong>' +
            '<p>Call 904-257-3673 or request a free consultation and our team will point you to the right attorney.</p>' +
            '<div class="res-actions"><a href="#contact">Free consultation</a><a href="tel:9042573673">Call now</a></div>';
        }
      }, 650);
    };

    navForm.addEventListener('submit', e => { e.preventDefault(); route(navInput.value); });
    $$('#navChips button').forEach(b => b.addEventListener('click', () => {
      navInput.value = b.dataset.q;
      route(b.dataset.q);
    }));

    const placeholders = [
      '“someone else is claiming part of my property”',
      '“I was rear-ended on I-95 last week”',
      '“we need counsel on a commercial loan”',
      '“my commercial tenant stopped paying rent”',
      '“can a tax deed sale wipe out my mortgage?”'
    ];
    let pi = 0;
    setInterval(() => {
      if (document.activeElement === navInput || navInput.value) return;
      pi = (pi + 1) % placeholders.length;
      navInput.setAttribute('placeholder', 'e.g. ' + placeholders[pi]);
    }, 3200);

    $$('[data-focus-nav]').forEach(a => a.addEventListener('click', () => setTimeout(() => navInput.focus({ preventScroll: true }), 600)));
  }

  /* ---------- Why-us active item + progress ---------- */
  const whyList = $('#whyList');
  const whyBar = $('#whyBar');
  if (whyList && whyBar) {
    const whyItems = $$('.why__item', whyList);
    const updateWhy = () => {
      const mid = window.innerHeight * 0.55;
      whyItems.forEach(it => {
        const r = it.getBoundingClientRect();
        it.classList.toggle('is-active', r.top < mid && r.bottom > mid * 0.5);
      });
      const lr = whyList.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (mid - lr.top) / lr.height));
      whyBar.style.width = (p * 100) + '%';
    };
    window.addEventListener('scroll', updateWhy, { passive: true });
    updateWhy();
  }

  /* ---------- Reviews slider (home) ---------- */
  const track = $('#reviewsTrack');
  const revNext = $('#revNext'), revPrev = $('#revPrev');
  if (track && revNext && revPrev) {
    const step = () => (track.firstElementChild.getBoundingClientRect().width + 20);
    revNext.addEventListener('click', () => {
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + step(), behavior: 'smooth' });
    });
    revPrev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  }

  /* ---------- Voices rotator (inner pages) ---------- */
  $$('[data-voices]').forEach(root => {
    const items = $$('.voice', root);
    const bars = $$('.voices__bar i', root);
    const idx = $('[data-v-i]', root);
    if (items.length < 2) return;
    let i = 0, t;
    const show = n => {
      i = (n + items.length) % items.length;
      items.forEach((el, k) => el.classList.toggle('is-active', k === i));
      bars.forEach((b, k) => {
        b.classList.remove('is-on');
        if (k === i) { void b.offsetWidth; b.classList.add('is-on'); }
      });
      if (idx) idx.textContent = String(i + 1).padStart(2, '0');
      clearTimeout(t);
      if (!reduced) t = setTimeout(() => show(i + 1), 7000);
    };
    $('[data-v-next]', root).addEventListener('click', () => show(i + 1));
    $('[data-v-prev]', root).addEventListener('click', () => show(i - 1));
    root.addEventListener('pointerenter', () => clearTimeout(t));
    root.addEventListener('pointerleave', () => { if (!reduced) t = setTimeout(() => show(i + 1), 4000); });
    show(0);
  });

  /* ---------- Reading progress + TOC scrollspy ---------- */
  const doc = $('[data-doc]');
  const readbar = $('#readbar');
  if (doc) {
    const links = $$('[data-toc] a');
    const secs = links.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = doc.getBoundingClientRect();
      if (readbar) {
        const total = r.height - window.innerHeight * 0.6;
        const p = Math.min(1, Math.max(0, -r.top / (total > 0 ? total : 1)));
        readbar.style.width = (p * 100) + '%';
      }
      if (secs.length) {
        const line = window.innerHeight * 0.3;
        let active = -1;
        secs.forEach((s, k) => { if (s.getBoundingClientRect().top < line) active = k; });
        links.forEach((a, k) => a.classList.toggle('is-active', k === active));
      }
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
    $$('.toc-m a').forEach(a => a.addEventListener('click', () => { const d = a.closest('details'); if (d) d.open = false; }));
  }

  /* ---------- News filter ---------- */
  const filters = $('[data-filters]');
  const ledger = $('[data-ledger]');
  if (filters && ledger) {
    const rows = $$('li', ledger);
    const count = $('[data-count]');
    filters.addEventListener('click', e => {
      const b = e.target.closest('button[data-filter]');
      if (!b) return;
      const f = b.dataset.filter;
      $$('button', filters).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      let n = 0;
      rows.forEach(r => {
        const show = f === 'all' || r.dataset.cat === f;
        r.hidden = !show;
        if (show) n++;
      });
      if (count) count.textContent = `Showing ${n} article${n === 1 ? '' : 's'}`;
    });
  }

  /* ---------- Copy link ---------- */
  $$('[data-copy]').forEach(b => b.addEventListener('click', () => {
    const url = b.dataset.copy;
    const done = () => { b.setAttribute('data-copied', ''); setTimeout(() => b.removeAttribute('data-copied'), 1600); };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, done);
    else done();
  }));

  /* ---------- Forms (front-end only; wire to backend/CF7) ---------- */
  $$('#contactForm, [data-form]').forEach(form => {
    if (form.dataset.bound) return;
    form.dataset.bound = '1';
    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      $$('[required]', form).forEach(inp => {
        const valid = inp.value.trim() && (inp.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value));
        inp.closest('.field').classList.toggle('is-invalid', !valid);
        if (!valid) ok = false;
      });
      if (!ok) { const bad = $('.is-invalid input', form); if (bad) bad.focus(); return; }
      if (form.dataset.redirect) { window.location.href = form.dataset.redirect; return; }
      const s = $('#formSuccess', form);
      if (s) s.hidden = false;
      form.reset();
    });
  });
})();
