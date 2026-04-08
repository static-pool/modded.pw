/* modded.pw — site.js */

let perPage  = 9;      // 0 = unlimited
let viewMode = 'grid'; // 'grid' | 'table'
let platSet = new Set(), gameSet = new Set();
let filtered = [], page = 1;

const cards = () => Array.from(document.querySelectorAll('.card'));

const YT_PATH = `<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>`;
const EYE_SVG = `<svg viewBox="0 0 24 24" width="13" height="13" fill="white"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;

document.addEventListener('DOMContentLoaded', () => {
  buildCards();
  // Platform chips — static in HTML
  document.querySelectorAll('.filter-panel [data-plat]').forEach(el =>
    el.addEventListener('click', () => toggleChip('plat', el.dataset.plat, el)));
  // Game chips — dynamically created by games.js, already in DOM by now
  document.querySelectorAll('.filter-panel [data-game]').forEach(el =>
    el.addEventListener('click', () => toggleChip('game', el.dataset.game, el)));
  document.getElementById('search').addEventListener('input', applyFilters);
  applyFilters();
});

function buildCards() {
  cards().forEach(card => {
    const t      = card.dataset.title;
    const plts   = card.dataset.platforms.split(' ');
    const gameIds= card.dataset.games.split(' ');
    const tags   = JSON.parse(card.dataset.tags || '[]');
    const isPaid = card.dataset.paid === 'true';
    const price  = card.dataset.price || '';

    const platBadges = plts.map(p =>
      p === 'ps3'  ? `<span class="plat-badge pb-ps3">PS3</span>` :
      p === 'x360' ? `<span class="plat-badge pb-x360">X360</span>` : ''
    ).join('');

    // Game badges — look up label from GAMES if available
    const gameBadges = gameIds.map(g => {
      const def = (typeof GAMES !== 'undefined') ? GAMES.find(x => x.id === g) : null;
      const lbl = def ? def.label : g.toUpperCase();
      return `<span class="game-badge">${lbl}</span>`;
    }).join('');

    const paidBadge = isPaid
      ? `<span class="paid-badge">${price ? price : 'PAID'}</span>`
      : '';

    card.innerHTML = `
      ${isPaid ? '<div class="paid-shine"></div>' : ''}
      <div class="card-top">
        <div class="ft-badge ${card.dataset.ftclass}">${card.dataset.ft}</div>
        <div class="card-meta">
          <div class="card-title-row">
            <div class="card-title">${t}</div>
            ${paidBadge}
          </div>
          <div class="card-desc">${card.dataset.desc}</div>
        </div>
      </div>
      <div class="card-thumb">
        <img src="${card.dataset.thumb}" alt="${t}" loading="lazy">
        <div class="thumb-overlay"><div class="thumb-zoom">${EYE_SVG}</div></div>
        <span class="thumb-label">PREVIEW</span>
      </div>
      <div class="card-plats-games">
        <div class="card-plats">${platBadges}</div>
        <div class="card-games">${gameBadges}</div>
      </div>
      <div class="card-tags">${tags.map(tg => `<span class="tag">${tg}</span>`).join('')}</div>
      <div class="card-footer">
        <div class="card-info">
          <span>${card.dataset.size}</span>
          <span>${card.dataset.date}</span>
        </div>
        <div class="card-actions">
          <button class="btn btn-copy">
            <svg class="i" viewBox="0 0 24 24" width="10" height="10"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>COPY
          </button>
          <a class="btn btn-yt" href="${(JSON.parse(card.dataset.yts||'[]')[0]||'#')}" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" stroke="none">${YT_PATH}</svg>WATCH
          </a>
          <button class="btn ${isPaid ? 'btn-paid-dl' : 'btn-dl'}">
            <svg class="i" viewBox="0 0 24 24" width="10" height="10"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>${isPaid ? 'BUY' : 'GET'}
          </button>
        </div>
      </div>`;

    const thumb   = card.querySelector('.card-thumb');
    const copyBtn = card.querySelector('.btn-copy');
    const dlBtn   = card.querySelector('.btn-dl, .btn-paid-dl');

    thumb.addEventListener('click',  (e) => { e.stopPropagation(); openLightbox(card); });
    copyBtn.addEventListener('click', (e) => { e.stopPropagation(); copyLink(copyBtn, card.dataset.file); });
    dlBtn.addEventListener('click',   (e) => { e.stopPropagation(); startDownload(dlBtn, card); });
    card.addEventListener('click',    (e) => { e.stopPropagation(); });
  });
  document.getElementById('header-count').textContent = cards().length + ' mods';
}

/* ── FILTER ── */
function toggleChip(type, val, el) {
  const set = type === 'plat' ? platSet : gameSet;
  set.has(val) ? (set.delete(val), el.classList.remove('on'))
               : (set.add(val),    el.classList.add('on'));
  applyFilters();
}

function applyFilters() {
  const q = (document.getElementById('search').value || '').toLowerCase().trim();
  filtered = cards().filter(c => {
    const plts   = c.dataset.platforms.split(' ');
    const gameIds= c.dataset.games.split(' ');
    const title  = c.dataset.title.toLowerCase();
    const tags   = JSON.parse(c.dataset.tags || '[]').join(' ').toLowerCase();
    const platOk   = platSet.size === 0 || plts.some(p => platSet.has(p));
    const gameOk   = gameSet.size === 0 || gameIds.some(g => gameSet.has(g));
    const searchOk = !q || title.includes(q) || tags.includes(q) || gameIds.some(g => g.includes(q));
    return platOk && gameOk && searchOk;
  });
  page = 1;
  renderPills();
  renderPage();
}

function renderPills() {
  const bar = document.getElementById('pill-bar');
  if (!platSet.size && !gameSet.size) {
    bar.innerHTML = `<span class="pill-hint">// select console and / or game to filter</span>`;
    return;
  }
  let h = '';
  platSet.forEach(p => {
    h += `<span class="pill pill-${p}">${p === 'ps3' ? 'PlayStation 3' : 'Xbox 360'}<span class="pill-x" onclick="removePlat('${p}')">×</span></span>`;
  });
  gameSet.forEach(g => {
    h += `<span class="pill pill-game">${g.toUpperCase()}<span class="pill-x" onclick="removeGame('${g}')">×</span></span>`;
  });
  h += `<button class="clear-btn" onclick="clearAll()">clear all</button>`;
  bar.innerHTML = h;
}

