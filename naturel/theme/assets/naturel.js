/* ==========================================================================
   NATUREL — storefront behaviour (vanilla JS, no dependencies)
   Cart operations use Shopify's AJAX Cart API + Section Rendering API.
   ========================================================================== */
(() => {
  'use strict';

  const N = window.Naturel || { routes: {}, strings: {}, sound: {} };
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionOff = () => reduceMotion.matches || root.classList.contains('motion-off');
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };
  const announce = (msg) => {
    const live = $('#LiveRegion');
    if (!live) return;
    live.textContent = '';
    window.setTimeout(() => { live.textContent = msg; }, 60);
  };

  /* ---------- Opening sequence ---------- */
  const Intro = {
    init() {
      const intro = $('#Intro');
      if (!intro || !root.classList.contains('intro-playing')) {
        Hero.reveal();
        return;
      }
      const skip = $('[data-intro-skip]', intro);
      const leave = () => {
        if (intro.classList.contains('is-leaving')) return;
        window.clearTimeout(this.timer);
        store.set('naturel:intro', '1');
        intro.classList.add('is-leaving');
        Hero.reveal();
        window.setTimeout(() => {
          root.classList.remove('intro-playing');
          root.classList.add('intro-done');
          document.removeEventListener('keydown', onKey);
        }, 800);
      };
      const onKey = (e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') leave(); };
      if (skip) {
        skip.tabIndex = 0;
        skip.addEventListener('click', leave);
      }
      intro.addEventListener('click', leave);
      document.addEventListener('keydown', onKey);
      this.timer = window.setTimeout(leave, 2500);
    }
  };

  /* ---------- Hero ---------- */
  const Hero = {
    reveal() {
      requestAnimationFrame(() => $$('[data-hero]').forEach((h) => h.classList.add('hero-in')));
    },
    init(scope = document) {
      $$('[data-video-toggle]', scope).forEach((btn) => {
        const video = btn.closest('[data-hero]')?.querySelector('video');
        if (!video) return;
        if (motionOff()) { video.removeAttribute('autoplay'); video.pause(); }
        const sync = () => {
          const paused = video.paused;
          btn.setAttribute('aria-pressed', String(paused));
          $('[data-icon-pause]', btn).hidden = paused;
          $('[data-icon-play]', btn).hidden = !paused;
        };
        btn.addEventListener('click', () => { video.paused ? video.play() : video.pause(); });
        video.addEventListener('play', sync);
        video.addEventListener('pause', sync);
        sync();
      });
    }
  };

  /* ---------- Header ---------- */
  const Header = {
    init() {
      const wrap = $('[data-header]');
      if (!wrap) return;
      const hideOnScroll = wrap.hasAttribute('data-hide-on-scroll');
      let lastY = window.scrollY;
      let ticking = false;
      const update = () => {
        const y = window.scrollY;
        wrap.classList.toggle('is-scrolled', y > 12);
        const anyDialogOpen = !!$('dialog[open]');
        if (hideOnScroll && !anyDialogOpen) {
          if (y > 320 && y > lastY + 4) wrap.classList.add('is-hidden');
          else if (y < lastY - 4 || y < 320) wrap.classList.remove('is-hidden');
        }
        lastY = y;
        ticking = false;
      };
      window.addEventListener('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      }, { passive: true });
      wrap.addEventListener('focusin', () => wrap.classList.remove('is-hidden'));
      update();
    }
  };

  /* ---------- Dialogs (menu, cart, lightbox) ---------- */
  const Dialogs = {
    open(dialog, opener) {
      if (!dialog || dialog.open) return;
      dialog._opener = opener || document.activeElement;
      dialog.showModal();
      document.body.style.overflow = 'hidden';
      if (opener) opener.setAttribute('aria-expanded', 'true');
    },
    close(dialog) {
      if (!dialog || !dialog.open) return;
      dialog.close();
    },
    init() {
      document.addEventListener('click', (e) => {
        const opener = e.target.closest('[data-open-dialog]');
        if (opener) {
          e.preventDefault();
          this.open(document.getElementById(opener.dataset.openDialog), opener);
          return;
        }
        const closer = e.target.closest('[data-close-dialog]');
        if (closer) {
          this.close(closer.closest('dialog'));
          return;
        }
        // click on the backdrop (the dialog element itself, outside its content)
        if (e.target.tagName === 'DIALOG' && e.target.open && !e.target.classList.contains('lightbox')) {
          this.close(e.target);
        }
      });
      document.addEventListener('close', (e) => {
        if (e.target.tagName !== 'DIALOG') return;
        if (!$('dialog[open]')) document.body.style.overflow = '';
        const opener = e.target._opener;
        if (opener) {
          opener.setAttribute('aria-expanded', 'false');
          if (document.contains(opener)) opener.focus({ preventScroll: true });
        }
      }, true);
    }
  };

  /* ---------- Scroll reveals ---------- */
  const Reveal = {
    io: null,
    init(scope = document) {
      const items = $$('.reveal:not(.is-in)', scope);
      if (!('IntersectionObserver' in window) || motionOff() || window.Shopify?.designMode) {
        items.forEach((el) => el.classList.add('is-in'));
        return;
      }
      this.io = this.io || new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            this.io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      items.forEach((el) => this.io.observe(el));
    }
  };

  /* ---------- "Every detail matters" sticky sequence ---------- */
  const Details = {
    init(scope = document) {
      $$('[data-details]', scope).forEach((section) => {
        const steps = $$('[data-detail-step]', section);
        const frames = $$('[data-detail-media]', section);
        if (!steps.length || !('IntersectionObserver' in window)) return;
        const activate = (i) => {
          steps.forEach((s, n) => s.classList.toggle('is-active', n === i));
          frames.forEach((f, n) => f.classList.toggle('is-active', n === i));
        };
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) activate(Number(entry.target.dataset.detailStep));
          });
        }, { rootMargin: '-45% 0px -45% 0px' });
        steps.forEach((s) => io.observe(s));
        section.addEventListener('shopify:block:select', (e) => {
          const i = steps.indexOf(e.target.closest('[data-detail-step]'));
          if (i > -1) activate(i);
        });
      });
    }
  };

  /* ---------- Horizontal gallery: drag, swipe, arrows ---------- */
  const Gallery = {
    init(scope = document) {
      $$('[data-gallery]', scope).forEach((section) => {
        const track = $('[data-gallery-track]', section);
        if (!track) return;
        const step = (dir) => track.scrollBy({ left: dir * track.clientWidth * 0.7, behavior: motionOff() ? 'auto' : 'smooth' });
        $('[data-gallery-prev]', section)?.addEventListener('click', () => step(-1));
        $('[data-gallery-next]', section)?.addEventListener('click', () => step(1));
        track.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
        });

        let startX = 0; let startLeft = 0; let dragging = false; let moved = false;
        track.addEventListener('pointerdown', (e) => {
          if (e.pointerType !== 'mouse' || e.button !== 0) return;
          dragging = true; moved = false;
          startX = e.clientX; startLeft = track.scrollLeft;
        });
        window.addEventListener('pointermove', (e) => {
          if (!dragging) return;
          const dx = e.clientX - startX;
          if (Math.abs(dx) > 4 && !moved) { moved = true; track.classList.add('is-dragging'); }
          if (moved) track.scrollLeft = startLeft - dx;
        });
        window.addEventListener('pointerup', () => {
          if (!dragging) return;
          dragging = false;
          track.classList.remove('is-dragging');
        });
        track.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
      });
    }
  };

  /* ---------- Cart ---------- */
  const Cart = {
    drawer: () => $('#CartDrawer'),
    sectionIds() {
      const ids = ['cart-drawer'];
      const page = $('[data-cart-page]');
      const wrapper = page?.closest('.shopify-section');
      if (wrapper) ids.push(wrapper.id.replace('shopify-section-', ''));
      return ids;
    },
    renderSections(sections) {
      if (!sections) return;
      const parser = new DOMParser();
      Object.entries(sections).forEach(([id, html]) => {
        if (!html) return;
        const doc = parser.parseFromString(html, 'text/html');
        if (id === 'cart-drawer') {
          const fresh = $('#CartDrawerInner', doc);
          const current = $('#CartDrawerInner');
          if (fresh && current) current.innerHTML = fresh.innerHTML;
        } else {
          const target = document.getElementById(`shopify-section-${id}`);
          const fresh = doc.getElementById(`shopify-section-${id}`);
          if (target && fresh) target.innerHTML = fresh.innerHTML;
        }
      });
    },
    updateCount(count) {
      const bubble = $('[data-cart-count]');
      const label = $('[data-cart-count-label]');
      if (bubble) {
        bubble.textContent = count;
        bubble.hidden = count === 0;
        if (!motionOff()) {
          const icon = $('#CartIcon');
          icon?.classList.remove('cart-bump');
          void icon?.offsetWidth; // restart animation
          icon?.classList.add('cart-bump');
        }
      }
      if (label) label.textContent = String(count);
    },
    async add(form, submitter) {
      const buttons = $$(`[data-add-button], button[type="submit"]`, form).concat(
        form.id ? $$(`button[form="${form.id}"]`) : []
      );
      const errorBox = $('[data-form-error]', form);
      if (errorBox) errorBox.hidden = true;
      buttons.forEach((b) => { b.classList.add('is-loading'); b.setAttribute('aria-busy', 'true'); });
      try {
        const body = new FormData(form);
        body.append('sections', this.sectionIds().join(','));
        body.append('sections_url', window.location.pathname);
        const res = await fetch(`${N.routes.cartAdd}.js`, {
          method: 'POST',
          headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
          body
        });
        const data = await res.json();
        if (!res.ok || data.status) throw new Error(data.description || data.message || N.strings.cartError);
        this.renderSections(data.sections);
        const cart = await (await fetch(`${N.routes.cart}.js`, { headers: { Accept: 'application/json' } })).json();
        this.updateCount(cart.item_count);
        announce(`${data.product_title || ''} — ${N.strings.addToCart}`);
        if (N.cartType === 'page') {
          window.location.href = N.routes.cart;
        } else {
          Dialogs.open(this.drawer(), submitter);
        }
      } catch (err) {
        if (errorBox) { errorBox.textContent = err.message; errorBox.hidden = false; }
        announce(err.message);
      } finally {
        buttons.forEach((b) => { b.classList.remove('is-loading'); b.removeAttribute('aria-busy'); });
      }
    },
    async change(line, quantity) {
      const item = $(`.cart-item[data-line="${line}"]`);
      $$(`.cart-item[data-line="${line}"]`).forEach((el) => el.classList.add('is-updating'));
      try {
        const res = await fetch(`${N.routes.cartChange}.js`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ line: Number(line), quantity, sections: this.sectionIds(), sections_url: window.location.pathname })
        });
        const data = await res.json();
        if (!res.ok || data.status) {
          announce(data.description || data.message || N.strings.cartError);
          const cart = await (await fetch(`${N.routes.root}?sections=${this.sectionIds().join(',')}`)).json();
          this.renderSections(cart);
          return;
        }
        this.renderSections(data.sections);
        this.updateCount(data.item_count);
      } catch (err) {
        announce(N.strings.cartError);
        item?.classList.remove('is-updating');
      }
    },
    init() {
      // Intercept product forms (progressive enhancement: without JS they post to /cart/add).
      document.addEventListener('submit', (e) => {
        const form = e.target;
        if (form.matches('form[data-type="add-to-cart-form"]')) {
          e.preventDefault();
          this.add(form, e.submitter);
        }
      });

      // Cart icon opens the drawer instead of navigating.
      document.addEventListener('click', (e) => {
        const toggle = e.target.closest('[data-cart-toggle]');
        if (toggle && N.cartType !== 'page' && this.drawer() && !$('[data-cart-page]')) {
          e.preventDefault();
          Dialogs.open(this.drawer(), toggle);
        }
        const btn = e.target.closest('[data-qty-change]');
        if (btn) {
          const row = btn.closest('.cart-item');
          const input = $('[data-qty-input]', row);
          const next = Math.max(0, Number(input.value) + Number(btn.dataset.qtyChange));
          input.value = next;
          this.change(row.dataset.line, next);
        }
        const remove = e.target.closest('[data-remove]');
        if (remove) {
          e.preventDefault();
          this.change(remove.closest('.cart-item').dataset.line, 0);
        }
      });

      document.addEventListener('change', (e) => {
        const input = e.target.closest('[data-qty-input]');
        if (input) this.change(input.closest('.cart-item').dataset.line, Math.max(0, Number(input.value) || 0));
        const note = e.target.closest('[data-cart-note]');
        if (note) {
          fetch(`${N.routes.cart}/update.js`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ note: note.value })
          });
        }
      });
    }
  };

  /* ---------- Product page ---------- */
  const Product = {
    init(scope = document) {
      $$('[data-product-section]', scope).forEach((el) => this.setup(el));
    },
    setup(el) {
      const wrapper = el.closest('.shopify-section') || document;
      const json = $('[data-variants]', wrapper);
      const variants = json ? JSON.parse(json.textContent) : [];
      const picker = $('[data-variant-picker]', el);
      const list = $('[data-media-list]', el);
      const counter = $('[data-media-current]', el);
      const form = $('form[data-type="add-to-cart-form"]', el);
      const idInput = form ? $('[data-variant-id]', form) : null;
      const sticky = $('[data-sticky-buy]', wrapper);

      // Mobile gallery counter
      if (list && counter) {
        list.addEventListener('scroll', () => {
          const i = Math.round(list.scrollLeft / Math.max(1, list.clientWidth));
          counter.textContent = String(i + 1);
        }, { passive: true });
      }

      // Variant selection
      if (picker && variants.length) {
        const fieldsets = $$('fieldset', picker);
        const selected = () => fieldsets.map((fs) => $('input:checked', fs)?.value);
        const markAvailability = (current) => {
          fieldsets.forEach((fs, idx) => {
            $$('input', fs).forEach((input) => {
              const combo = current.slice();
              combo[idx] = input.value;
              const match = variants.find((v) => v.options.every((o, i) => o === combo[i]));
              input.classList.toggle('is-unavailable', !match || !match.available);
            });
          });
        };
        picker.addEventListener('change', (e) => {
          const fs = e.target.closest('fieldset');
          const idx = fieldsets.indexOf(fs);
          const label = $(`[data-option-selected="${idx}"]`, picker);
          if (label) label.textContent = e.target.value;
          const opts = selected();
          const variant = variants.find((v) => v.options.every((o, i) => o === opts[i]));
          markAvailability(opts);
          this.applyVariant(el, wrapper, variant, { idInput, list, sticky });
        });
      }

      // Zoom lightbox
      const lightbox = $('[data-lightbox]', wrapper);
      if (lightbox) this.lightbox(el, lightbox);

      // Mobile sticky add-to-cart: shows once the main button scrolls away
      const mainBtn = form ? $('[data-add-button]', form) : null;
      if (sticky && mainBtn && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(([entry]) => {
          const past = !entry.isIntersecting && entry.boundingClientRect.top < 0;
          sticky.classList.toggle('is-visible', past);
          sticky.setAttribute('aria-hidden', String(!past));
          $('button', sticky).tabIndex = past ? 0 : -1;
        });
        io.observe(mainBtn);
      }
    },
    applyVariant(el, wrapper, variant, { idInput, list, sticky }) {
      const addButtons = $$('[data-add-button]', wrapper);
      if (!variant) {
        addButtons.forEach((b) => { b.disabled = true; $('[data-add-label]', b).textContent = N.strings.unavailable; });
        return;
      }
      if (idInput) {
        idInput.value = variant.id;
        idInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      $$('form[id^="installments-"] input[name="id"]', wrapper).forEach((i) => { i.value = variant.id; });
      const price = $('[data-price-wrapper]', el);
      if (price) price.innerHTML = variant.price_html;
      const stickyPrice = $('[data-sticky-price]', wrapper);
      if (stickyPrice) stickyPrice.textContent = variant.price;
      const avail = $('[data-availability]', el);
      if (avail) {
        avail.innerHTML = variant.availability_html;
        avail.classList.toggle('availability--out', !variant.available);
      }
      addButtons.forEach((b) => {
        b.disabled = !variant.available;
        const label = $('[data-add-label]', b);
        if (label) label.textContent = variant.available
          ? (b.closest('[data-sticky-buy]') ? N.strings.addShort : N.strings.addToCart)
          : N.strings.soldOut;
      });
      const edition = $('[data-edition-number]', el);
      if (edition && variant.edition) {
        const total = edition.textContent.split('/')[1];
        edition.textContent = `N° ${variant.edition}${total ? ` /${total}` : ''}`;
        edition.hidden = false;
      }
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url.toString());

      if (variant.media_id && list) {
        const item = $(`[data-media-id="${variant.media_id}"]`, list);
        if (item && item !== list.firstElementChild) {
          list.prepend(item);
        }
        list.scrollTo({ left: 0, behavior: motionOff() ? 'auto' : 'smooth' });
        if (window.matchMedia('(min-width: 990px)').matches) {
          list.scrollIntoView({ block: 'start', behavior: motionOff() ? 'auto' : 'smooth' });
        }
      }
    },
    lightbox(el, dialog) {
      const stage = $('[data-lightbox-stage]', dialog);
      const img = $('[data-lightbox-img]', dialog);
      let images = [];
      let index = 0;
      const show = (i) => {
        images = $$('img[data-zoom]', el);
        if (!images.length) return;
        index = (i + images.length) % images.length;
        const src = images[index].dataset.full || images[index].currentSrc;
        stage.classList.remove('is-zoomed');
        img.src = src;
        img.alt = images[index].alt || '';
      };
      const open = (i, opener) => { show(i); Dialogs.open(dialog, opener); };

      el.addEventListener('click', (e) => {
        const target = e.target.closest('img[data-zoom]');
        if (target) open($$('img[data-zoom]', el).indexOf(target), target);
        const btn = e.target.closest('[data-zoom-open]');
        if (btn) {
          const list = $('[data-media-list]', el);
          const current = list ? Math.round(list.scrollLeft / Math.max(1, list.clientWidth)) : 0;
          open(current, btn);
        }
      });
      $$('[data-lightbox-step]', dialog).forEach((b) => b.addEventListener('click', () => show(index + Number(b.dataset.lightboxStep))));
      dialog.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') show(index + 1);
        if (e.key === 'ArrowLeft') show(index - 1);
      });
      const setOrigin = (e) => {
        const r = img.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        img.style.transformOrigin = `${Math.min(100, Math.max(0, x))}% ${Math.min(100, Math.max(0, y))}%`;
      };
      img.addEventListener('click', (e) => {
        setOrigin(e);
        stage.classList.toggle('is-zoomed');
      });
      stage.addEventListener('pointermove', (e) => {
        if (stage.classList.contains('is-zoomed') && e.pointerType === 'mouse') setOrigin(e);
      });
    }
  };

  /* ---------- Ambient sound (opt-in only) ---------- */
  const AmbientSound = {
    playing: false,
    init() {
      const btn = $('[data-sound-toggle]');
      if (!btn || !N.sound || !N.sound.enabled) return;
      this.btn = btn;
      btn.addEventListener('click', () => (this.playing ? this.stop(true) : this.start(true)));

      // A visitor who explicitly turned the ambience on keeps it across pages:
      // it resumes on their first interaction (browsers forbid sound before that).
      if (store.get('naturel:sound') === '1') {
        const resume = (e) => {
          if (e.target.closest && e.target.closest('[data-sound-toggle]')) return;
          this.start(false);
        };
        document.addEventListener('pointerdown', resume, { once: true });
        document.addEventListener('keydown', resume, { once: true });
      }
      document.addEventListener('visibilitychange', () => {
        if (!this.playing) return;
        if (document.hidden) this.fade(0, 0.6); else this.fade(this.volume(), 1.5);
      });
    },
    volume() { return Math.min(0.6, Math.max(0.02, Number(N.sound.volume) || 0.25)); },
    setUi(on) {
      this.btn.setAttribute('aria-pressed', String(on));
      const label = $('[data-sound-label]', this.btn);
      if (label) label.textContent = on ? N.strings.soundOn : N.strings.soundOff;
    },
    async start(remember) {
      if (this.playing) return;
      try {
        if (N.sound.source === 'file' && N.sound.url) await this.startFile();
        else this.startGenerated();
        this.playing = true;
        this.setUi(true);
        if (remember) store.set('naturel:sound', '1');
      } catch (e) {
        this.setUi(false);
      }
    },
    stop(remember) {
      if (!this.playing) return;
      this.playing = false;
      this.setUi(false);
      if (remember) store.set('naturel:sound', '0');
      this.fade(0, 0.8);
      window.setTimeout(() => {
        if (this.playing) return;
        if (this.audio) this.audio.pause();
        if (this.ctx && this.ctx.state === 'running') this.ctx.suspend();
      }, 900);
    },
    fade(to, seconds) {
      if (this.master && this.ctx) {
        const now = this.ctx.currentTime;
        this.master.gain.cancelScheduledValues(now);
        this.master.gain.setValueAtTime(this.master.gain.value, now);
        this.master.gain.linearRampToValueAtTime(to, now + seconds);
      } else if (this.audio) {
        const from = this.audio.volume;
        const t0 = performance.now();
        const tick = (t) => {
          const k = Math.min(1, (t - t0) / (seconds * 1000));
          this.audio.volume = from + (to - from) * k;
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    },
    async startFile() {
      if (!this.audio) {
        this.audio = new Audio(N.sound.url);
        this.audio.loop = true;
        this.audio.preload = 'auto';
      }
      this.audio.volume = 0;
      await this.audio.play();
      this.fade(this.volume(), 2.5);
    },
    /* Soft waves synthesised in the browser: looping brown noise through a
       low-pass filter, with slow, slightly irregular swells (two LFOs) that
       also open the filter at each crest, plus a faint high "foam" layer.
       Zero bytes to download. */
    startGenerated() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) throw new Error('no audio');
      if (this.ctx) {
        this.ctx.resume();
        this.fade(this.volume(), 2.5);
        return;
      }
      const ctx = new AC();
      this.ctx = ctx;
      const seconds = 8;
      const len = ctx.sampleRate * seconds;
      const buffer = ctx.createBuffer(2, len, ctx.sampleRate);
      const xfade = Math.floor(ctx.sampleRate * 0.5);
      for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch);
        let last = 0;
        for (let i = 0; i < len; i++) {
          const white = Math.random() * 2 - 1;
          last = (last + 0.02 * white) / 1.02;
          data[i] = last * 3.2;
        }
        // seamless loop: blend the tail into the head
        for (let i = 0; i < xfade; i++) {
          const k = i / xfade;
          data[i] = data[i] * k + data[len - xfade + i] * (1 - k);
        }
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.loopStart = 0;
      source.loopEnd = seconds - 0.5;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 520;
      lowpass.Q.value = 0.6;

      const swell = ctx.createGain();
      swell.gain.value = 0.55;

      const lfoA = ctx.createOscillator();
      lfoA.frequency.value = 0.085; // ~12 s per wave
      const lfoB = ctx.createOscillator();
      lfoB.frequency.value = 0.031; // slow irregularity
      const depthA = ctx.createGain(); depthA.gain.value = 0.32;
      const depthB = ctx.createGain(); depthB.gain.value = 0.14;
      const filterDepth = ctx.createGain(); filterDepth.gain.value = 380;
      lfoA.connect(depthA).connect(swell.gain);
      lfoB.connect(depthB).connect(swell.gain);
      lfoA.connect(filterDepth).connect(lowpass.frequency);

      const foamFilter = ctx.createBiquadFilter();
      foamFilter.type = 'highpass';
      foamFilter.frequency.value = 2200;
      const foam = ctx.createGain();
      foam.gain.value = 0.05;
      const foamDepth = ctx.createGain(); foamDepth.gain.value = 0.045;
      lfoA.connect(foamDepth).connect(foam.gain);

      const master = ctx.createGain();
      master.gain.value = 0;
      this.master = master;

      source.connect(lowpass).connect(swell).connect(master);
      source.connect(foamFilter).connect(foam).connect(master);
      master.connect(ctx.destination);

      source.start();
      lfoA.start();
      lfoB.start();
      this.fade(this.volume(), 3);
    }
  };

  /* ---------- Misc ---------- */
  const Misc = {
    init() {
      document.addEventListener('change', (e) => {
        const sel = e.target.closest('[data-autosubmit]');
        if (sel && sel.form) sel.form.submit();
      });
      // Login ↔ password recovery panels
      const showPanel = (id) => {
        $$('[data-account-panel]').forEach((p) => { p.hidden = p.id !== id; });
        $(`#${id} input`)?.focus();
      };
      document.addEventListener('click', (e) => {
        const t = e.target.closest('[data-account-toggle]');
        if (t) { e.preventDefault(); showPanel(t.dataset.accountToggle); }
      });
      if (window.location.hash === '#Recover' && $('#Recover')) showPanel('Recover');
      // Address country selects
      $$('select[data-default]').forEach((s) => { if (s.dataset.default) s.value = s.dataset.default; });
    }
  };

  /* ---------- Boot ---------- */
  const initScope = (scope) => {
    Reveal.init(scope);
    Hero.init(scope);
    Details.init(scope);
    Gallery.init(scope);
    Product.init(scope);
  };

  const boot = () => {
    Dialogs.init();
    Header.init();
    Intro.init();
    Cart.init();
    AmbientSound.init();
    Misc.init();
    initScope(document);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  // Theme editor: re-initialise sections when merchants edit them.
  document.addEventListener('shopify:section:load', (e) => {
    initScope(e.target);
    Hero.reveal();
  });
})();
