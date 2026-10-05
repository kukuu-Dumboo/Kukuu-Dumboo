/* OUR ARCHIVE — script.js (vanilla, no dependencies) */
(() => {
'use strict';
/* ===== CONFIGURATION ===== */
const S = SETTINGS, C = CONTENT, app = document.getElementById('app');
const COLL = ['Him', 'Her', 'Together'];
/* ===== UTILITY FUNCTIONS ===== */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const path = p => p.split('/').map(encodeURIComponent).join('/');
const pad = (n, p) => p + String(n).padStart(3, '0');
const range = n => Array.from({ length: n || 0 }, (_, i) => i + 1);
const fmt = d => { const x = new Date(d); return d && !isNaN(x) ? x.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() : ''; };
const nf = () => `<h1>Not found</h1><p>This entry is not in the archive. <a href="#/home">Return home</a>.</p>`;
const body = t => t.replace(/\r/g, '').split(/\n{2,}/).map(b => { b = b.trim(); return !b ? '' : b === '---' ? '<hr>' : b.startsWith('# ') ? `<h3>${esc(b.slice(2))}</h3>` : `<p>${esc(b).replace(/\n/g, '<br>')}</p>`; }).join('');
const raw = async p => { try { const r = await fetch(path(p)); return r.ok ? await r.text() : ''; } catch { return ''; } };
const fig = (src, cls = '', cap = '') => `<figure class="ph rv ${cls}"><img src="${path(src)}" alt="Archive photograph${cap ? ': ' + esc(cap) : ''}" loading="lazy" decoding="async" data-lb onerror="this.parentNode.remove()">${cap ? `<figcaption>${esc(cap)}</figcaption>` : ''}</figure>`;
const parts = async (f, tc, ic) => { const n = Math.max(tc || 0, ic || 0); const t = await Promise.all(range(n).map(i => i <= (tc || 0) ? raw(`${f}/${i}.txt`) : '')); return range(n).map(i => ({ i, t: t[i - 1], im: i <= (ic || 0) ? `${f}/${i}.jpg` : '' })); };
const meta = rows => `<div class="strip">${rows.filter(r => r[1]).map(r => `<span>${r[0]}: <b>${esc(r[1])}</b></span>`).join('')}</div>`;
/* ===== LOCAL STORAGE ===== */
const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
/* ===== STATE ===== */
const ITEMS = [];
let n = 0;
C.blogs.forEach(y => y.blogs.forEach(b => ITEMS.push({ type: 'blog', id: pad(++n, 'BLOG-'), title: b.title, date: b.date, ex: b.summary, cat: `Blog, year ${y.year}`, href: `#/blog/${y.year}/${b.id}`, b, y })));
C.dates.forEach((d, i) => ITEMS.push({ type: 'date', id: pad(i + 1, 'DATE-'), title: d.name, date: d.date, ex: d.summary, cat: 'Date', href: '#/date/' + i, d }));
C.trips.forEach((t, i) => ITEMS.push({ type: 'trip', id: pad(i + 1, 'TRIP-'), title: t.name, date: t.date, ex: t.summary, cat: 'Trip', href: '#/trip/' + i, t }));
const photoCount = () => COLL.reduce((a, c) => a + (C.pics[c]?.count || 0), 0) + ITEMS.reduce((a, x) => a + ((x.b || x.d || x.t)?.imageCount || 0), 0);
const dated = () => [...ITEMS, ...C.timeline.map(m => ({ ...m, type: 'milestone', cat: 'Milestone', href: m.href || '#/timeline' }))].filter(x => x.date && fmt(x.date)).sort((a, b) => new Date(a.date) - new Date(b.date));
/* ===== ARTICLE ===== */
const sections = () => C.article.sections.map(s => s.title === 'Overview' && !s.body ? { ...s, body: `This archive contains photographs, conversations, dates, journeys, stories and other fragments documenting the relationship between ${S.person1} and ${S.person2}.` } : s).filter(s => s.body);
const infobox = () => {
  const rows = [['Names', `${S.person1} and ${S.person2}`], ['Relationship began', fmt(S.relationshipStart)], ['Current status', 'Active'], ['First meeting', fmt(S.firstMeeting)], ['First proposal', fmt(S.firstProposal)],
    ['Total photographs', photoCount()], ['Total blogs', ITEMS.filter(x => x.type === 'blog').length], ['Total dates', C.dates.length], ['Total trips', C.trips.length]];
  return `<details class="ibx" open><summary>${esc(S.person1.split(' ')[0])} &amp; ${esc(S.person2.split(' ')[0])}</summary>${rows.filter(r => r[1]).map(r => `<div><dt>${r[0]}</dt><dd>${esc(r[1])}</dd></div>`).join('')}</details>`;
};
const articleView = () => {
  const ss = sections();
  const notes = C.article.notes.length ? `<h2>Notes</h2><ol>${C.article.notes.map((x, i) => `<li id="fn${i + 1}">${esc(x)}</li>`).join('')}</ol>` : '';
  return `${crumbs(['Article'])}<div class="tabs"><a aria-current="page" href="#/article">Article</a><a href="#/more">Discussion</a><a href="#/article">Read</a><a href="#/note">Edit</a><a href="#/history">History</a></div>
  <h1>${esc(S.person1)} and ${esc(S.person2)}</h1><p class="sub">A private record of a relationship, its history, and the memories accumulated along the way.</p>
  ${meta([['First recorded', fmt(S.relationshipStart)], ['Last updated', fmt(document.lastModified)], ['Archive status', 'Active'], ['Revision', revision()]])}
  <div class="art"><aside class="toc" aria-label="Contents">${ss.map((s, i) => `<a href="#/article" data-sec="s${i}">${i + 1}. ${esc(s.title)}</a>`).join('') || '<span class="meta">Contents appear as sections are written.</span>'}</aside>
  <article>${ss.map((s, i) => `<h2 id="s${i}">${i + 1}. ${esc(s.title)}</h2>${body(s.body)}`).join('')}${notes}${related()}</article>${infobox()}</div>`;
};
const revision = () => S.revision || ITEMS.length + C.letters.length + 1;
/* ===== NAVIGATION / helpers ===== */
const crumbs = a => `<nav class="crumb" aria-label="Breadcrumb"><a href="#/home">Home</a> / ${a.map(x => Array.isArray(x) ? `<a href="${x[1]}">${esc(x[0])}</a>` : esc(x)).join(' / ')}</nav>`;
const related = it => {
  const L = [], add = x => x && !L.includes(x) && x !== it && L.length < 5 && L.push(x);
  ((it?.b || it?.d || it?.t)?.related || []).forEach(r => { const [t, name] = r.split(':'); if (t === 'pics') add({ title: (name || 'Together') + ' collection', cat: 'Photographs', href: '#/pics/' + (name || 'Together') }); else add(ITEMS.find(x => x.type === t && x.title === name)); });
  ITEMS.filter(x => !it || x.type === it.type).forEach(add); ITEMS.forEach(add);
  return L.length ? `<section class="rel"><h4>RELATED ARCHIVES</h4><div class="rows">${L.map(x => `<a href="${x.href}"><b>${esc(x.title)}</b><span>${esc(x.cat)}</span></a>`).join('')}</div></section>` : '';
};
const list = (items, empty) => items.length ? `<div class="rows">${items.map(x => `<a href="${x.href}"><b>${esc(x.title)}</b><span>${x.id || ''} ${fmt(x.date)}</span></a>`).join('')}</div>` : `<p class="empty">${empty}</p>`;
/* ===== VIEWS ===== */
const V = {
  async home() {
    const last = dated().filter(x => x.id).pop();
    const st = [['PHOTOGRAPHS', photoCount()], ['BLOGS', ITEMS.filter(x => x.type === 'blog').length], ['DATES', C.dates.length], ['TRIPS', C.trips.length], ['LETTERS', C.letters.length], ['CHAPTERS', C.blogs.length]].filter(s => s[1]);
    const sec = [['Article', 'A complete overview'], ['Blogs', 'Stories and reflections'], ['Pics', 'Photographic archive'], ['Dates', 'Important moments'], ['Trips', 'Journeys'], ['Letters', 'Private correspondence'], ['Timeline', 'Chronological record']];
    return `<span class="id">ARCHIVE-001</span><h1>OUR ARCHIVE</h1><p class="sub">A record of the moments we decided were worth remembering.</p>
    ${meta([['Established', fmt(S.relationshipStart)], ['Status', 'Active'], ['Archive', 'Private'], ['Last archived', last ? fmt(last.date) : ''], ['Most recent addition', last?.title]])}
    <p class="read" style="margin:0;font-size:18px">This archive contains photographs, conversations, dates, journeys, stories and other fragments documenting the relationship between ${esc(S.person1)} and ${esc(S.person2)}.</p>
    ${st.length ? `<div class="stats">${st.map(s => `<div><b>${s[1]}</b>${s[0]}</div>`).join('')}</div>` : ''}
    <div class="rows">${sec.map(s => `<a href="#/${s[0].toLowerCase()}"><b>${s[0]}</b><span>${s[1]}</span></a>`).join('')}</div>`;
  },
  async article() { return articleView(); },
  async blogs() {
    const h = C.blogs.map(y => `<h2>Year ${y.year}${y.title ? ': ' + esc(y.title) : ''}</h2>${list(ITEMS.filter(x => x.y === y), 'No entries.')}`).join('');
    return `${crumbs(['Blogs'])}<h1>Blogs</h1><p class="sub">Archived journal articles, organised by year.</p>${h || '<p class="empty">No blogs archived yet. Add them in content-manifest.js.</p>'}`;
  },
  async blog(y, id) {
    const it = ITEMS.find(x => x.type === 'blog' && x.y.year == y && x.b.id == id); if (!it) return nf();
    const b = it.b, ps = await parts(b.folder, b.textCount, b.imageCount), cls = ['wide', 'center', 'inset'];
    const words = ps.reduce((a, p) => a + p.t.split(/\s+/).filter(Boolean).length, 0);
    return `${crumbs([['Blogs', '#/blogs'], 'Year ' + y, it.title])}<span class="id">${it.id}</span><h1>${esc(it.title)}</h1>
    ${meta([['Chapter', 'Year ' + y + (it.y.title ? ', ' + it.y.title : '')], ['Date', fmt(b.date)], ['Reading time', words ? Math.max(1, Math.round(words / 220)) + ' min' : '']])}
    <div class="read">${ps.map(p => `${body(p.t)}${p.im ? fig(p.im, cls[p.i % 3]) : ''}`).join('')}</div>${related(it)}`;
  },
  async pics(name) {
    const c = COLL.includes(name) ? name : null;
    const tabs = `<div class="tabs"><a href="#/pics" ${!c ? 'aria-current="page"' : ''}>All</a>${COLL.map(x => `<a href="#/pics/${x}" ${x === c ? 'aria-current="page"' : ''}>${x}</a>`).join('')}</div>`;
    if (!c) return `${crumbs(['Pics'])}<h1>Pics</h1><p class="sub">The visual archive.</p>${tabs}<div class="rows">${COLL.map((x, i) => `<a href="#/pics/${x}"><b>${x}</b><span>${pad(i + 1, 'PHOTO-')} ${C.pics[x]?.count || 0} photographs</span></a>`).join('')}</div>`;
    const k = C.pics[c] || {}, id = pad(COLL.indexOf(c) + 1, 'PHOTO-');
    return `${crumbs([['Pics', '#/pics'], c])}${tabs}<span class="id">${id}</span><h1>${c}</h1>${meta([['Collection', c], ['Archive', 'Photographs'], ['Items', k.count]])}<p class="sub">${esc(k.description || '')}</p>
    <div class="mas">${range(k.count).map(i => fig(`pics/${c}/${i}.jpg`, '', `${c} ${pad(i, '')}`)).join('')}</div>${k.count ? '' : '<p class="empty">No photographs in this collection yet.</p>'}`;
  },
  async dates() { return `${crumbs(['Dates'])}<h1>Dates</h1><p class="sub">Individual moments, preserved as storyboards.</p>${list(ITEMS.filter(x => x.type === 'date'), 'No dates archived yet.')}`; },
  async date(i) {
    const it = ITEMS.find(x => x.href === '#/date/' + i); if (!it) return nf(); const d = it.d, ps = await parts(d.folder, d.textCount, d.imageCount);
    return `${crumbs([['Dates', '#/dates'], it.title])}<span class="id">${it.id}</span><h1>${esc(it.title)}</h1>${meta([['Date archive', ''], ['Entry', it.title], ['Documented', fmt(d.date)], ['Category', d.category]])}
    ${ps.map(p => `<section class="beat ${p.i % 2 ? 'a' : 'b'} ${p.t && p.im ? '' : 'solo'}">${p.t ? `<div class="tx rv">${body(p.t)}</div>` : ''}${p.im ? fig(p.im) : ''}</section>`).join('')}${related(it)}`;
  },
  async trips() { return `${crumbs(['Trips'])}<h1>Trips</h1><p class="sub">Journeys, documented as expeditions.</p>${list(ITEMS.filter(x => x.type === 'trip'), 'No trips archived yet.')}`; },
  async trip(i) {
    const it = ITEMS.find(x => x.href === '#/trip/' + i); if (!it) return nf(); const t = it.t, ps = await parts(t.folder, t.textCount, t.imageCount);
    return `${crumbs([['Trips', '#/trips'], it.title])}<span class="id">${it.id}</span><h1>${esc(it.title)}</h1>${meta([['Destination', t.name], ['Date', fmt(t.date)], ['Duration', t.duration], ['Members', t.members], ['Photographs', t.imageCount]])}
    <div class="route">${ps.map(p => `<section class="beat ${p.i % 2 ? 'a' : 'b'} ${p.t && p.im ? '' : 'solo'}" data-s="${p.i}">${p.t ? `<div class="tx rv">${(t.stops?.[p.i - 1] ? `<h3>${esc(t.stops[p.i - 1])}</h3>` : '')}${body(p.t)}</div>` : ''}${p.im ? fig(p.im) : ''}</section>`).join('')}</div>${related(it)}`;
  },
  async timeline() { const d = dated(); return `${crumbs(['Timeline'])}<h1>Timeline</h1><p class="sub">The chronological record.</p>${d.length ? `<div class="tl">${d.map(x => `<a href="${x.href}"><time>${fmt(x.date)}</time><b>${esc(x.title)}</b><br><span class="meta">${esc(x.cat)}</span></a>`).join('')}</div>` : '<p class="empty">Add dates to blogs, dates, trips or timeline entries to see them here.</p>'}`; },
  async letters() {
    return `${crumbs(['Letters'])}<h1>Letters</h1><p class="sub">Private correspondence.</p>${C.letters.map((l, i) => `<article class="paper"><span class="id">LETTER NO. ${i + 1}</span>${meta([['Date', fmt(l.date)], ['Author', l.author], ['Recipient', l.recipient], ['Status', 'Private']])}${body(l.text || '')}</article>`).join('') || '<p class="empty">No letters archived yet.</p>'}`;
  },
  async more() { return `${crumbs(['More'])}<h1>More</h1><div class="rows"><a href="#/little"><b>Little Things</b><span>Too small for an article</span></a><a href="#/history"><b>Archive History</b><span>Revisions</span></a><a href="#/note"><b>Archive Note</b><span></span></a></div>`; },
  async little() { return `${crumbs([['More', '#/more'], 'Little Things'])}<h1>Little Things</h1><p class="sub">Inside jokes, phrases, habits and small observations.</p>${C.little.map((l, i) => `<div class="hit"><span class="id">LITTLE-${pad(i + 1, '')}</span><br><b>${esc(l.title)}</b><p>${esc(l.text)}</p></div>`).join('') || '<p class="empty">Nothing here yet.</p>'}`; },
  async history() {
    const last = dated().filter(x => x.id).pop();
    return `${crumbs([['More', '#/more'], 'History'])}<h1>Archive History</h1>${meta([['Created', fmt(S.created)], ['Updated', fmt(document.lastModified)], ['Revision', ''], ['Last addition', last?.title]])}<p>Revision <span class="id" id="rev" title="Revision">${revision()}</span></p>`;
  },
  async note() { return `${crumbs(['Archive Note'])}<h1>Archive Note</h1><div class="paper"><p>This archive exists for a simple reason:</p><p><i>some things become more valuable when we refuse to let them disappear.</i></p><hr>${body(S.note)}</div>`; },
  async secret() { return `<h1>Secret room</h1><div class="paper">${body(S.secret)}</div>`; },
  async search(q) {
    q = decodeURIComponent(q || '').trim().toLowerCase();
    const eggs = { distance: ['Distance, archived under Long Distance.', '#/article'], proposal: ['Proposal', '#/dates'], photos: ['PICS', '#/pics'], us: ['Article', '#/article'] };
    const pool = [...ITEMS.map(x => ({ title: x.title, cat: x.cat, date: x.date, ex: x.ex, href: x.href })), ...sections().map(s => ({ title: s.title, cat: 'Article', ex: s.body.slice(0, 120), href: '#/article' })),
      ...C.letters.map(l => ({ title: l.title || 'Letter', cat: 'Letter', date: l.date, ex: (l.text || '').slice(0, 120), href: '#/letters' })), ...C.little.map(l => ({ title: l.title, cat: 'Little Things', ex: l.text, href: '#/little' })), ...COLL.map(c => ({ title: c, cat: 'Photographs', ex: C.pics[c]?.description, href: '#/pics/' + c }))];
    const hits = pool.filter(x => q && `${x.title} ${x.ex} ${x.cat}`.toLowerCase().includes(q));
    if (eggs[q] && !hits.length) hits.push({ title: eggs[q][0], cat: 'Archive', href: eggs[q][1] });
    return `${crumbs(['Search'])}<h1>Search</h1>${hits.map(x => `<div class="hit"><a href="${x.href}"><b>${esc(x.title)}</b></a><br><span class="meta">${esc(x.cat)} ${fmt(x.date)}</span><p>${esc((x.ex || '').slice(0, 140))}</p></div>`).join('') || `<p class="empty">No results for "${esc(q)}".</p>`}`;
  }
};
/* ===== ROUTING ===== */
let tok = 0;
async function route() {
  const t = ++tok, h = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent), r = V[h[0]] ? h[0] : 'home';
  app.classList.add('out'); await new Promise(res => setTimeout(res, matchMedia('(prefers-reduced-motion:reduce)').matches ? 0 : 160));
  const html = await V[r](...h.slice(1)); if (t !== tok) return;
  app.innerHTML = html; app.classList.remove('out'); window.scrollTo(0, 0);
  const sect = { blog: 'blogs', date: 'dates', trip: 'trips', little: 'more', history: 'more', note: 'more', search: '' }[r] ?? r;
  $$('#nav a').forEach(a => a.toggleAttribute('aria-current', a.dataset.r === sect)); $('#nav').classList.remove('open');
  document.title = (r === 'home' ? 'Our Archive' : ($('h1', app)?.textContent || r) + ' — Our Archive'); $('#fid').textContent = '';
  if (r !== 'secret') { store.set('lastSection', location.hash); }
  reveal(); toc(); if (!store.get('firstVisit')) store.set('firstVisit', new Date().toISOString());
}
/* ===== ANIMATIONS ===== */
function reveal() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('in'), (e.target.dataset.d || 0) * 60); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
  $$('.rv', app).forEach((el, i) => { el.dataset.d = i % 4; io.observe(el); });
}
function toc() {
  const links = $$('[data-sec]'); if (!links.length) return;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(l => l.classList.toggle('on', l.dataset.sec === e.target.id)); }), { rootMargin: '-20% 0px -70% 0px' });
  links.forEach(l => { io.observe($('#' + l.dataset.sec)); l.addEventListener('click', ev => { ev.preventDefault(); $('#' + l.dataset.sec).scrollIntoView(); }); });
}
/* ===== LIGHTBOX ===== */
const lb = $('#lb'), lbi = $('#lbi'); let imgs = [], cur = 0, sx = 0;
function show(i) {
  cur = (i + imgs.length) % imgs.length; lbi.style.opacity = 0;
  setTimeout(() => { lbi.src = imgs[cur].currentSrc || imgs[cur].src; lbi.alt = imgs[cur].alt; lbi.style.opacity = 1; }, 120);
  $('#lbt').textContent = `${cur + 1} / ${imgs.length}`;
  [cur - 1, cur + 1].forEach(j => { const im = new Image(); im.src = imgs[(j + imgs.length) % imgs.length].src; });
}
const openLb = i => { imgs = $$('[data-lb]', app); lb.hidden = false; document.body.style.overflow = 'hidden'; show(i); $('.lbc').focus(); };
const closeLb = () => { lb.hidden = true; document.body.style.overflow = ''; };
lb.addEventListener('click', e => { const a = e.target.dataset.a; if (a === 'close' || e.target === lb) closeLb(); if (a === 'next') show(cur + 1); if (a === 'prev') show(cur - 1); });
lb.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1)); });
/* ===== SEARCH, MODALS, EASTER EGGS, EVENTS ===== */
let taps = 0, buf = '';
document.addEventListener('click', e => {
  const im = e.target.closest('[data-lb]'); if (im) openLb($$('[data-lb]', app).indexOf(im));
  if (e.target.id === 'rev' && ++taps >= 5) location.hash = '#/secret';          // egg: tap revision 5 times
  if (e.target.closest('.brand') && e.detail === 3) location.hash = '#/secret';  // egg: triple-click the title
});
document.addEventListener('keydown', e => {
  if (!lb.hidden) { if (e.key === 'Escape') closeLb(); if (e.key === 'ArrowRight') show(cur + 1); if (e.key === 'ArrowLeft') show(cur - 1); return; }
  if (e.target.tagName === 'INPUT') return;
  if (e.key === '/') { e.preventDefault(); $('#q').focus(); }                      // egg: "/" focuses search
  buf = (buf + e.key.toLowerCase()).slice(-6); if (buf === 'secret') location.hash = '#/secret'; // egg: type "secret"
});
$('#sf').addEventListener('submit', e => { e.preventDefault(); location.hash = '#/search/' + encodeURIComponent($('#q').value); });
$('#menu').addEventListener('click', () => { const o = $('#nav').classList.toggle('open'); $('#menu').setAttribute('aria-expanded', o); });
window.addEventListener('hashchange', route);
route();
})();
