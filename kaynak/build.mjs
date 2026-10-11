// Bahar Tel Çit statik site üreticisi.
// Kullanım: node build.mjs  ->  ../site klasörüne tüm sayfaları üretir.
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { services, districts, photos } from './data.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(ROOT, '..', 'site');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'config.json'), 'utf8'));
const SITE = cfg.siteUrl.replace(/\/$/, '');
const TODAY = new Date().toISOString().slice(0, 10);
fs.rmSync(OUT, { recursive: true, force: true });
const YEAR = new Date().getFullYear();

// ---------- yardımcılar ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = (s) =>
  s.toLocaleLowerCase('tr')
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const lower = (s) => s.toLocaleLowerCase('tr');
const hash = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
const withBrand = (t) => (t.length <= 44 ? `${t} | Bahar Tel Çit` : t);
const cap = (s) => s.split(' ').map((w) => w[0].toLocaleUpperCase('tr') + w.slice(1)).join(' ');
const pick = (arr, seed, salt = 0) => arr[(hash(seed) + salt * 7) % arr.length];

// Türkçe bulunma hali eki: Silivri’de, Çatalca’da, Kumburgaz’da, Çanta’da, Seymen’de, Kalfa’da
function loc(word) {
  const w = lower(word);
  const vowels = [...w].filter((c) => 'aeıioöuü'.includes(c));
  const lv = vowels[vowels.length - 1] || 'e';
  const back = 'aıou'.includes(lv);
  const last = w[w.length - 1];
  const hard = 'fstkçşhp'.includes(last);
  return `${word}’${hard ? 't' : 'd'}${back ? 'a' : 'e'}`;
}

const svc = Object.fromEntries(services.map((s) => [s.slug, s]));
const svcSlugByName = Object.fromEntries(services.map((s) => [s.name, s.slug]));
const waLink = (text) => `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(text)}`;
const telLink = `tel:${cfg.phone}`;

// Tarayıcı önbelleği eski CSS/JS'yi tutmasın: dosya içeriği değişince adres de değişir
const fileHash = (f) => crypto.createHash('md5').update(fs.readFileSync(path.join(ROOT, 'assets', f))).digest('hex').slice(0, 8);
const ASSET_V = { css: fileHash('style.css'), js: fileHash('app.js') };

// ---------- bölgeleri hazırla ----------
const places = []; // tüm köy/mahalle sayfaları
for (const d of districts) {
  d.locText = d.loc || loc(d.name);
  d.hub = `/${d.slug}-tel-cit/`;
  d.places = d.villages.map((v) => {
    const full = d.prefix ? `${d.name} ${v}` : v;
    const locWord = (d.villageLoc && d.villageLoc[v]) || loc(v);
    const p = {
      name: v,
      full,
      locText: d.prefix ? `${d.name} ${locWord}` : locWord,
      shortLoc: locWord,
      district: d,
      url: `/${d.prefix ? d.slug + '-' : ''}${slugify(v)}-tel-cit/`
    };
    places.push(p);
    return p;
  });
}
const svcUrl = (s) => `/${s.slug}/`;
const dsUrl = (d, s) => (s.slug === 'tel-cit' ? d.hub : `/${d.slug}-${s.slug}/`);
const allPlaceNames = [
  ...districts.map((d) => d.name),
  ...places.map((p) => (p.district.prefix ? p.full : `${p.full} (${p.district.name})`))
];

// ---------- simgeler ----------
const ICONS = {
  fence: '<path d="M4 8l2-3 2 3v12H4zM10 8l2-3 2 3v12h-4zM16 8l2-3 2 3v12h-4zM2 11h20M2 16h20"/>',
  panel: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 9h18M3 14h18M8 4v16M13 4v16M18 4v16"/>',
  grass: '<path d="M3 20c1-5 2-8 2-12M7 20c0-4 1-7 3-10M12 20V7M17 20c0-4-1-7-3-10M21 20c-1-5-2-8-2-12M2 20h20"/>',
  map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  gate: '<path d="M3 21V5M21 21V5M3 9h18M3 15h18M7.5 9v12M12 9v12M16.5 9v12M3 5l9-2 9 2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  tree: '<path d="M12 22v-6M12 16c-4 0-7-2.5-7-6 0-2.5 1.5-4 3-5 1-2 2.5-3 4-3s3 1 4 3c1.5 1 3 2.5 3 5 0 3.5-3 6-7 6z"/>',
  wa: '<path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.3-.5 0-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/>',
  phone: '<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  pin: '<path d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>'
};
const icon = (n, cls = 'ic') =>
  n === 'wa'
    ? `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">${ICONS.wa}</svg>`
    : `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]}</svg>`;

// ---------- şema (JSON-LD) ----------
const businessId = `${SITE}/#isletme`;
function businessSchema() {
  const b = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': businessId,
    name: cfg.brand,
    description: `${cfg.brand}: Silivri, Çatalca, Beylikdüzü, Büyükçekmece ve Tekirdağ’da tel çit, panel çit, çim çit, arsa çevirme, solar aydınlatma ve peyzaj.`,
    url: SITE + '/',
    logo: SITE + '/assets/marka/logo.png',
    image: [SITE + '/assets/og.jpg', ...photos.map((p) => `${SITE}/assets/foto/${p.file}-960.webp`)],
    telephone: cfg.phone,
    priceRange: '₺₺',
    openingHours: cfg.openingHours,
    address: {
      '@type': 'PostalAddress',
      ...(cfg.address.street && { streetAddress: cfg.address.street }),
      addressLocality: cfg.address.locality,
      addressRegion: cfg.address.region,
      ...(cfg.address.postalCode && { postalCode: cfg.address.postalCode }),
      addressCountry: cfg.address.country
    },
    areaServed: districts.map((d) => ({ '@type': 'City', name: d.name })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Hizmetler',
      itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, url: SITE + svcUrl(s) } }))
    }
  };
  if (cfg.email) b.email = cfg.email;
  if (cfg.geo) b.geo = { '@type': 'GeoCoordinates', latitude: cfg.geo.lat, longitude: cfg.geo.lng };
  if (cfg.googleMapsUrl) { b.hasMap = cfg.googleMapsUrl; b.sameAs = [cfg.googleMapsUrl]; }
  return b;
}
const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE}/#site`,
  name: cfg.brand,
  url: SITE + '/',
  inLanguage: 'tr-TR',
  publisher: { '@id': businessId }
});
const serviceSchema = (name, url, area, desc) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  serviceType: name,
  description: desc,
  url: SITE + url,
  provider: { '@id': businessId },
  areaServed: Array.isArray(area) ? area.map((a) => ({ '@type': 'Place', name: a })) : { '@type': 'Place', name: area }
});
const faqSchema = (faq) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
});
const crumbSchema = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + url }))
});

