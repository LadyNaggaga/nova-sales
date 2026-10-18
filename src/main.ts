import './style.css';
import { gsap } from 'gsap';
import { buildSeats, EVENT, money, SERVICE_FEE_RATE, TIERS, type Seat } from './data';
import { attachLookAt, mascotSVG } from './mascot';

const PAYMENT_DELAY_MS = 1500;
const LOW_TICKETS_THRESHOLD = 20;

/** Tiny pixel heart icon shown on seats the shopper has picked. */
const HEART_ICON = `<svg class="seat-icon" viewBox="0 0 7 6" shape-rendering="crispEdges" aria-hidden="true">
  <rect x="1" y="0" width="2" height="1"/>
  <rect x="4" y="0" width="2" height="1"/>
  <rect x="0" y="1" width="7" height="2"/>
  <rect x="1" y="3" width="5" height="1"/>
  <rect x="2" y="4" width="3" height="1"/>
  <rect x="3" y="5" width="1" height="1"/>
</svg>`;

// Avoids --lavender: the ticket background is lavender, so that color would vanish against it.
const CONFETTI_COLORS = ['var(--pink)', 'var(--mustard)', 'var(--mint)', 'var(--purple)', 'var(--cyan)', 'var(--rust)'];

function confettiHTML(): string {
  let out = '';
  for (let i = 0; i < 12; i++) {
    const angle = Math.round((360 / 12) * i + (Math.random() * 20 - 10));
    const dist = 40 + Math.round(Math.random() * 26);
    const delay = (Math.random() * 0.15).toFixed(2);
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    out += `<i style="--a:${angle}deg;--r:${dist}px;--d:${delay}s;--c:${color}"></i>`;
  }
  return out;
}

function dustHTML(): string {
  return Array.from(
    { length: 18 },
    (_, i) =>
      `<i style="--dust-x:${(i * 37) % 96}%;--dust-delay:${(i % 7) * -0.7}s;--dust-speed:${4 + (i % 5)}s"></i>`,
  ).join('');
}

type Phase = 'shopping' | 'processing' | 'confirmed';
type IntroPhase = 'closed' | 'open' | 'entered';

const state = {
  seats: buildSeats(),
  selected: new Set<string>(),
  phase: 'shopping' as Phase,
  order: null as null | { id: string; total: number; seats: string[] },
  introPhase: 'closed' as IntroPhase,
  soundEnabled: false,
};

// ---------- helpers ----------

const $ = <T extends HTMLElement = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const seatName = (s: Seat) => `${s.tier.name} · ${s.row}${s.number}`;

function totals() {
  const picked = state.seats.filter((s) => state.selected.has(s.id));
  const subtotal = picked.reduce((sum, s) => sum + s.tier.price, 0);
  const fee = Math.round(subtotal * SERVICE_FEE_RATE * 100) / 100;
  return { picked, subtotal, fee, total: subtotal + fee };
}

const ticketsLeft = () => state.seats.filter((s) => !s.sold && !state.selected.has(s.id)).length;

// ---------- shell (rendered once) ----------