function removePlat(p) { platSet.delete(p); document.querySelector(`.filter-panel [data-plat="${p}"]`)?.classList.remove('on'); applyFilters(); }
function removeGame(g) { gameSet.delete(g); document.querySelector(`.filter-panel [data-game="${g}"]`)?.classList.remove('on'); applyFilters(); }
function clearAll()    { platSet.clear(); gameSet.clear(); document.querySelectorAll('.filter-panel [data-plat],.filter-panel [data-game]').forEach(el => el.classList.remove('on')); applyFilters(); }

/* ── VIEW TOGGLE ── */
function setView(v) {
  viewMode = v;
  document.getElementById('grid-wrap').style.display  = v === 'grid'  ? '' : 'none';
  document.getElementById('table-wrap').style.display = v === 'table' ? '' : 'none';
  document.getElementById('btn-grid').classList.toggle('on',  v === 'grid');
  document.getElementById('btn-table').classList.toggle('on', v === 'table');
  page = 1;
  renderPage();
}

function setPerPage(val) {
  perPage = parseInt(val, 10);
  page = 1;
  renderPage();
}

/* ── PAGINATION ── */
function pageCount() {
  if (perPage === 0) return 1;
  return Math.max(1, Math.ceil(filtered.length / perPage));
}

function renderPage(scrollToGrid) {
  const total = pageCount();
  const pp    = perPage === 0 ? filtered.length : perPage;
  const start = (page - 1) * pp;
  const slice = filtered.slice(start, perPage === 0 ? undefined : start + pp);

  // ── GRID ──
  cards().forEach(c => { c.classList.add('hidden'); c.classList.remove('animating'); });
  slice.forEach(c => {
    c.classList.remove('hidden');
    void c.offsetWidth;
    c.classList.add('animating');
  });
  clearTimeout(renderPage._t);
  renderPage._t = setTimeout(() => { cards().forEach(c => c.classList.remove('animating')); }, 520);
  document.getElementById('empty').classList.toggle('show', !filtered.length);

  // ── TABLE ──
  renderTablePage(slice);

  // ── SHARED UI ──
  document.getElementById('visible-count').textContent = filtered.length;
  document.getElementById('page-label').textContent    = perPage === 0 ? '1 / 1' : page + ' / ' + total;
  document.querySelectorAll('.pg-btn').forEach(b => {
    const n = +b.dataset.p;
    b.classList.toggle('on', n === page);
    b.style.display = n <= total ? '' : 'none';
  });
  document.getElementById('prev').disabled = page <= 1;
  document.getElementById('next').disabled = page >= total;
  if (scrollToGrid) {
    document.getElementById('grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function renderTablePage(slice) {
  const tbody   = document.getElementById('table-body');
  const emptyEl = document.getElementById('empty-table');
  if (!tbody) return;
  tbody.innerHTML = '';
  emptyEl.classList.toggle('show', !filtered.length);

  const YT_ICON = `<svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" stroke="none"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`;
  const DL_ICON  = `<svg style="width:10px;height:10px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
  const CP_ICON  = `<svg style="width:10px;height:10px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

  slice.forEach((card, i) => {
    const isPaid  = card.dataset.paid === 'true';
    const price   = card.dataset.price || '';
    const gameIds = card.dataset.games.split(' ');
    const plts    = card.dataset.platforms.split(' ');
    const yts     = JSON.parse(card.dataset.yts || '[]');
    const firstYt = yts[0] || '#';

    const gameChips = gameIds.map(g => {
      const def = (typeof GAMES !== 'undefined') ? GAMES.find(x => x.id === g) : null;
      return `<span class="tbl-game-chip">${def ? def.label : g.toUpperCase()}</span>`;
    }).join('');

    const consoleBadges = plts.map(p =>
      p === 'ps3'  ? `<span class="tbl-console-badge pb-ps3">PS3</span>` :
      p === 'x360' ? `<span class="tbl-console-badge pb-x360">X360</span>` : ''
    ).join('');

    const rawPath = card.dataset.file || card.dataset.url || '';
    const filename = rawPath.split('/').pop() || '—';
    const ftCls = card.dataset.ftclass || 'ft-mod';

    const tr = document.createElement('tr');
    tr.className = `animating${isPaid ? ' paid-row' : ''}`;
    tr.style.animationDelay = Math.min(i * 25, 225) + 'ms';
    tr.innerHTML = `
      <td><div class="tbl-name"><div class="tbl-ft ${ftCls}">${card.dataset.ft}</div><div class="tbl-name-inner"><span>${card.dataset.title}</span>${isPaid ? `<span class="tbl-paid-badge">${price || 'PAID'}</span>` : ''}</div></div></td>
      <td><div class="tbl-games">${gameChips}</div></td>
      <td><div class="tbl-consoles">${consoleBadges}</div></td>
      <td><span class="tbl-filename">${filename}</span></td>
      <td><span class="tbl-size">${card.dataset.size}</span></td>
      <td><div class="tbl-actions">
        <button class="tbl-btn tbl-copy">${CP_ICON} COPY</button>
        <a class="tbl-btn tbl-yt" href="${firstYt}" target="_blank" rel="noopener">${YT_ICON} WATCH</a>
        <button class="tbl-btn ${isPaid ? 'tbl-paid-dl' : 'tbl-dl'}">${DL_ICON} ${isPaid ? 'BUY' : 'GET'}</button>
      </div></td>`;

    tr.querySelector('.tbl-copy').addEventListener('click', (e) => { e.stopPropagation(); copyLink(tr.querySelector('.tbl-copy'), card.dataset.file); });
    tr.querySelector('.tbl-dl, .tbl-paid-dl')?.addEventListener('click', (e) => { e.stopPropagation(); startDownload(tr.querySelector('.tbl-dl, .tbl-paid-dl'), card); });
    tr.addEventListener('click', (e) => { if (!e.target.closest('.tbl-actions')) openLightbox(card); });

    tbody.appendChild(tr);
  });

  clearTimeout(renderTablePage._t);
  renderTablePage._t = setTimeout(() => {
    tbody.querySelectorAll('tr.animating').forEach(r => r.classList.remove('animating'));
  }, 520);
}

function goPage(n)    { page = n; renderPage(true); }
function shiftPage(d) { page = Math.max(1, Math.min(page + d, pageCount())); renderPage(true); }

/* ── COPY ── */
function copyLink(btn, fileId) {
  // If the card has redirect mode, find its url from the card dataset
  const card = btn.closest('.card');
  const isRedirect = card && card.dataset.redirect === 'true';
  const url = isRedirect
    ? (card.dataset.url || '')
    : `${location.origin}/dl/${encodeURIComponent(fileId)}`;

  navigator.clipboard.writeText(url).then(() => {
    const orig = btn.innerHTML;
    btn.innerHTML = `<svg class="i" viewBox="0 0 24 24" width="10" height="10"><polyline points="20 6 9 17 4 12"/></svg>COPIED`;
    btn.classList.add('ok');
    setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('ok'); }, 2000);
  });
}