// ---------- ortak parçalar ----------
function trackingHead() {
  const ids = [cfg.googleAdsId, cfg.ga4Id].filter(Boolean);
  if (!ids.length) return '';
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${ids[0]}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());${ids.map((i) => `gtag('config','${i}');`).join('')}</script>`;
}

function header() {
  return `<header class="top">
  <div class="wrap top-in">
    <a class="logo" href="/" aria-label="${esc(cfg.brand)} ana sayfa"><img src="/assets/marka/logo.svg" width="116" height="50" alt="${esc(cfg.brand)} logo"></a>
    <nav class="nav" aria-label="Ana menü">
      <a href="/tel-cit/">Tel Çit</a><a href="/panel-cit/">Panel Çit</a><a href="/cim-cit/">Çim Çit</a><a href="/solar-aydinlatma/">Solar</a><a href="/peyzaj/">Peyzaj</a><a href="/bolgeler/">Bölgeler</a><a href="/iletisim/">İletişim</a>
    </nav>
    <a class="btn btn-wa btn-sm" data-ev="whatsapp" href="${waLink('Merhaba, web sitenizden ulaşıyorum. Fiyat teklifi almak istiyorum.')}" target="_blank" rel="noopener" aria-label="WhatsApp’tan yazın">${icon('wa')}<span>WhatsApp</span></a>
    <details class="mnav">
      <summary aria-label="Menüyü aç"><span class="burger" aria-hidden="true"><i></i><i></i><i></i></span><span class="mnav-t">Menü</span></summary>
      <nav class="mnav-panel" aria-label="Mobil menü">
        <p class="mnav-h">Hizmetler</p>
        <ul>${services.map((s) => `<li><a href="${svcUrl(s)}">${icon(s.icon)}<span>${esc(s.name)}</span></a></li>`).join('')}</ul>
        <p class="mnav-h">Bölgeler</p>
        <ul class="mnav-2">${districts.map((d) => `<li><a href="${d.hub}">${esc(d.name)}</a></li>`).join('')}<li><a href="/bolgeler/">Tüm köyler</a></li></ul>
        <div class="mnav-cta">
          <a class="btn btn-wa" data-ev="whatsapp" href="${waLink('Merhaba, web sitenizden ulaşıyorum. Fiyat teklifi almak istiyorum.')}" target="_blank" rel="noopener">${icon('wa')}<span>WhatsApp’tan Yaz</span></a>
          <a class="btn btn-call" data-ev="call" href="${telLink}">${icon('phone')}<span>${esc(cfg.phoneDisplay)}</span></a>
        </div>
      </nav>
    </details>
  </div>
</header>`;
}

function footer() {
  return `<footer class="foot">
  <div class="wrap foot-grid">
    <div>
      <p class="logo"><img src="/assets/marka/logo-acik.svg" width="130" height="56" alt="${esc(cfg.brand)}" loading="lazy"></p>
      <p>${esc(cfg.slogan)}. Silivri merkezli ekibimizle İstanbul’un batısı ve Tekirdağ’da hizmet veriyoruz.</p>
      <p><a href="${telLink}" data-ev="call">${icon('phone')} ${esc(cfg.phoneDisplay)}</a><br><a href="${waLink('Merhaba, fiyat teklifi almak istiyorum.')}" data-ev="whatsapp" target="_blank" rel="noopener">${icon('wa')} WhatsApp’tan yazın</a><br>${esc(cfg.openingHoursText)}</p>
    </div>
    <div>
      <p class="foot-h">Hizmetler</p>
      <ul>${services.map((s) => `<li><a href="${svcUrl(s)}">${esc(s.name)}</a></li>`).join('')}</ul>
    </div>
    <div>
      <p class="foot-h">Bölgeler</p>
      <ul>${districts.map((d) => `<li><a href="${d.hub}">${esc(d.name)} Tel Çit</a></li>`).join('')}<li><a href="/bolgeler/">Tüm köy ve mahalleler</a></li></ul>
    </div>
  </div>
  <div class="wrap foot-bottom"><span>© ${YEAR} ${esc(cfg.brand)} · bahartelcit.com</span><a href="/gizlilik/">Gizlilik ve KVKK</a></div>
</footer>
<div class="sticky" role="complementary" aria-label="Hızlı iletişim">
  <a class="btn btn-call" href="${telLink}" data-ev="call">${icon('phone')}<span>Hemen Ara</span></a>
  <a class="btn btn-wa" href="${waLink('Merhaba, web sitenizden ulaşıyorum. Fiyat teklifi almak istiyorum.')}" data-ev="whatsapp" target="_blank" rel="noopener">${icon('wa')}<span>WhatsApp</span></a>
