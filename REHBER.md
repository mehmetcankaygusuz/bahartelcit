# Bahar Tel Çit: Site, Google Ads ve Google Haritalar Rehberi

## 1. Siteden neler var?

- **156 sayfa**, hepsi Türkçe, telefonda hızlı açılır (resim/yazı tipi yükü yok, sayfa başı ~28 KB).
- **Hizmet sayfaları (8):** Tel Çit, Panel Çit, Çim Çit, Arsa Çevirme, Dikenli ve Jiletli Tel, Bahçe ve Arsa Kapısı, Solar Bahçe Aydınlatma, Peyzaj.
- **İlçe sayfaları (5):** Silivri, Çatalca, Beylikdüzü, Büyükçekmece, Tekirdağ (ör. `/silivri-tel-cit/`).
- **İlçe × hizmet sayfaları (35):** ör. `/catalca-panel-cit/`, `/buyukcekmece-cim-cit/`, `/silivri-solar-aydinlatma/`.
- **Köy / mahalle sayfaları (103):** ör. `/silivri-ortakoy-tel-cit/`, `/silivri-selimpasa-tel-cit/`, `/buyukcekmece-celaliye-tel-cit/`, `/marmaraereglisi-tel-cit/`.
- Her sayfada: üstte ve altta **WhatsApp** ve **Hemen Ara** butonları, telefonda ekranın altında sabit duran WhatsApp/Ara çubuğu ve **talep formu**. Form gönderilince müşterinin WhatsApp'ı, "Ad / Yer / Hizmet / Metre / Not" yazılı hazır mesajla sizin numaranıza açılır. Müşterinin sadece **Gönder**'e basması yeterli.
- SEO: her sayfanın kendi başlığı ve açıklaması var. Ayrıca işletme, hizmet, SSS ve sayfa yolu için Google yapısal verisi (JSON-LD), `sitemap.xml`, `robots.txt`, canonical etiketleri ve iç linkler (ilçe ↔ köy ↔ hizmet) eklendi.

## 2. Bana göndermeniz gerekenler