/* ── DOWNLOAD ────────────────────────────────────────────────────
   Two modes, controlled per-file in files.js:
     redirect: true  → opens card.dataset.url in a new tab immediately
     redirect: false → calls Cloudflare Worker for a signed R2 URL
──────────────────────────────────────────────────────────────── */
async function startDownload(btn, card) {
  const isRedirect = card.dataset.redirect === 'true';

  if (isRedirect) {
    // Simple redirect — open the provided URL in a new tab
    window.open(card.dataset.url, '_blank', 'noopener,noreferrer');
    const orig = btn.innerHTML;
    btn.innerHTML = `<svg class="i" viewBox="0 0 24 24" width="10" height="10"><polyline points="20 6 9 17 4 12"/></svg>OPENED`;
    setTimeout(() => { btn.innerHTML = orig; }, 2000);
    return;
  }

  // Token-gated R2 download
  const fileId = card.dataset.file;
  const title  = card.dataset.title;
  const orig   = btn.innerHTML;
  btn.innerHTML = `<svg class="i" viewBox="0 0 24 24" width="10" height="10"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/></svg>…`;
  btn.disabled = true;

  try {
    const res = await fetch('/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId }),
    });
    if (res.status === 429) throw new Error('rate_limited');
    if (!res.ok)            throw new Error('server_error');
    const { url } = await res.json();
    const a = document.createElement('a');
    a.href = url; a.download = title;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    btn.innerHTML = `<svg class="i" viewBox="0 0 24 24" width="10" height="10"><polyline points="20 6 9 17 4 12"/></svg>GOT IT`;
    setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 3000);
  } catch (err) {
    btn.innerHTML = err.message === 'rate_limited' ? 'SLOW DOWN' : 'ERROR';
    setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 2500);
  }
}