</div>`;
}

function breadcrumbs(crumbs) {
  return `<nav class="crumbs wrap" aria-label="Sayfa yolu"><ol>${crumbs
    .map(([n, u], i) => (i < crumbs.length - 1 ? `<li><a href="${u}">${esc(n)}</a></li>` : `<li aria-current="page">${esc(n)}</li>`))
    .join('')}</ol></nav>`;
}

// Talep formu: gönderilince mesaj hazır şekilde WhatsApp açılır (sunucu gerekmez).
function leadForm({ place = '', service = '' } = {}) {
  return `<form class="leadform" id="teklif" data-lead novalidate>
  <p class="lead-h">Ücretsiz keşif ve fiyat alın</p>
  <p class="lead-sub">Formu doldurun, butona basın. WhatsApp mesajınız hazır açılır, sadece <b>Gönder</b>’e basın.</p>
  <label>Adınız<input name="ad" autocomplete="name" enterkeyhint="next" placeholder="Örn. Ahmet Yılmaz"></label>
  <label>Arsanızın yeri (ilçe / köy)<input name="bolge" list="bolgeler" autocomplete="address-level2" enterkeyhint="next" value="${esc(place)}" placeholder="Örn. Silivri Ortaköy" required></label>
  <div class="frow"><label>Hizmet<select name="hizmet">${services
    .map((s) => `<option${s.name === service ? ' selected' : ''}>${esc(s.name)}</option>`)
    .join('')}<option${service ? '' : ''}>Henüz karar vermedim</option></select></label>
  <label>Uzunluk (metre)<input name="metre" inputmode="numeric" placeholder="Örn. 250"></label></div>
  <label>Not <small>isteğe bağlı</small><textarea name="not" rows="2" placeholder="Örn. 2 metre yükseklik, araç kapısı olsun"></textarea></label>
  <button class="btn btn-wa btn-lg" type="submit">${icon('wa')}<span>WhatsApp’tan Teklif İste</span></button>
  <p class="lead-or">ya da hemen arayın: <a href="${telLink}" data-ev="call">${esc(cfg.phoneDisplay)}</a></p>
</form>`;
}

const datalist = `<datalist id="bolgeler">${allPlaceNames.map((n) => `<option value="${esc(n)}">`).join('')}</datalist>`;

function cta(place, service) {
  const msg = `Merhaba, ${place ? place + ' için ' : ''}${service ? lower(service) + ' ' : ''}fiyat teklifi almak istiyorum.`;
  return `<div class="cta-row">
  <a class="btn btn-wa btn-lg" href="${waLink(msg)}" data-ev="whatsapp" target="_blank" rel="noopener">${icon('wa')}<span>WhatsApp’tan Fiyat Al</span></a>
  <a class="btn btn-call btn-lg" href="${telLink}" data-ev="call">${icon('phone')}<span>Hemen Ara</span></a>
</div>`;
}

const steps = `<section class="band"><div class="wrap">
  <h2>Nasıl çalışıyoruz?</h2>
  <ol class="steps">
    <li><b>1. WhatsApp’tan yazın</b><span>Konumunuzu ve yaklaşık metreyi gönderin. Fotoğraf atarsanız daha da hızlı olur.</span></li>
    <li><b>2. Ücretsiz keşif</b><span>Gerekirse yerinde ölçü alıyoruz. Keşif ve ölçü için ücret almıyoruz.</span></li>
    <li><b>3. Net fiyat</b><span>Malzeme ve işçilik dahil, sürprizsiz fiyatı WhatsApp’tan yazılı gönderiyoruz.</span></li>
    <li><b>4. Montaj ve teslim</b><span>Kararlaştırılan günde ekibimiz gelir, işi bitirip temiz teslim eder.</span></li>
  </ol>
</div></section>`;

const why = `<ul class="why">
  <li>${icon('check')}<span><b>Ücretsiz keşif ve ölçü</b> – yerinde ya da konum üzerinden</span></li>
  <li>${icon('check')}<span><b>Malzeme + işçilik tek fiyat</b> – sonradan ek ücret yok</span></li>
  <li>${icon('check')}<span><b>Kendi ekibimiz</b> – taşeron değil, işi biz yapıyoruz</span></li>
  <li>${icon('check')}<span><b>Hızlı montaj</b> – çoğu arsa 1–2 günde biter</span></li>
  <li>${icon('check')}<span><b>WhatsApp ile kolay iletişim</b> – teknolojiyle aranız iyi olmasa da sadece bir mesaj yeter</span></li>
</ul>`;

function faqBlock(faq) {
  return `<section class="wrap faq"><h2>Sık sorulan sorular</h2>${faq
    .map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`)
    .join('')}</section>`;
}

function serviceCards(linkFor, labelFor) {
  return `<div class="cards">${services
    .map(
      (s) => `<a class="card" href="${linkFor(s)}">${icon(s.icon)}<b>${esc(labelFor(s))}</b><span>${esc(s.short)}</span></a>`
    )
    .join('')}</div>`;
}

const pills = (items) => `<ul class="pills">${items.map(([n, u]) => `<li><a href="${u}">${esc(n)}</a></li>`).join('')}</ul>`;