1. ~~WhatsApp numarası~~ alındı: 0546 812 51 23 (siteye eklendi)
2. Arama için farklı bir numara kullanacaksanız **telefon numarası**
3. **Adres** (Google Haritalar'da görünecek olan adresle birebir aynı yazılmalı)
4. **Çalışma saatleri** (şu an "Her gün 08:00 - 20:00" yazıyor)
5. **İş fotoğrafları**: yaptığınız tel çit, panel çit ve çim çit işlerinden 10-20 fotoğraf. Fotoğraf, müşterinin güvenini en çok artıran şeydir.
6. Varsa Google İşletme Profili bağlantınız

Bunları gönderdiğinizde siteyi tek komutla güncelliyorum (`kaynak/config.json`).

## 3. Yayın (kuruldu)

Site, solimena.com.tr ile aynı sunucuda ayrı bir Nginx ayarıyla yayında: https://bahartelcit.com (SSL etkin, http otomatik https'e yönleniyor).
- Repoya (main) yapılan her değişiklik GitHub Actions ile sunucuya kendiliğinden yüklenir (`.github/workflows/yayinla.yml`).
- Sunucu bilgileri GitHub > Settings > Secrets içinde: `SSH_HOST`, `SSH_USER`, `SSH_PASSWORD` (isteğe bağlı `SSH_PORT`).
- Her yayının sonunda bahartelcit.com ve solimena.com.tr'nin açıldığı otomatik kontrol edilir; sonuç Actions sekmesinde görünür.

## 4. Google İşletme Profili (Google Haritalar)

Haritalarda "tel çit silivri" diye arayanlara çıkmanın yolu budur ve ücretsizdir.
1. business.google.com adresine girin ve işletme adını **Bahar Tel Çit** olarak yazın.
2. Kategori olarak ana kategoriye **"Çit yüklenicisi" (Fence contractor)**, ek kategorilere "Peyzaj tasarımcısı", "Bahçe düzenleme hizmeti" ve "Güneş enerjisi ekipmanı tedarikçisi" seçin.
3. Dükkânınız yoksa **"Müşterilerin konumuna giderim"** seçeneğini seçip adresi gizleyin. Hizmet bölgesi olarak Silivri, Çatalca, Beylikdüzü, Büyükçekmece, Çorlu, Çerkezköy, Marmaraereğlisi ve Tekirdağ'ı ekleyin.
4. Web sitesi alanına `https://bahartelcit.com`, telefon alanına WhatsApp numaranızı yazın. Mesajlaşma için WhatsApp'ı bağlayın.
5. Doğrulama: Google video veya posta ile doğrulama ister, bunu tamamlayın.
6. **Her hafta en az 3-5 iş fotoğrafı** ekleyin. Açıklamaya köy adını yazın, ör. "Silivri Ortaköy 300 metre tel çit".
7. **Yorum toplayın**: Her işin sonunda müşteriye WhatsApp'tan yorum bağlantısını gönderin. 20 ve üzeri yorum, haritada öne çıkmanın en etkili yoludur. Yorumlara mutlaka cevap verin.
8. Hizmetler bölümüne sitedeki 8 hizmeti ekleyin.

## 5. Google Ads kurulumu (önerilen başlangıç)

**Kampanya türü:** Arama (Search). İlk ay Performance Max kullanmayın, bütçeyi alakasız yerlere harcar.

- **Hedef konum:** Silivri, Çatalca, Büyükçekmece, Beylikdüzü, Esenyurt, Arnavutköy, Tekirdağ (Çorlu, Çerkezköy, Kapaklı, Marmaraereğlisi, Süleymanpaşa). Konum seçeneğinde **"Varlık: hedef konumdaki veya düzenli olarak bulunan kişiler"** ayarını seçin. Arsa sahipleri İstanbul'un merkezinde oturup Silivri'de arsa arıyor olabilir, bu yüzden ikinci bir kampanyada "ilgi gösteren kişiler" ayarını da deneyebilirsiniz.
- **Bütçe:** Günlük 300-500 TL ile başlayın, 2 hafta sonra hangi ilçe dönüş getiriyorsa ona kaydırın.
- **Teklif:** İlk 2 hafta "Tıklamaları en üst düzeye çıkar" (TBM üst sınırı koyun). 15-20 dönüşüm biriktikten sonra "Dönüşümleri en üst düzeye çıkar" ayarına geçin.
- **Anahtar kelimeler:** `google-ads-anahtar-kelimeler.csv` dosyasında 441 satır hazır. Dosya Google Ads Editor ile içe aktarılabilir. Her ilçe ayrı kampanya, her hizmet ayrı reklam grubu ve her köy için doğru açılış sayfası olarak ayarlandı. Negatif kelimeler (iş ilanı, ikinci el, nasıl yapılır vb.) de içinde.
- **Reklam metni örneği (Duyarlı Arama Reklamı):**
  - Başlıklar: `{KeyWord:Silivri Tel Çit}` · Ücretsiz Keşif, Aynı Gün Fiyat · Malzeme + İşçilik Dahil · WhatsApp'tan Hemen Fiyat Alın · Arsa Çevirme 1-2 Günde · Panel Çit, Çim Çit, Kapı · Silivri Merkezli Kendi Ekibimiz
  - Açıklamalar: "Arsanızı tel çit, panel çit veya çim çitle çeviriyoruz. Konum atın, fiyatı hemen yazalım." · "Silivri, Çatalca, Büyükçekmece ve Tekirdağ'da ücretsiz keşif. Solar aydınlatma ve peyzaj da yapıyoruz."
- **Öğeler (uzantılar):** Arama öğesi (telefon), **WhatsApp mesaj öğesi**, konum öğesi (İşletme Profili bağlanınca), site bağlantıları (Tel Çit, Panel Çit, Çim Çit, Solar Aydınlatma) ve açıklama metinleri (Ücretsiz Keşif, Aynı Gün Fiyat).
- **Reklam zamanlaması:** Gece 23:00-07:00 arasını kapatın ya da teklifi düşürün.

### Dönüşüm takibi (hangi reklam müşteri getiriyor?)

Site hazır, sadece kodları girmek gerekiyor:
1. Google Ads'te Hedefler bölümünden Dönüşümler'e girin ve yeni dönüşüm olarak "Web sitesi"ni seçin. Elle üç dönüşüm oluşturun: **WhatsApp tıklaması**, **Telefon tıklaması**, **Form gönderimi** (kategori: Potansiyel müşteri / İletişim).
2. Google size `AW-123456789` gibi bir kimlik ve her dönüşüm için bir **etiket** (ör. `AbC-dEfGhIj`) verir. Bunları bana gönderin, `config.json` içindeki `googleAdsId` ve `googleAdsLabels` alanlarına yazıp siteyi güncelliyorum. Kodlar o zaman otomatik olarak devreye girer.
3. Ayrıca Google Ads'te telefon öğesi için "Reklamdan gelen aramalar" dönüşümünü açın.

## 6. Google'da öne çıkmak için düzenli yapılacaklar

- Site yayına girince **Google Search Console**'a `bahartelcit.com` ekleyin ve `https://bahartelcit.com/sitemap.xml` adresini gönderin. Doğrulama kodunu bana iletirseniz siteye eklerim.
- İşletme Profili'ne her hafta fotoğraf ekleyin ve yorum toplayın (en etkili iki adım).
- Yeni bir köyde iş yaptığınızda bana köy adını yazın; o köy için sayfa ekleyeyim.
- Fotoğraflarınız geldiğinde her ilçe sayfasına "Bu bölgede yaptığımız işler" galerisi ekleyelim.
- Siteyi Facebook, Instagram ve sahibinden ilanlarınıza ekleyin. Gelen bağlantılar da sıralamaya yardımcı olur.

## 7. Dosyalar

- `site/`: yayına alınacak hazır site (bu klasörü yüklemeniz yeterli)
- `kaynak/`: site üreticisi. `config.json` işletme bilgilerini, `data.mjs` hizmetleri ve köy listesini içerir. Güncellemek için `node build.mjs` komutunu çalıştırın.
- `google-ads-anahtar-kelimeler.csv`: Google Ads Editor'a aktarılacak anahtar kelimeler