function mount() {
  $('#app').innerHTML = `
  <section class="tour-intro" id="tour-intro" aria-labelledby="intro-title">
    <span class="stage-lamp stage-lamp-left" aria-hidden="true"></span>
    <span class="stage-lamp stage-lamp-right" aria-hidden="true"></span>
    <div class="intro-spotlights" aria-hidden="true">
      <span class="spotlight spotlight-left"></span>
      <span class="spotlight spotlight-right"></span>
    </div>
    <div class="pixel-dust" aria-hidden="true">${dustHTML()}</div>

    <div class="intro-reveal" aria-hidden="true">
      <div class="tour-teaser">
        <div class="pixel-band" aria-hidden="true">
          <span class="performer performer-guitar"></span>
          <span class="performer performer-lead"></span>
          <span class="performer performer-drums"></span>
        </div>
        <div class="teaser-copy">
          <span class="intro-kicker pixel">NOW BOOKING</span>
          <h2 class="pixel reveal-title" tabindex="-1">THE NIGHT<br />STARTS HERE</h2>
          <p class="reveal-artist">${esc(EVENT.artist)}</p>
        </div>
        <div class="tour-details">
          <div class="tour-stops">
            <span class="pixel details-label">TOUR DATES</span>
            <div><strong>NOV 14</strong><span>Harborline Arena</span><em>TONIGHT</em></div>
            <div><strong>NOV 16</strong><span>Neon Bay Pavilion</span><em>FEW LEFT</em></div>
            <div><strong>NOV 21</strong><span>Starfall Theater</span><em>ON SALE</em></div>
          </div>
          <div class="reservation-ticket">
            <span class="pixel ticket-label">SEAT RESERVATION</span>
            <strong class="pixel">${esc(EVENT.tour.toUpperCase())}</strong>
            <span>${esc(EVENT.date)} · ${esc(EVENT.doors)}</span>
            <span>${esc(EVENT.venue)}</span>
            <span class="ticket-barcode" aria-hidden="true"></span>
          </div>
        </div>
        <button class="btn intro-proceed" data-action="enter-tour">PROCEED TO SEAT MAP ➜</button>
      </div>
    </div>
    <button class="btn intro-back" data-action="close-curtain" aria-label="Close curtain">← CLOSE CURTAIN</button>

    <div class="curtain curtain-left" aria-hidden="true"><span class="curtain-tassel"></span></div>
    <div class="curtain curtain-right" aria-hidden="true"><span class="curtain-tassel"></span></div>
    <div class="open-drape drape-left" aria-hidden="true"><span></span></div>
    <div class="open-drape drape-right" aria-hidden="true"><span></span></div>
    <div class="curtain-valance" aria-hidden="true"></div>

    <div class="intro-marquee">
      <span class="marquee-bulbs" aria-hidden="true"></span>
      <span class="intro-kicker pixel">ONE NIGHT ONLY</span>
      <h1 class="pixel intro-title" id="intro-title">MIDNIGHT<br />MONA TOUR</h1>
      <p class="intro-artist">${esc(EVENT.artist)}</p>
      <p class="intro-meta pixel">${esc(EVENT.date)} · ${esc(EVENT.venue)}</p>
      <button class="btn intro-enter" data-action="open-curtain">ENTER THE THEATER</button>
      <p class="intro-hint"><span class="key pixel">ENTER ↵</span> to open the curtain</p>
    </div>

    <button class="btn sound-toggle" data-action="toggle-sound" aria-pressed="false">
      <span aria-hidden="true">♪</span> SOUND OFF
    </button>
    <div class="intro-floor" aria-hidden="true"></div>
    <p class="intro-status" id="intro-status" aria-live="polite"></p>
  </section>

  <div class="page" aria-hidden="true">
    <header class="topbar">
      <div class="brand">
        <span class="brand-chip" aria-hidden="true"></span>
        <span class="pixel">${esc(EVENT.artist.toUpperCase())}</span>
      </div>
    </header>

    <section class="hero">
      <div class="hero-row">
        <div class="hero-copy">
          <span class="pill"><span class="dot">●</span> ON SALE NOW</span>
          <h1 class="pixel hero-title">MIDNIGHT<br />MONA TOUR</h1>
          <p class="hero-meta">${esc(`${EVENT.date} · ${EVENT.doors} · ${EVENT.venue}`)}</p>
        </div>
        <div class="counter" aria-live="polite">
          <div class="pixel counter-label">TICKETS LEFT</div>
          <div class="pixel counter-value" id="tickets-left"></div>
        </div>
      </div>

      <div class="checker-strip" aria-hidden="true">
        <div class="tile tile-a"></div>
        <div class="tile tile-b"></div>
        <div class="tile tile-c"></div>
        <div class="mascot bob">
          <div class="mascot-head" id="mascot">${mascotSVG()}</div>
        </div>
      </div>
    </section>

    <main class="layout">
      <section class="panel seatmap" aria-label="Seat map">
        <div class="seatmap-head">
          <h2 class="pixel">PICK YOUR SPOT</h2>
          <div class="legend">
            <span><i class="swatch swatch-open"></i>Open</span>
            <span><i class="swatch swatch-mine"></i>Yours ♥</span>
            <span><i class="swatch swatch-sold"></i>Sold ×</span>
          </div>
        </div>
        <div class="seatmap-scroll">
          <div class="venue" id="venue">
            <div class="stage pixel">STAGE</div>
          </div>
        </div>
      </section>

      <aside class="side">
        <div id="cart" aria-live="polite" aria-atomic="true"></div>
      </aside>
    </main>

    <div class="mobile-bar" id="mobile-bar"></div>
  </div>`;

  document.body.classList.add('intro-active');
  $('.page').inert = true;
  buildVenue();
  attachLookAt($('#mascot'));
  attachIntroSpotlight();
  setupCurtainTimeline();
}

