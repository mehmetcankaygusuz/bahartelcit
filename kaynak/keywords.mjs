// Google Ads Editor'a aktarılabilir anahtar kelime listesi üretir -> ../google-ads-anahtar-kelimeler.csv
import fs from 'node:fs';
import { services, districts } from './data.mjs';
const lower = (s) => s.toLocaleLowerCase('tr');
const rows = [['Campaign', 'Ad group', 'Keyword', 'Criterion Type', 'Final URL']];
const site = 'https://bahartelcit.com';
const slug = (s) => lower(s).replace(/ç/g,'c').replace(/ğ/g,'g').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ş/g,'s').replace(/ü/g,'u').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const main = ['tel-cit', 'panel-cit', 'cim-cit', 'arsa-cevirme'];
for (const d of districts) {
  for (const s of services.filter((x) => main.includes(x.slug))) {
    const url = s.slug === 'tel-cit' ? `${site}/${d.slug}-tel-cit/` : `${site}/${d.slug}-${s.slug}/`;
    const ag = `${d.name} ${s.name}`;
    const base = lower(s.name);
    for (const k of [`${lower(d.name)} ${base}`, `${base} ${lower(d.name)}`, `${lower(d.name)} ${base} fiyatları`, `${lower(d.name)} ${base} ustası`])
      rows.push(['Arama - Çit - ' + d.name, ag, k, 'Phrase', url]);
    rows.push(['Arama - Çit - ' + d.name, ag, `${lower(d.name)} ${base}`, 'Exact', url]);
  }
  for (const v of d.villages) {
    const url = `${site}/${d.prefix ? d.slug + '-' : ''}${slug(v)}-tel-cit/`;
    const ag = `${d.name} Köyler`;
    rows.push(['Arama - Çit - ' + d.name, ag, `${lower(v)} tel çit`, 'Phrase', url]);
    if (d.prefix) rows.push(['Arama - Çit - ' + d.name, ag, `${lower(d.name)} ${lower(v)} tel çit`, 'Phrase', url]);
    rows.push(['Arama - Çit - ' + d.name, ag, `${lower(v)} arsa çevirme`, 'Phrase', url]);
  }
}
for (const s of services.filter((x) => !main.includes(x.slug)))
  for (const k of s.keywords) rows.push(['Arama - Bahçe ve Ek Hizmetler', s.name, k, 'Phrase', `${site}/${s.slug}/`]);
const neg = ['iş ilanı','iş ilanları','eleman','maaş','nasıl yapılır','kendin yap','diy','ikinci el','sahibinden','toptan','fabrikası','üretici','imalatçı','oyuncak','resim','png','çizim','minecraft','hurda','kiralık','pdf','tez','tanımı','ne demek'];
for (const n of neg) rows.push(['', '', n, 'Campaign Negative Phrase', '']);
const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
fs.writeFileSync(new URL('../google-ads-anahtar-kelimeler.csv', import.meta.url), '﻿' + csv + '\n');
console.log(rows.length - 1, 'satır');