// ---------- fotoğraflar ----------
function img(ph, { eager = false, sizes = '(min-width: 900px) 360px, 50vw' } = {}) {
  const h = Math.round(480 / ph.ratio);
  return `<img src="/assets/foto/${ph.file}-480.webp" srcset="/assets/foto/${ph.file}-480.webp 480w, /assets/foto/${ph.file}-960.webp 960w" sizes="${sizes}" width="480" height="${h}" alt="${esc(ph.caption)} – ${esc(cfg.brand)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
}
const photosFor = (slug) => (slug ? [...photos.filter((p) => p.services.includes(slug)), ...photos.filter((p) => !p.services.includes(slug))] : photos);
function gallery(serviceSlug, heading = 'Yaptığımız işlerden örnekler') {
  return `<section class="wrap"><h2>${esc(heading)}</h2><div class="gallery">${photosFor(serviceSlug)
    .map((ph) => `<figure>${img(ph)}<figcaption>${esc(ph.caption)}</figcaption></figure>`)
    .join('')}</div><p class="muted">Sizin arsanız için de benzer bir çözüm ister misiniz? <a href="#teklif">Formu doldurun</a> ya da WhatsApp’tan fotoğraf gönderin.</p></section>`;
}

// ---------- sayfa iskeleti ----------
const pages = [];
function page({ url, title, desc, crumbs, schema = [], body, ctx = {}, noindex = false, priority = 0.6 }) {
  const canonical = SITE + url;
  const html = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
${cfg.searchConsoleVerification ? `<meta name="google-site-verification" content="${esc(cfg.searchConsoleVerification)}">` : ''}
<meta name="geo.region" content="TR-34">
<meta property="og:type" content="website">
<meta property="og:locale" content="tr_TR">
<meta property="og:site_name" content="${esc(cfg.brand)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE}/assets/og.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(cfg.brand)}: tel çit, panel çit, çim çit ve arsa çevirme">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${SITE}/assets/og.jpg">
<meta name="author" content="${esc(cfg.brand)}">
<meta name="geo.placename" content="${esc(cfg.address.locality)}, ${esc(cfg.address.region)}">
<meta name="format-detection" content="telephone=yes">
<meta name="theme-color" content="#1f6b3a">
<link rel="alternate" hreflang="tr" href="${canonical}">
<link rel="alternate" hreflang="x-default" href="${canonical}">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="stylesheet" href="/assets/style.css?v=${ASSET_V.css}">
${trackingHead()}
${[businessSchema(), ...(url === '/' ? [websiteSchema()] : []), ...schema, ...(crumbs ? [crumbSchema(crumbs)] : [])]
  .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
  .join('\n')}
<script>window.BTC=${JSON.stringify({ wa: cfg.whatsapp, ads: cfg.googleAdsId, labels: cfg.googleAdsLabels, page: ctx.place || '' })}</script>
</head>
<body>
${header()}
${crumbs ? breadcrumbs(crumbs) : ''}
<main>
${body}
</main>
${footer()}
${datalist}
<script src="/assets/app.js?v=${ASSET_V.js}" defer></script>
</body>
</html>
`;
  pages.push({ url, noindex, priority });
  const file = url === '/' ? 'index.html' : url.endsWith('/') ? url.slice(1) + 'index.html' : url.slice(1);
  const out = path.join(OUT, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}

function hero({ h1, lead, place, service }) {
  return `<section class="hero"><div class="wrap hero-grid">
  <div class="hero-txt">
    <h1>${esc(h1)}</h1>
    <p class="lead">${lead}</p>
    ${cta(place, service)}
    <ul class="badges"><li>${icon('check')} Ücretsiz keşif</li><li>${icon('check')} Aynı gün fiyat</li><li>${icon('check')} Malzeme + işçilik dahil</li></ul>
    <div class="hero-pics">${photosFor(svcSlugByName[service] || '').slice(0, 3).map((ph) => img(ph, { sizes: '(min-width: 900px) 200px, 33vw' })).join('')}</div>
  </div>
  ${leadForm({ place, service })}
</div></section>`;
}

// ---------- içerik metin bankaları (sayfalar birbirinin kopyası olmasın) ----------
const openers = [
  (p) => `${p.locText} arsanızın, bahçenizin veya tarlanızın etrafını tel çit, panel çit ya da çim çit ile çeviriyoruz.`,
  (p) => `${p.full} bölgesinde arsa çevirme, tel çit çekimi ve bahçe düzenleme işlerini anahtar teslim yapıyoruz.`,
  (p) => `${p.full} için tel çit, panel çit, çim çit ve solar aydınlatma işlerinde ücretsiz keşif yapıp aynı gün fiyat veriyoruz.`,
  (p) => `${p.locText} yeni arsa aldıysanız ya da eski çitinizi yenilemek istiyorsanız doğru yerdesiniz.`
];
const middles = [
  (p, t) => `Bölgede en çok ${t[0]} ve ${t[1]} çevirme işleri yapıyoruz; ihtiyaca göre ekonomik tel çitten şık panel çite kadar her bütçeye uygun çözüm sunuyoruz.`,
  (p, t) => `${p.shortLoc} özellikle ${t[1]}, ${t[2]} ve ${t[3]} sahiplerinden talep alıyoruz. Malzemeyi biz getiriyor, direkleri biz dikiyor, işi temiz teslim ediyoruz.`,
  (p, t) => `${p.district.name} ve çevresinde çalışan kendi ekibimizle ${t[0]}, ${t[2]} ve ${t[3]} gibi her tür arazide çit kuruyoruz.`
];
const closers = [
  () => `Konumunuzu ve yaklaşık metreyi WhatsApp’tan gönderin, net fiyatı hemen yazalım.`,
  () => `Tek bir WhatsApp mesajı yeterli: konum atın, ölçüyü biz alalım, fiyatı yazılı gönderelim.`,
  () => `Aşağıdaki butona basın, mesajınız hazır gelsin; size en kısa sürede dönüş yapalım.`
];

// ---------- 1) Ana sayfa ----------
page({
  url: '/',
  title: 'Tel Çit, Panel Çit, Çim Çit | Silivri, Çatalca, Tekirdağ',
  desc: 'Silivri, Çatalca, Beylikdüzü, Büyükçekmece, Celaliye ve Tekirdağ’da tel çit, panel çit, çim çit, arsa çevirme, solar aydınlatma ve peyzaj. Ücretsiz keşif, WhatsApp’tan anında fiyat.',
  priority: 1.0,
  body: `${hero({
    h1: 'Tel Çit, Panel Çit ve Arsa Çevirme',
    lead: 'Silivri, Çatalca, Beylikdüzü, Büyükçekmece, Celaliye ve Tekirdağ’da arsanızın etrafını <b>tel çit, panel çit ve çim çit</b> ile çeviriyoruz. Bahçeniz için <b>solar aydınlatma ve peyzaj</b> da yapıyoruz. Ücretsiz keşif, WhatsApp’tan aynı gün fiyat.'
  })}
<section class="wrap"><h2>Hizmetlerimiz</h2>${serviceCards(svcUrl, (s) => s.name)}</section>
${gallery('')}
<section class="band"><div class="wrap two">
  <div><h2>Neden Bahar Tel Çit?</h2>${why}</div>
  <div><h2>Hizmet bölgelerimiz</h2><p>Silivri merkezli ekibimiz İstanbul’un batısında ve Tekirdağ’da her gün sahada. Köyünüzü veya mahallenizi seçin:</p>${pills(districts.map((d) => [d.name + ' Tel Çit', d.hub]))}
  <p class="muted">Popüler: ${places.filter((p) => ['Ortaköy', 'Selimpaşa', 'Celaliye', 'Kumburgaz', 'Gümüşyaka', 'Çanta', 'Binkılıç', 'Marmaraereğlisi', 'Çorlu', 'Kavaklı'].includes(p.name)).slice(0, 10).map((p) => `<a href="${p.url}">${esc(p.full)}</a>`).join(', ')} · <a href="/bolgeler/">tüm bölgeler</a></p></div>
</div></section>
${steps}
${faqBlock([...svc['tel-cit'].faq.slice(0, 2), ...svc['panel-cit'].faq.slice(0, 1), ...svc['solar-aydinlatma'].faq.slice(1, 2)])}`,
  schema: [faqSchema([...svc['tel-cit'].faq.slice(0, 2), ...svc['panel-cit'].faq.slice(0, 1), ...svc['solar-aydinlatma'].faq.slice(1, 2)])]
});

// ---------- 2) Hizmet sayfaları ----------
for (const s of services) {
  const crumbs = [['Ana Sayfa', '/'], [s.name, svcUrl(s)]];
  page({
    url: svcUrl(s),
    title: withBrand(`${s.name} | ${cap(s.keywords[1])} ve Montaj`),
    desc: `${s.short} Silivri, Çatalca, Beylikdüzü, Büyükçekmece ve Tekirdağ’da ücretsiz keşif, WhatsApp’tan aynı gün fiyat.`,
    crumbs,
    priority: 0.9,
    ctx: {},
    body: `${hero({ h1: s.slug === 'tel-cit' ? 'Tel Çit Çekimi ve Tel Örgü Montajı' : s.name, lead: esc(s.intro), service: s.name })}
<section class="wrap two">
  <div><h2>${esc(s.name)} hizmetimiz neleri kapsar?</h2><ul class="ticks">${s.details.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul></div>
  <div><h2>Neden bizi seçmelisiniz?</h2>${why}</div>
</section>
${gallery(s.slug, photos.some((p) => p.services.includes(s.slug)) ? `${s.name} uygulamalarımız` : 'Yaptığımız işlerden örnekler')}
<section class="band"><div class="wrap"><h2>${esc(s.name)} hizmet bölgeleri</h2>
  <p>${esc(s.name)} hizmetini aşağıdaki ilçelerde ve bu ilçelerin tüm köy ve mahallelerinde veriyoruz:</p>
  ${pills(districts.map((d) => [`${d.name} ${lower(s.name)}`, dsUrl(d, s)]))}
</div></section>
${steps}
${faqBlock(s.faq)}
<section class="wrap"><h2>Diğer hizmetlerimiz</h2>${pills(services.filter((x) => x !== s).map((x) => [x.name, svcUrl(x)]))}</section>`,
    schema: [serviceSchema(s.name, svcUrl(s), districts.map((d) => d.name), s.intro), faqSchema(s.faq)]
  });
}

// ---------- 3) İlçe sayfaları (ilçe + tel çit = merkez sayfa) ve ilçe × hizmet ----------
for (const d of districts) {
  for (const s of services) {
    const isHub = s.slug === 'tel-cit';
    const url = dsUrl(d, s);
    const label = `${d.name} ${s.name}`;
    const crumbs = isHub
      ? [['Ana Sayfa', '/'], ['Bölgeler', '/bolgeler/'], [`${d.name} Tel Çit`, url]]
      : [['Ana Sayfa', '/'], ['Bölgeler', '/bolgeler/'], [`${d.name} Tel Çit`, d.hub], [label, url]];
    const faq = [
      [`${d.locText} ${lower(s.name)} fiyatları ne kadar?`, `${d.locText} ${lower(s.name)} fiyatı; metreye, yüksekliğe, malzeme tipine ve arazinin durumuna göre değişir. Konumunuzu ve yaklaşık ölçüyü WhatsApp’tan gönderin, aynı gün net fiyat yazalım.`],
      [`${d.name} dışındaki köylere de geliyor musunuz?`, `Evet. ${d.name} merkez dahil tüm köy ve mahallelerde, ayrıca komşu ilçelerde de çalışıyoruz. Keşif ücretsizdir.`],
      ...s.faq.slice(0, 2)
    ];
    const lead = isHub
      ? `${esc(d.locText)} <b>tel çit, panel çit, çim çit ve arsa çevirme</b> işlerini kendi ekibimizle yapıyoruz. Bahçeniz için <b>solar aydınlatma ve peyzaj</b> da yapıyoruz. ${esc(d.note)}`
      : `${esc(d.locText)} <b>${esc(lower(s.name))}</b> hizmeti veriyoruz. ${esc(s.short)} ${esc(d.note)}`;
    page({
      url,
      title: isHub
        ? withBrand(`${d.name} Tel Çit | Panel Çit, Çim Çit, Arsa Çevirme`)
        : withBrand(`${label} Fiyatları ve Montaj`),
      desc: isHub
        ? `${d.locText} tel çit, panel çit, çim çit, arsa çevirme, solar aydınlatma ve peyzaj. ${d.villages.slice(0, 4).join(', ')} ve tüm köylerde ücretsiz keşif, WhatsApp’tan fiyat.`
        : `${d.locText} ${lower(s.name)}: ${s.short} ${d.villages.slice(0, 3).join(', ')} dahil tüm köylerde ücretsiz keşif.`,
      crumbs,
      priority: isHub ? 0.9 : 0.7,
      ctx: { place: d.name },
      body: `${hero({ h1: isHub ? `${d.name} Tel Çit ve Arsa Çevirme` : label, lead, place: d.name, service: s.name })}
${isHub ? `<section class="wrap"><h2>${esc(d.locText)} verdiğimiz hizmetler</h2>${serviceCards((x) => dsUrl(d, x), (x) => `${d.name} ${x.name}`)}</section>` : `<section class="wrap two">
  <div><h2>${esc(d.locText)} ${esc(lower(s.name))} hizmetimiz</h2><p>${esc(s.intro)}</p><ul class="ticks">${s.details.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul></div>
  <div><h2>Neden Bahar Tel Çit?</h2>${why}</div>
</section>`}
<section class="band"><div class="wrap"><h2>${esc(d.name)} köy ve mahalleleri</h2>
  <p>${esc(d.locText)} şu köy ve mahallelerde ${esc(lower(s.name))} işi yapıyoruz. Bölgenizi seçin:</p>
  ${pills(d.places.map((p) => [`${p.name} ${lower(s.name)}`, p.url]))}
</div></section>
${gallery(isHub ? '' : s.slug)}
${isHub ? `<section class="wrap two"><div><h2>Neden Bahar Tel Çit?</h2>${why}</div><div><h2>Diğer bölgeler</h2>${pills(districts.filter((x) => x !== d).map((x) => [x.name + ' Tel Çit', x.hub]))}</div></section>` : `<section class="wrap"><h2>${esc(d.locText)} diğer hizmetlerimiz</h2>${pills(services.filter((x) => x !== s).map((x) => [`${d.name} ${x.name}`, dsUrl(d, x)]))}</section>`}
${steps}
${faqBlock(faq)}`,
      schema: [serviceSchema(label, url, [d.name, ...d.villages], `${d.locText} ${lower(s.name)}. ${s.short}`), faqSchema(faq)]
    });
  }
}

// ---------- 4) Köy / mahalle sayfaları ----------
for (const p of places) {
  const d = p.district;
  const seed = p.url;
  const t = d.landTypes;
  const intro = `${pick(openers, seed)(p)} ${pick(middles, seed, 1)(p, t)} ${pick(closers, seed, 2)()}`;
  const neighbours = d.places.filter((x) => x !== p);
  const start = hash(seed) % Math.max(neighbours.length, 1);
  const near = [...neighbours.slice(start), ...neighbours.slice(0, start)].slice(0, 12);
  const faq = [
    [`${p.locText} tel çit metre fiyatı ne kadar?`, `${p.locText} tel çit fiyatı; tel yüksekliği, direk tipi (beton veya demir), toplam metre ve arazinin eğimine göre değişir. Konumunuzu ve yaklaşık metreyi WhatsApp’tan gönderin, aynı gün net fiyat yazalım.`],
    [`${p.full} için keşif ücretli mi?`, `Hayır. ${p.locText} keşif ve ölçü tamamen ücretsizdir. İsterseniz konum ve fotoğraf göndererek yerinde keşif beklemeden de fiyat alabilirsiniz.`],
    [`${p.locText} panel çit ve çim çit de yapıyor musunuz?`, `Evet. ${p.locText} tel çitin yanı sıra panel çit, çim çit, dikenli ve jiletli tel, bahçe kapısı, solar aydınlatma ve peyzaj işlerini de yapıyoruz.`],
    [`Montaj ne kadar sürer?`, `Ortalama bir arsa 1–2 günde tamamlanır. ${d.name} bölgesinde her gün ekibimiz sahada olduğu için kısa sürede randevu veriyoruz.`]
  ];
  const crumbs = [['Ana Sayfa', '/'], ['Bölgeler', '/bolgeler/'], [`${d.name} Tel Çit`, d.hub], [`${p.full} Tel Çit`, p.url]];
  page({
    url: p.url,
    title: withBrand(`${p.full} Tel Çit | Panel Çit, Arsa Çevirme`),
    desc: `${p.locText} tel çit, panel çit, çim çit ve arsa çevirme. Solar aydınlatma ve peyzaj. Ücretsiz keşif, WhatsApp’tan aynı gün fiyat. ${d.name} bölgesinde her gün sahadayız.`,
    crumbs,
    priority: 0.6,
    ctx: { place: p.full },
    body: `${hero({ h1: `${p.full} Tel Çit ve Arsa Çevirme`, lead: esc(intro), place: p.full, service: 'Tel Çit' })}
<section class="wrap"><h2>${esc(p.locText)} yaptığımız işler</h2>${serviceCards((x) => dsUrl(d, x), (x) => `${p.name} ${lower(x.name)}`)}</section>
${gallery('tel-cit')}
<section class="band"><div class="wrap two">
  <div><h2>${esc(p.full)} için neden Bahar Tel Çit?</h2>${why}</div>
  <div><h2>${esc(d.name)} bölgesinde çalışıyoruz</h2><p>${esc(d.note)}</p><p>${icon('pin')} ${esc(p.full)} ve yakınındaki şu bölgelerde de hizmet veriyoruz:</p>${pills(near.map((x) => [x.full, x.url]))}<p><a href="${d.hub}">${esc(d.name)} tel çit sayfasına dön</a></p></div>
</div></section>
${steps}
${faqBlock(faq)}`,
    schema: [serviceSchema(`${p.full} Tel Çit`, p.url, p.full, intro), faqSchema(faq)]
  });
}

// ---------- 5) Bölgeler, iletişim, gizlilik, 404 ----------
page({
  url: '/bolgeler/',
  title: 'Hizmet Bölgelerimiz | Silivri, Çatalca, Büyükçekmece, Tekirdağ Tel Çit',
  desc: 'Tel çit, panel çit ve çim çit hizmeti verdiğimiz tüm ilçe, köy ve mahalleler: Silivri, Çatalca, Beylikdüzü, Büyükçekmece, Celaliye, Tekirdağ ve çevresi.',
  crumbs: [['Ana Sayfa', '/'], ['Bölgeler', '/bolgeler/']],
  priority: 0.8,
  body: `<section class="wrap page-head"><h1>Hizmet Bölgelerimiz</h1><p class="lead">Silivri merkezli ekibimizle aşağıdaki tüm ilçe, köy ve mahallelerde tel çit, panel çit, çim çit, solar aydınlatma ve peyzaj işleri yapıyoruz. Listede olmayan bir yerdeyseniz yine de yazın.</p>${cta('', '')}</section>
${districts
  .map(
    (d) => `<section class="wrap region"><h2><a href="${d.hub}">${esc(d.name)} Tel Çit</a></h2><p>${esc(d.note)}</p>${pills(d.places.map((p) => [p.full, p.url]))}</section>`
  )
  .join('')}`
});

page({
  url: '/hizmetler/',
  title: 'Hizmetlerimiz | Tel Çit, Panel Çit, Çim Çit, Solar ve Peyzaj',
  desc: 'Bahar Tel Çit hizmetleri: tel çit, panel çit, çim çit, arsa çevirme, dikenli ve jiletli tel, bahçe kapısı, solar bahçe aydınlatma ve peyzaj. Ücretsiz keşif, WhatsApp’tan fiyat.',
  crumbs: [['Ana Sayfa', '/'], ['Hizmetler', '/hizmetler/']],
  priority: 0.8,
  body: `<section class="wrap page-head"><h1>Hizmetlerimiz</h1><p class="lead">Silivri, Çatalca, Beylikdüzü, Büyükçekmece, Celaliye ve Tekirdağ’da arsa, bahçe ve iş yerleri için çit, güvenlik, aydınlatma ve peyzaj işlerini anahtar teslim yapıyoruz.</p>${cta('', '')}</section>
<section class="wrap">${serviceCards(svcUrl, (s) => s.name)}</section>
${gallery('')}
${steps}`
});

page({
  url: '/iletisim/',
  title: 'İletişim ve Fiyat Teklifi – Bahar Tel Çit',
  desc: 'Tel çit, panel çit, çim çit ve arsa çevirme için WhatsApp’tan yazın veya arayın. Ücretsiz keşif, aynı gün fiyat.',
  crumbs: [['Ana Sayfa', '/'], ['İletişim', '/iletisim/']],
  priority: 0.7,
  body: `${hero({ h1: 'İletişim ve Ücretsiz Fiyat Teklifi', lead: `En hızlı yol WhatsApp: konumunuzu ve yaklaşık metreyi gönderin, fiyatı yazılı iletelim. Telefon: <a href="${telLink}" data-ev="call">${esc(cfg.phoneDisplay)}</a> · ${esc(cfg.openingHoursText)}` })}
<section class="wrap two"><div><h2>Çalışma bölgelerimiz</h2>${pills(districts.map((d) => [d.name, d.hub]))}</div><div><h2>Adres</h2><p>${esc([cfg.address.street, cfg.address.locality, cfg.address.region].filter(Boolean).join(', '))}</p>${cfg.googleMapsUrl ? `<p><a href="${esc(cfg.googleMapsUrl)}" target="_blank" rel="noopener">${icon('pin')} Google Haritalar’da yol tarifi</a></p>` : ''}</div></section>`
});

page({
  url: '/gizlilik/',
  title: 'Gizlilik ve KVKK Aydınlatma Metni – Bahar Tel Çit',
  desc: 'Bahar Tel Çit gizlilik politikası ve KVKK aydınlatma metni.',
  crumbs: [['Ana Sayfa', '/'], ['Gizlilik', '/gizlilik/']],
  priority: 0.2,
  body: `<section class="wrap page-head prose"><h1>Gizlilik ve KVKK Aydınlatma Metni</h1>
<p>Bu sitedeki teklif formu bilgilerinizi bir sunucuya kaydetmez. Formu gönderdiğinizde yazdıklarınız yalnızca sizin cihazınızda WhatsApp mesajı olarak hazırlanır; mesajı gönderip göndermemek size aittir.</p>
<p>WhatsApp veya telefon ile bize ilettiğiniz ad, telefon numarası ve konum bilgileri yalnızca keşif, fiyat teklifi ve hizmetin yerine getirilmesi amacıyla, 6698 sayılı Kişisel Verilerin Korunması Kanunu’na uygun olarak işlenir ve üçüncü kişilerle reklam amacıyla paylaşılmaz.</p>
<p>Sitemizde reklam ölçümü için Google Ads ve Google Analytics çerezleri kullanılabilir. Tarayıcı ayarlarınızdan çerezleri dilediğiniz zaman silebilir veya engelleyebilirsiniz.</p>
<p>Verilerinizle ilgili talepleriniz için bize WhatsApp veya telefonla ulaşabilirsiniz.</p></section>`
});

page({
  url: '/404.html',
  title: 'Sayfa bulunamadı – Bahar Tel Çit',
  desc: 'Aradığınız sayfa bulunamadı.',
  noindex: true,
  body: `<section class="wrap page-head"><h1>Sayfa bulunamadı</h1><p class="lead">Aradığınız sayfa taşınmış olabilir. Ana sayfaya dönebilir veya doğrudan WhatsApp’tan yazabilirsiniz.</p>${cta('', '')}<p><a href="/">Ana sayfa</a> · <a href="/bolgeler/">Bölgeler</a></p></section>`
});

// ---------- sitemap, robots, llms.txt, statik dosyalar ----------
const imgTags = photos
  .map((p) => `<image:image><image:loc>${SITE}/assets/foto/${p.file}-960.webp</image:loc></image:image>`)
  .join('');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .filter((p) => !p.noindex)
  .map((p) => `  <url><loc>${SITE}${p.url}</loc><lastmod>${TODAY}</lastmod><priority>${p.priority.toFixed(1)}</priority>${p.url === '/' || services.some((s) => svcUrl(s) === p.url) ? imgTags : ''}</url>`)
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemap);

// Arama motorları ve yapay zekâ botları için açık izin
const bots = ['Googlebot', 'Bingbot', 'YandexBot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot', 'Applebot-Extended', 'CCBot', 'Meta-ExternalAgent', 'Bytespider', 'Amazonbot', 'DuckAssistBot', 'MistralAI-User'];
fs.writeFileSync(
  path.join(OUT, 'robots.txt'),
  `# ${cfg.brand} - ${SITE}\n# Yapay zekâ özeti: ${SITE}/llms.txt\n\nUser-agent: *\nAllow: /\nDisallow: /404.html\n\n${bots.map((b) => `User-agent: ${b}\nAllow: /`).join('\n\n')}\n\nSitemap: ${SITE}/sitemap.xml\n`
);

// llms.txt (https://llmstxt.org) ve tüm içerik için llms-full.txt
const contact = `- WhatsApp: https://wa.me/${cfg.whatsapp}\n- Telefon: ${cfg.phoneDisplay} (${cfg.phone})\n- Çalışma saatleri: ${cfg.openingHoursText}\n- Merkez: ${cfg.address.locality}, ${cfg.address.region}`;
const llms = `# ${cfg.brand}

> ${cfg.description} Ücretsiz keşif yapılır, fiyat WhatsApp üzerinden aynı gün verilir. Malzeme ve işçilik dahil anahtar teslim çalışılır.

## İletişim
${contact}

## Hizmetler
${services.map((s) => `- [${s.name}](${SITE}${svcUrl(s)}): ${s.short}`).join('\n')}

## Hizmet bölgeleri
${districts.map((d) => `- [${d.name} Tel Çit](${SITE}${d.hub}): ${d.villages.join(', ')}`).join('\n')}

## Sayfalar
- [Ana sayfa](${SITE}/)
- [Tüm bölgeler](${SITE}/bolgeler/)
- [İletişim ve fiyat teklifi](${SITE}/iletisim/)

## Optional
- [Tüm içerik (llms-full.txt)](${SITE}/llms-full.txt)
- [Site haritası](${SITE}/sitemap.xml)
`;
fs.writeFileSync(path.join(OUT, 'llms.txt'), llms);
const full = `# ${cfg.brand}: tüm içerik

> ${cfg.description}

## İletişim
${contact}

${services
  .map(
    (s) => `## ${s.name}
Sayfa: ${SITE}${svcUrl(s)}

${s.intro}

Kapsam:
${s.details.map((x) => `- ${x}`).join('\n')}

Sık sorulan sorular:
${s.faq.map(([q, a]) => `- S: ${q}\n  C: ${a}`).join('\n')}
`
  )
  .join('\n')}
## Bölgeler
${districts
  .map(
    (d) => `### ${d.name} (${d.city})
${d.note}
Sayfa: ${SITE}${d.hub}
İlçe sayfaları: ${services.filter((s) => s.slug !== 'tel-cit').map((s) => `${SITE}${dsUrl(d, s)}`).join(', ')}
Köy ve mahalleler: ${d.places.map((p) => `${p.full} (${SITE}${p.url})`).join(', ')}
`
  )
  .join('\n')}`;
fs.writeFileSync(path.join(OUT, 'llms-full.txt'), full);

// PWA manifest, IndexNow anahtarı, ikonlar
fs.writeFileSync(
  path.join(OUT, 'site.webmanifest'),
  JSON.stringify({
    name: cfg.brand, short_name: cfg.brand, lang: 'tr', start_url: '/', display: 'standalone',
    background_color: '#ffffff', theme_color: '#1f6b3a',
    icons: [
      { src: '/assets/marka/ikon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/assets/marka/ikon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/assets/marka/ikon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  }, null, 2)
);
if (cfg.indexNowKey) fs.writeFileSync(path.join(OUT, `${cfg.indexNowKey}.txt`), cfg.indexNowKey);
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
fs.cpSync(path.join(ROOT, 'assets'), path.join(OUT, 'assets'), { recursive: true });
fs.renameSync(path.join(OUT, 'assets', 'favicon.ico'), path.join(OUT, 'favicon.ico'));
fs.copyFileSync(path.join(ROOT, 'assets', 'marka', 'favicon.svg'), path.join(OUT, 'favicon.svg'));
fs.copyFileSync(path.join(ROOT, 'assets', 'marka', 'ikon-180.png'), path.join(OUT, 'apple-touch-icon.png'));
// Netlify / Cloudflare Pages için önbellek başlıkları
fs.writeFileSync(path.join(OUT, '_headers'), `/assets/*\n  Cache-Control: public, max-age=604800\n`);

// Eski siteden Google'da kalan köy × hizmet adreslerini (ör. /catalca-gokceali-panel-cit)
// yeni köy sayfasına, tanınmayanları hizmet sayfasına 301 ile yönlendiren Nginx kuralları.
// Var olan sayfalar try_files ile önce sunulur, kurallar onlara dokunmaz.
{
  const svcAlt = services.map((s) => s.slug).join('|');
  const pre = '(?:hizmetler/|hizmet/|bolge/|bolgeler/)?';
  const seen = new Set();
  const lines = ['# Bu dosya kaynak/build.mjs tarafından üretilir, elle düzenlemeyin.'];
  for (const p of places) {
    const vs = slugify(p.name);
    const d = p.district.slug;
    // Aynı adlı köy birden fazla ilçede varsa ilçesiz adres ilk ilçeye gider
    const bare = seen.has(vs) ? '' : '?';
    seen.add(vs);
    lines.push(`location ~* ^/${pre}(?:${d}-)${bare}${vs}(?:-[a-z-]+)?(?:\\.html|\\.php)?/?$ { set $eski_hedef ${p.url}; try_files $uri $uri/ @eski_adres; }`);
  }
  lines.push(`location ~* ^/${pre}(?:[a-z0-9-]+-)?(?<eski_hz>${svcAlt})(?:\\.html|\\.php)?/?$ { set $eski_hedef /$eski_hz/; try_files $uri $uri/ @eski_adres; }`);
  lines.push('location @eski_adres { return 301 $eski_hedef; }');
  fs.writeFileSync(path.resolve(ROOT, '..', 'sunucu', 'eski-adresler.conf'), lines.join('\n') + '\n');
}

console.log(`${pages.length} sayfa üretildi -> ${OUT}`);