function buildVenue() {
  const venue = $('#venue');
  for (const tier of TIERS) {
    const seats = state.seats.filter((s) => s.tier === tier);
    const rows = [...new Set(seats.map((s) => s.row))];
    const block = document.createElement('div');
    block.className = 'tier';
    block.innerHTML = `
      <div class="tier-label pixel">
        <i class="swatch" style="background:${tier.color}"></i>
        <span>${esc(tier.name.toUpperCase())}</span>
        <span style="color:${tier.color}">${money(tier.price).replace('.00', '')}</span>
      </div>
      ${rows
        .map((row) => {
          const inRow = seats.filter((s) => s.row === row);
          const mid = Math.floor(inRow.length / 2);
          const btn = (s: Seat) =>
            `<button class="seat" data-seat="${s.id}" style="--seat:${tier.color};--y:${s.offsetY}px"></button>`;
          return `
          <div class="row">
            <span class="row-letter pixel">${row}</span>
            <div class="row-half">${inRow.slice(0, mid).map(btn).join('')}</div>
            <div class="row-half">${inRow.slice(mid).map(btn).join('')}</div>
            <span class="row-letter pixel">${row}</span>
          </div>`;
        })
        .join('')}`;
    venue.appendChild(block);
  }
}

// ---------- rendering ----------

function paintSeats() {
  const locked = state.phase === 'processing';
  document.querySelectorAll<HTMLButtonElement>('.seat').forEach((el) => {
    const seat = state.seats.find((s) => s.id === el.dataset.seat)!;
    const mine = state.selected.has(seat.id);
    el.classList.toggle('is-sold', seat.sold);
    el.classList.toggle('is-mine', mine);
    el.disabled = seat.sold || locked;
    el.setAttribute('aria-pressed', String(mine));
    el.innerHTML = seat.sold ? '×' : mine ? HEART_ICON : '';
    const label = `${seatName(seat)}, ${money(seat.tier.price)}${seat.sold ? ', sold' : mine ? ', selected' : ''}`;
    el.setAttribute('aria-label', label);
    el.title = label;
  });
}

function renderCart() {
  const cart = $('#cart');

  if (state.phase === 'confirmed' && state.order) {
    const o = state.order;
    cart.innerHTML = `
      <section class="ticket pop" aria-label="Order confirmed">
        <div class="ticket-body">
          <div class="confetti" aria-hidden="true">${confettiHTML()}</div>
          <div class="pixel ticket-kicker">ADMIT ${o.seats.length} · ${esc(EVENT.tour.toUpperCase())}</div>
          <div class="pixel ticket-title">YOU'RE IN!</div>
          <div class="ticket-meta">Order ${esc(o.id)} · ${money(o.total)}</div>
          <ul class="ticket-seats">${o.seats.map((seat) => `<li>${esc(seat)}</li>`).join('')}</ul>
          <p class="ticket-note">Simulated payment — no real charge.</p>
          <button class="btn btn-cream" data-action="buy-more">BUY MORE</button>
        </div>
        <div class="ticket-stub" aria-hidden="true"></div>
      </section>`;
    return;
  }

  const { picked, subtotal, fee, total } = totals();
  const busy = state.phase === 'processing';
  const empty = picked.length === 0;

  cart.innerHTML = `
    <section class="cart" aria-label="Your tickets">
      <div class="cart-head"><span class="pixel cart-title">YOUR TICKETS</span></div>
      <div class="cart-items">
        ${empty ? '<p class="cart-empty">Tap a seat on the map. Mona is watching.</p>' : ''}
        ${picked
          .map(
            (s) => `
          <div class="cart-item">
            <span>${esc(seatName(s))}</span>
            <span class="cart-price">${money(s.tier.price)}
              <button class="btn btn-x" data-action="remove" data-id="${s.id}" aria-label="Remove ${esc(seatName(s))}" ${busy ? 'disabled' : ''}>×</button>
            </span>
          </div>`,
          )
          .join('')}
      </div>
      <div class="perf" aria-hidden="true"></div>
      <div class="cart-totals">
        <div><span>Subtotal</span><span>${money(subtotal)}</span></div>
        <div><span>Service fee (${Math.round(SERVICE_FEE_RATE * 100)}%)</span><span>${money(fee)}</span></div>
        <div class="pixel cart-total"><span>TOTAL</span><span>${money(total)}</span></div>
        <p class="payment-note">Simulated payment — no real charge.</p>
        <button class="btn btn-pay" data-action="pay" ${empty || busy ? 'disabled' : ''}>
          ${busy ? 'PROCESSING PAYMENT…' : empty ? 'PICK A SEAT' : `PAY ${money(total)}`}
        </button>
      </div>
    </section>`;
}