/* ── LIGHTBOX ── */
let lbMediaIdx = 0;
let lbMedia    = [];   // [{type:'img',src} | {type:'yt',url,label}]

function openLightbox(card) {
  const plts    = card.dataset.platforms.split(' ');
  const gameIds = card.dataset.games.split(' ');

  // Build human-readable game labels for subtitle
  const gameLabels = gameIds.map(g => {
    const def = (typeof GAMES !== 'undefined') ? GAMES.find(x => x.id === g) : null;
    return def ? def.label : g.toUpperCase();
  }).join(' · ');

  // Build media array: all images in order, then all videos in order
  lbMedia = [];
  const previews = JSON.parse(card.dataset.previews || '[]');
  const yts      = JSON.parse(card.dataset.yts      || '[]');
  previews.forEach(src => lbMedia.push({ type: 'img', src }));
  yts.forEach(url      => lbMedia.push({ type: 'yt',  url }));

  lbMediaIdx = 0;

  // Populate static fields
  document.getElementById('lb-title-el').textContent = card.dataset.title;
  document.getElementById('lb-sub-el').textContent   = gameLabels + ' · ' + card.dataset.size + ' · ' + card.dataset.date;
  document.getElementById('lb-ps3').style.display    = plts.includes('ps3')  ? '' : 'none';
  document.getElementById('lb-x360').style.display   = plts.includes('x360') ? '' : 'none';
  document.getElementById('lb-dl-btn').onclick       = (e) => { e.stopPropagation(); startDownload(document.getElementById('lb-dl-btn'), card); };
  document.getElementById('lb-copy-btn').onclick     = (e) => { e.stopPropagation(); copyLink(document.getElementById('lb-copy-btn'), card.dataset.file); };

  // Show/hide nav arrows and dots
  renderLbMedia();
  renderLbDots();

  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderLbMedia() {
  const item    = lbMedia[lbMediaIdx];
  const imgWrap = document.getElementById('lb-img-wrap');
  const ytWrap  = document.getElementById('lb-yt-wrap');
  const prevBtn = document.getElementById('lb-prev');
  const nextBtn = document.getElementById('lb-next');

  if (!item) return;

  if (item.type === 'img') {
    imgWrap.style.display = '';
    ytWrap.style.display  = 'none';
    document.getElementById('lb-img-el').src = item.src;
  } else {
    imgWrap.style.display = 'none';
    ytWrap.style.display  = '';
    // Convert any watch/short URL to embed
    const raw  = item.url;
    const vid  = raw.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1] || '';
    const embed = vid ? `https://www.youtube.com/embed/${vid}?rel=0&modestbranding=1` : raw;
    document.getElementById('lb-yt-frame').src = embed;
    // Show which video number this is
    const ytIdx = lbMedia.slice(0, lbMediaIdx + 1).filter(m => m.type === 'yt').length;
    const ytTotal = lbMedia.filter(m => m.type === 'yt').length;
    document.getElementById('lb-yt-label').textContent = ytTotal > 1 ? `Video ${ytIdx} of ${ytTotal}` : 'Video';
    document.getElementById('lb-yt-btn').href = raw;
  }

  // Keep WATCH button pointing to current yt, fallback to first yt
  const firstYt = lbMedia.find(m => m.type === 'yt');
  if (firstYt && item.type !== 'yt') document.getElementById('lb-yt-btn').href = firstYt.url;

  prevBtn.style.display = lbMedia.length > 1 ? '' : 'none';
  nextBtn.style.display = lbMedia.length > 1 ? '' : 'none';
  prevBtn.disabled = lbMediaIdx === 0;
  nextBtn.disabled = lbMediaIdx === lbMedia.length - 1;
}

