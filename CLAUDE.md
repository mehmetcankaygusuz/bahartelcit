# CLAUDE.md: bahartelcit.com proje kuralları

## Proje
- İşletme: **Bahar Tel Çit**. Hizmetler: tel çit, panel çit, çim çit, arsa çevirme, dikenli/jiletli tel, bahçe kapısı, solar bahçe aydınlatma, peyzaj.
- Bölgeler: Silivri, Çatalca, Beylikdüzü, Büyükçekmece (Celaliye dahil), Tekirdağ ve bunların köy/mahalleleri.
- Amaç: Google Ads ve Google Haritalar'dan müşteri çekmek. Her talep **WhatsApp**'a düşmeli. Müşteriler teknolojiye yatkın değil, bu yüzden en fazla tek tıkla ulaşabilmeli.

## Çalışma kuralları
1. Tüm site metni, dosya adları (mümkünse) ve kullanıcıyla iletişim **Türkçe** olur.
2. Kaynak depo: GitHub `mehmetcankaygusuz/bahartelcit`. Bilgisayardaki çalışma kopyası `Belgeler/bahartelcit` klasöründe durur. Proje dosyaları bu depo dışında oluşturulmaz.
3. Site **statiktir**: sunucu, veritabanı ve form backend'i yoktur. Formlar `wa.me` bağlantısıyla hazır WhatsApp mesajı açar.
4. İşletme bilgileri (WhatsApp, telefon, adres, saatler, Google Ads/GA4/Search Console kodları) **yalnızca `kaynak/config.json`** içinde tutulur. Başka yere elle yazılmaz.
5. Hizmet ve köy listesi **yalnızca `kaynak/data.mjs`** içindedir. Yeni köy veya hizmet buraya eklenir.
6. `site/` klasörü üretilmiş çıktıdır, elle düzenlenmez. Her değişiklikten sonra `cd kaynak && node build.mjs` çalıştırılır. Anahtar kelime listesi `node keywords.mjs` ile yenilenir.
7. Bilinmeyen bilgi uydurulmaz. Yer tutucu bırakılır ve kullanıcıdan istenir.
8. Yayına alma (hosting/DNS), Google Ads harcaması ve dışarıya mesaj gibi geri alınamaz adımlar kullanıcı onayı olmadan yapılmaz.

## SEO kuralları
- Her sayfanın **benzersiz** `<title>` (≤ 65 karakter hedef) ve meta açıklaması olmalı.
- URL yapısı: hizmet `/tel-cit/`, ilçe `/silivri-tel-cit/`, ilçe × hizmet `/silivri-panel-cit/`, köy `/silivri-ortakoy-tel-cit/` (Tekirdağ alt bölgelerinde ilçe öneki yok: `/corlu-tel-cit/`).
- Aynı anahtar kelimeyi iki sayfa hedeflemez (ilçe merkez sayfası "ilçe + tel çit" kelimesini tek başına hedefler).
- Her sayfada şunlar bulunur: H1, canonical, JSON-LD (işletme + hizmet + SSS + sayfa yolu), iç linkler (ilçe ↔ köy ↔ hizmet).
- Köy sayfaları birbirinin kopyası olmamalı. Metinler varyasyon bankasından ve ilçeye özel notlardan üretilir.
- Sayfalar hafif kalır: harici yazı tipi, ağır JS ve kütüphane kullanılmaz. Görseller sıkıştırılmış WebP olur.

## Dönüşüm (WhatsApp) kuralları
- Her sayfada şunlar bulunur: üst menüde WhatsApp, hero'da "WhatsApp'tan Fiyat Al" ve "Hemen Ara", talep formu, mobilde altta sabit WhatsApp/Ara çubuğu.
- WhatsApp mesajları sayfanın bölgesini ve hizmetini önceden doldurur.
- Tıklamalar `data-ev="whatsapp|call"` ile işaretlenir. Form gönderimi `form` olayıdır. Google Ads etiketleri `config.json > googleAdsId` + `googleAdsLabels` içindedir (hesap 104-697-9762). Ek hesap gerekirse `googleAdsExtra` listesine eklenir; her tıklama hepsine gönderilir.

## Marka ve SEO dosyaları
- Logo: `kaynak/marka/logo.py` (işaret `mark.path`, yazı Poppins SemiBold yola çevrilmiş) -> `kaynak/assets/marka/` (logo.svg, logo-acik.svg, favicon.svg, ikon-*.png, logo.png). Favicon: `assets/favicon.ico`.
- OG görseli `assets/og.jpg` (1200x630) üzerinde telefon numarası yazılıdır; numara değişirse yeniden üretilmelidir.
- Build otomatik üretir: sitemap.xml (görselli), robots.txt (arama ve yapay zekâ botlarına izin), llms.txt, llms-full.txt, site.webmanifest, IndexNow anahtar dosyası (`config.json > indexNowKey`).
- Yayın (GitHub Actions) her seferinde IndexNow ile Bing/Yandex'e URL bildirir.

## Teslim kontrol listesi
- [ ] `node build.mjs` hatasız çalışıyor
- [ ] Başlıklarda kopya yok, sitemap güncel
- [ ] Mobilde yatay kaydırma yok, form WhatsApp mesajını doğru oluşturuyor
- [ ] `config.json` içinde yer tutucu (`X`) kalmadı (yayından önce)