function renderMobileBar() {
  const bar = $('#mobile-bar');
  bar.hidden = state.phase === 'confirmed';
  if (bar.hidden) {
    bar.innerHTML = '';
    return;
  }

  const { picked, total } = totals();
  const busy = state.phase === 'processing';
  bar.innerHTML = `
    <span class="pixel">${picked.length} SEAT${picked.length === 1 ? '' : 'S'} · ${money(total)}</span>
    <button class="btn btn-pay btn-small" data-action="pay" ${picked.length === 0 || busy ? 'disabled' : ''}>${busy ? 'PROCESSING…' : 'PAY'}</button>`;
}

function render() {
  const left = ticketsLeft();
  $('#tickets-left').textContent = String(left);
  $('.counter').classList.toggle('counter--low', left > 0 && left <= LOW_TICKETS_THRESHOLD);
  paintSeats();
  renderCart();
  renderMobileBar();
}

// ---------- checkout ----------

function newOrderId() {
  return `NL-${crypto.randomUUID().toUpperCase()}`;
}

async function pay() {
  if (state.phase !== 'shopping' || state.selected.size === 0) return;

  const { picked, total } = totals();
  const orderId = newOrderId();
  state.phase = 'processing';
  render();

  await new Promise<void>((resolve) => setTimeout(resolve, PAYMENT_DELAY_MS));
  confirmOrder(orderId, total, picked);
}

function confirmOrder(orderId: string, total: number, picked: Seat[]) {
  picked.forEach((s) => (s.sold = true));
  state.selected.clear();
  state.order = { id: orderId, total, seats: picked.map(seatName) };
  state.phase = 'confirmed';
  render();
}

// ---------- events ----------

function cheerMascot() {
  const head = document.getElementById('mascot');
  if (!head) return;
  head.classList.remove('cheer');
  void head.offsetWidth; // restart the cheer animation
  head.classList.add('cheer');
}

let audioContext: AudioContext | null = null;
let curtainTimeline: gsap.core.Timeline | null = null;

function playTone(frequency: number, duration: number, delay = 0, type: OscillatorType = 'square') {
  if (!state.soundEnabled) return;
  audioContext ??= new AudioContext();
  if (audioContext.state === 'suspended') void audioContext.resume();

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const start = audioContext.currentTime + delay;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.055, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(start);
  oscillator.stop(start + duration);
}

function playCurtainCue(opening: boolean) {
  const notes = opening ? [164, 220, 330, 440] : [440, 330, 220, 164];
  notes.forEach((note, index) => playTone(note, 0.22, index * 0.09, index % 2 ? 'square' : 'sawtooth'));
}

function attachIntroSpotlight() {
  const intro = $('#tour-intro');
  intro.addEventListener('pointermove', (event) => {
    const normalized = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
    intro.style.setProperty('--spot-tilt', `${Math.round(normalized * 12)}deg`);
  });
}

function setupCurtainTimeline() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const curtainDuration = reduceMotion ? 0 : 1;
  const revealDuration = reduceMotion ? 0 : 0.28;

  gsap.set('.intro-reveal', { autoAlpha: 0 });
  gsap.set(['.open-drape', '.curtain-tassel'], { autoAlpha: 0 });

  curtainTimeline = gsap
    .timeline({ paused: true })
    .to('.intro-marquee', { autoAlpha: 0, y: -54, scale: 0.92, duration: revealDuration, ease: 'steps(4)' }, 0)
    .to('.curtain-left', { xPercent: -82, duration: curtainDuration, ease: 'steps(14)' }, 0)
    .to('.curtain-right', { xPercent: 82, duration: curtainDuration, ease: 'steps(14)' }, 0)
    .to('.spotlight', { opacity: 0.24, duration: revealDuration, ease: 'steps(3)' }, 0.5)
    .to(['.open-drape', '.curtain-tassel'], { autoAlpha: 1, duration: 0.01 }, reduceMotion ? 0 : 0.72)
    .to(
      '.intro-reveal',
      {
        autoAlpha: 1,
        duration: revealDuration,
        ease: 'steps(4)',
        onComplete: () => $('.reveal-title').focus({ preventScroll: true }),
      },
      reduceMotion ? 0 : 0.68,
    );
}

