# bahartelcit.com

Bahar Tel Çit statik web sitesi: Silivri, Çatalca, Beylikdüzü, Büyükçekmece, Celaliye ve Tekirdağ için tel çit, panel çit, çim çit, arsa çevirme, solar aydınlatma ve peyzaj.

- `site/`: yayına alınan hazır site (Cloudflare Pages çıktı klasörü)
- `kaynak/`: site üreticisi. `config.json` işletme bilgilerini, `data.mjs` hizmet ve köy listesini içerir.
- `REHBER.md`: yayına alma, Google İşletme Profili ve Google Ads rehberi
- `google-ads-anahtar-kelimeler.csv`: Google Ads Editor için anahtar kelimeler

Güncelleme: `cd kaynak && node build.mjs && node keywords.mjs`