function renderLbDots() {
  const wrap = document.getElementById('lb-dots');
  if (lbMedia.length <= 1) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'flex';

  let imgCount = 0, ytCount = 0;
  wrap.innerHTML = lbMedia.map((m, i) => {
    const cls = i === lbMediaIdx ? 'lb-dot active' : 'lb-dot';
    let label;
    if (m.type === 'img') { imgCount++; label = `Image ${imgCount}`; }
    else                   { ytCount++;  label = `Video ${ytCount}`; }
    const icon = m.type === 'yt' ? '▶' : '◉';
    return `<button class="${cls}" onclick="lbGoTo(${i})" title="${label}">${icon}</button>`;
  }).join('');
}

function lbGoTo(idx) {
  // Clear iframe src when leaving a video to stop playback
  if (lbMedia[lbMediaIdx] && lbMedia[lbMediaIdx].type === 'yt') {
    document.getElementById('lb-yt-frame').src = '';
  }
  lbMediaIdx = idx;
  renderLbMedia();
  renderLbDots();
}

function lbNav(dir) { lbGoTo(Math.max(0, Math.min(lbMediaIdx + dir, lbMedia.length - 1))); }

function closeLightbox() {
  // Stop video on close
  if (lbMedia[lbMediaIdx] && lbMedia[lbMediaIdx].type === 'yt') {
    document.getElementById('lb-yt-frame').src = '';
  }
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  lbNav(-1);
  if (e.key === 'ArrowRight') lbNav(1);
});

let popupTimeout;

function showCopyPopup() {
  const popup = document.getElementById("copy-popup");

  // Clear any existing timeout to handle spam clicks
  if (popupTimeout) clearTimeout(popupTimeout);

  // Trigger animation
  popup.classList.add("show");

  // Hide after 2 seconds
  popupTimeout = setTimeout(() => {
    popup.classList.remove("show");
  }, 2000);
}

function copyText(button) {
  const textToCopy = button.dataset.text;
  if (!textToCopy) return;

  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      showCopyPopup();
    })
    .catch(err => {
      console.error("Failed to copy: ", err);
    });
}