function openCurtain() {
  if (state.introPhase !== 'closed') return;
  state.introPhase = 'open';

  const intro = $('#tour-intro');
  $('#intro-status').textContent = 'The curtain is opening.';
  intro.classList.add('is-open');
  intro.querySelector('.intro-reveal')?.setAttribute('aria-hidden', 'false');
  intro.querySelector('.intro-marquee')?.setAttribute('aria-hidden', 'true');
  playCurtainCue(true);
  curtainTimeline?.play();
}

function closeCurtain() {
  if (state.introPhase !== 'open') return;
  state.introPhase = 'closed';

  const intro = $('#tour-intro');
  $('#intro-status').textContent = 'The curtain is closing.';
  intro.querySelector('.intro-reveal')?.setAttribute('aria-hidden', 'true');
  intro.querySelector('.intro-marquee')?.setAttribute('aria-hidden', 'false');
  playCurtainCue(false);
  curtainTimeline?.eventCallback('onReverseComplete', () => {
    intro.classList.remove('is-open');
    intro.querySelector<HTMLButtonElement>('.intro-enter')?.focus({ preventScroll: true });
  });
  curtainTimeline?.reverse();
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  const button = document.querySelector<HTMLButtonElement>('.sound-toggle');
  if (!button) return;
  button.setAttribute('aria-pressed', String(state.soundEnabled));
  button.innerHTML = `<span aria-hidden="true">${state.soundEnabled ? '♫' : '♪'}</span> SOUND ${state.soundEnabled ? 'ON' : 'OFF'}`;
  if (state.soundEnabled) {
    playTone(262, 0.12);
    playTone(392, 0.18, 0.1);
  }
}

function enterTour() {
  if (state.introPhase !== 'open') return;
  state.introPhase = 'entered';

  const intro = $('#tour-intro');
  const page = $('.page');
  $('#intro-status').textContent = 'Opening the seat map.';
  document.body.classList.remove('intro-active');
  playTone(523, 0.18);
  playTone(659, 0.18, 0.1);
  playTone(784, 0.28, 0.2);

  gsap.to(intro, {
    autoAlpha: 0,
    duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.45,
    ease: 'steps(5)',
    onComplete: () => {
      intro.hidden = true;
      page.inert = false;
      page.removeAttribute('aria-hidden');
      const heading = page.querySelector<HTMLElement>('.hero-title');
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    },
  });
}

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;

  const seatEl = target.closest<HTMLButtonElement>('.seat');
  if (seatEl) {
    if (seatEl.disabled) return;
    const id = seatEl.dataset.seat!;
    const wasSelected = state.selected.has(id);
    if (wasSelected) state.selected.delete(id);
    else state.selected.add(id);
    if (state.phase !== 'shopping') {
      state.phase = 'shopping';
      state.order = null;
    }
    seatEl.classList.remove('pop');
    void seatEl.offsetWidth; // restart the pop animation
    seatEl.classList.add('pop');
    if (!wasSelected) cheerMascot();
    render();
    return;
  }

  const actionEl = target.closest<HTMLElement>('[data-action]');
  if (!actionEl || (actionEl as HTMLButtonElement).disabled) return;
  const id = actionEl.dataset.id;
  if (state.phase === 'processing') return;

  switch (actionEl.dataset.action) {
    case 'open-curtain':
      openCurtain();
      break;
    case 'close-curtain':
      closeCurtain();
      break;
    case 'toggle-sound':
      toggleSound();
      break;
    case 'enter-tour':
      enterTour();
      break;
    case 'pay':
      void pay();
      break;
    case 'remove':
      if (id) state.selected.delete(id);
      render();
      break;
    case 'buy-more':
      state.phase = 'shopping';
      state.order = null;
      render();
      break;
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && state.introPhase === 'closed') {
    e.preventDefault();
    openCurtain();
  }
});

mount();
render();
