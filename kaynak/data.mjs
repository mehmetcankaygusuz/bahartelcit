// Hizmetler ve bölgeler. Yeni köy/mahalle eklemek için ilgili ilçenin "villages" listesine ad yazıp
// "node build.mjs" çalıştırmak yeterli; sayfa, sitemap ve iç linkler otomatik oluşur.

export const services = [
  {
    slug: 'tel-cit',
    name: 'Tel Çit',
    icon: 'fence',
    short: 'Galvaniz kafes tel ve beton/demir direkle arsa, tarla ve bahçe çevirme.',
    keywords: ['tel çit', 'tel çit çekimi', 'tel örgü', 'kafes tel', 'galvaniz tel çit', 'beton direkli tel çit'],
    intro:
      'Tel çit, arsa ve tarla çevirmenin en ekonomik ve en hızlı yoludur. Galvaniz ya da PVC kaplı kafes teli beton veya demir direklere gerip, üstüne isteğe göre dikenli tel ekliyoruz. Malzemeyi biz getiriyor, direkleri biz dikiyor, işi temiz teslim ediyoruz.',
    details: [
      'Galvaniz ve yeşil PVC kaplı kafes tel (50, 100, 150, 200 cm yükseklik)',
      'Beton direk, demir boru direk veya ahşap direk seçenekleri',
      'Köşe ve gergi payandaları ile yıllarca sarkmayan gergin montaj',
      'İsteğe bağlı dikenli tel veya jiletli tel ile ek güvenlik',
      'Bahçe kapısı ve araç giriş kapısı montajı'
    ],
    faq: [
      ['Tel çit metre fiyatı neye göre değişir?', 'Fiyat; tel yüksekliğine, tel kalınlığına, direk tipine (beton, demir), direk aralığına, arazinin eğimine ve toplam metreye göre değişir. Arsanın konumunu ve yaklaşık metresini WhatsApp’tan gönderin, aynı gün net fiyat verelim.'],
      ['Tel çit montajı kaç günde biter?', 'Ortalama bir arsa (200–400 metre) genellikle 1–2 günde tamamlanır. Zemin kayalıksa veya beton dökülecekse süre biraz uzayabilir.'],
      ['Arsam tapuda hisseli, tel çit çekebilir miyim?', 'Hisseli arsalarda diğer hissedarların onayı ve kendi hissenizin sınırlarının bilinmesi gerekir. Sınırlar belliyse, ölçüye göre çiti sizin işaretlediğiniz noktalardan geçiriyoruz.']
    ]
  },
  {
    slug: 'panel-cit',
    name: 'Panel Çit',
    icon: 'panel',
    short: 'Elektrostatik boyalı 3D panel çit ile villa, site, fabrika ve bahçe çevirme.',
    keywords: ['panel çit', 'panel çit fiyatları', '3d panel çit', 'bahçe panel çit', 'galvaniz panel çit'],
    intro:
      'Panel çit, tel çitten daha sağlam ve daha şık bir görünüm ister misiniz sorusunun cevabıdır. Elektrostatik toz boyalı, galvaniz üzeri boyalı 3D panelleri profil direklere kelepçeyle bağlıyoruz. Villa, site, okul, fabrika ve depo çevresinde uzun ömürlü ve bakım istemeyen bir çözümdür.',
    details: [
      'Antrasit, yeşil ve beyaz renk seçenekleri',
      '100 cm’den 250 cm’e kadar panel yükseklikleri',
      'Profil direk, kelepçe ve dübel/beton ayak ile sağlam montaj',
      'Üstüne jiletli tel veya çim çit ile görüntü kesme seçeneği',
      'Uyumlu yaya ve araç kapısı imalatı'
    ],
    faq: [
      ['Panel çit mi tel çit mi tercih etmeliyim?', 'Geniş arazi ve tarla için tel çit daha ekonomiktir. Ev bahçesi, villa, site ve iş yeri gibi görünümün önemli olduğu yerlerde panel çit daha sağlam ve şıktır.'],
      ['Panel çit duvar üstüne yapılır mı?', 'Evet. Mevcut istinat duvarı veya bahçe duvarı üstüne direkleri dübelle sabitleyerek panel çit montajı yapıyoruz.'],
      ['Panel çit paslanır mı?', 'Kullandığımız paneller galvaniz üzeri elektrostatik boyalıdır, paslanmaya karşı uzun yıllar dayanıklıdır.']
    ]
  },
  {
    slug: 'cim-cit',
    name: 'Çim Çit',
    icon: 'grass',
    short: 'Yapay çim çit ile bahçenize gizlilik, yeşil görünüm ve rüzgar kesici.',
    keywords: ['çim çit', 'yapay çim çit', 'çim çit fiyatları', 'bahçe çim çit', 'çim çit paneli'],
    intro:
      'Çim çit (yapay çim çit), mevcut tel veya panel çitinizin üzerine takılarak bahçenizi dışarıdan görünmez hale getirir. Hem yeşil ve doğal bir görüntü verir hem de rüzgar ve tozu keser. Bakım, sulama ve budama gerektirmez.',
    details: [
      'Mevcut tel çit veya panel çit üzerine montaj',
      'Rulo yapay çim çit ve hazır çim çit paneli seçenekleri',
      'UV dayanımlı, solmayan malzeme',
      'Komşu ve yol tarafında tam görüntü kesme',
      'Balkon, teras ve havuz çevresi uygulamaları'
    ],
    faq: [
      ['Çim çit kaç yıl dayanır?', 'UV korumalı kaliteli çim çit, güneş altında uzun yıllar rengini korur. Ucuz malzemeler ise kısa sürede solar; biz UV dayanımlı ürün kullanıyoruz.'],
      ['Çim çit için mutlaka tel çit gerekir mi?', 'Çim çit bir taşıyıcıya bağlanır. Mevcut çitiniz yoksa önce tel veya panel çit kurup üstüne çim çiti takıyoruz.'],
      ['Çim çit rüzgarda zarar görür mü?', 'Doğru gergi ve bağlantı ile montaj yapıldığında rüzgara dayanıklıdır. Çok rüzgarlı açık arazilerde direk aralığını sıklaştırıyoruz.']
    ]
  },
  {
    slug: 'arsa-cevirme',
    name: 'Arsa Çevirme',
    icon: 'map',
    short: 'Arsa, tarla ve hobi bahçesi sınırlarını tel çit veya panel çitle anahtar teslim çevirme.',
    keywords: ['arsa çevirme', 'arsa çevirme fiyatları', 'tarla çevirme', 'hobi bahçesi çevirme', 'arsa etrafı tel çit'],
    intro:
      'Yeni aldığınız arsayı, tarlanızı veya hobi bahçenizi sınırlarından çevirip koruma altına alıyoruz. Ölçü, malzeme, direk dikimi ve kapı montajı dahil anahtar teslim çalışıyoruz. İstanbul dışında yaşıyorsanız konum atmanız yeterli, işi fotoğraflarla raporlayarak teslim ediyoruz.',
    details: [
      'Sınır taşlarına veya sizin gösterdiğiniz noktalara göre çit hattı',
      'Bütçeye göre tel çit, panel çit veya karma çözüm',
      'Araç ve yaya kapısı montajı',
      'Uzaktan sahipler için fotoğraflı ve videolu teslim',
      'Hobi bahçesi, bağ evi ve tiny house arsaları'
    ],
    faq: [
      ['Arsamın yerini tam bilmiyorum, yardımcı olur musunuz?', 'Parsel bilgisini (ada/parsel) veya Google Maps konumunu gönderin; e-Devlet parsel sorgu ile konumu kontrol edip yerinde keşif yapıyoruz. Kesin sınır için gerekirse harita mühendisi aplikasyonu önerilir.'],
      ['Arsa çevirmek için izin gerekir mi?', 'Tel çit genellikle sökülebilir yapı olarak değerlendirilir, ancak belediyeden belediyeye uygulama değişebilir. Duvar veya beton temel yapılacaksa belediyenize danışmanızı öneririz.'],
      ['Arsada olmadan iş yaptırabilir miyim?', 'Evet. Konum ve ölçüyü WhatsApp’tan konuşuyoruz, işin başında ve sonunda fotoğraf ve video gönderiyoruz.']
    ]
  },
  {
    slug: 'dikenli-tel',
    name: 'Dikenli ve Jiletli Tel',
    icon: 'shield',
    short: 'Duvar ve çit üstüne dikenli tel, jiletli tel ve konsertina ile güvenlik.',
    keywords: ['dikenli tel', 'jiletli tel', 'jiletli tel montajı', 'konsertina tel', 'duvar üstü dikenli tel'],
    intro:
      'Arsa, depo, şantiye ve fabrika çevresinde ek güvenlik için duvar ve çit üstüne dikenli tel, jiletli tel ve konsertina (spiral jiletli tel) montajı yapıyoruz. Mevcut çitinize sonradan da ekleme yapılabilir.',
    details: [
      'Galvaniz dikenli tel (2, 3 veya 4 sıra)',
      'Düz ve spiral (konsertina) jiletli tel',
      'Duvar üstü L ve Y tipi direk (kol) montajı',
      'Panel ve tel çit üstüne ek güvenlik',
      'Şantiye, depo, trafo ve fabrika çevresi uygulamaları'
    ],
    faq: [
      ['Duvar üstüne jiletli tel yapılabilir mi?', 'Evet, duvar üstüne L veya Y kol direkler dübelle sabitlenir, jiletli tel bu kollara gerilir.'],
      ['Jiletli tel ile dikenli tel arasındaki fark nedir?', 'Dikenli tel ekonomik bir caydırıcıdır. Jiletli tel keskin bıçak yapısı sayesinde tırmanmayı çok daha zorlaştırır, daha yüksek güvenlik gereken yerlerde tercih edilir.']
    ]
  },
  {
    slug: 'bahce-kapisi',
    name: 'Bahçe ve Arsa Kapısı',
    icon: 'gate',
    short: 'Yaya kapısı, çift kanatlı araç kapısı ve sürgülü bahçe kapısı imalatı ve montajı.',
    keywords: ['bahçe kapısı', 'arsa kapısı', 'tel çit kapısı', 'panel çit kapısı', 'demir bahçe kapısı'],
    intro:
      'Çitinize uygun yaya kapısı, çift kanatlı araç kapısı veya sürgülü bahçe kapısı yapıyoruz. Tel çit ve panel çitle aynı renk ve modelde, kilitli ve sağlam kapılarla arsanıza giriş kolaylığı sağlıyoruz.',
    details: [
      'Tek kanat yaya kapısı (100–120 cm)',
      'Çift kanatlı araç kapısı (300–500 cm)',
      'Sürgülü kapı ve otomatik kapı motoru hazırlığı',
      'Galvaniz ve elektrostatik boyalı kasa',
      'Asma kilit veya barel kilit seçenekleri'
    ],
    faq: [
      ['Kapıyı çitle birlikte mi yaptırmalıyım?', 'Çitle birlikte yapıldığında kapı direkleri çit hattına göre konumlanır, işçilik tek seferde biter ve maliyet düşer.'],
      ['Araç kapısı genişliği ne olmalı?', 'Binek araç için en az 300 cm, kamyonet ve traktör girişi için 400–500 cm öneriyoruz.']
    ]
  },
  {
    slug: 'solar-aydinlatma',
    name: 'Solar Bahçe Aydınlatma',
    icon: 'sun',
    short: 'Elektrik gerektirmeyen güneş enerjili bahçe, arsa ve yol aydınlatması.',
    keywords: ['solar aydınlatma', 'solar bahçe aydınlatma', 'güneş enerjili bahçe lambası', 'solar sokak lambası', 'arsa aydınlatma'],
    intro:
      'Elektriği olmayan arsa, bağ evi ve hobi bahçeleri için güneş enerjili (solar) aydınlatma kuruyoruz. Gündüz güneşle şarj olan lambalar akşam kendiliğinden yanar; kablo, fatura ve abonelik gerekmez. Çit direklerine, kapı girişine veya bahçe yollarına uygulanır.',
    details: [
      'Solar sokak ve direk lambası (arsa ve yol girişi için)',
      'Hareket sensörlü solar projektör',
      'Bahçe yolu ve çim aydınlatma (kazık tipi solar lamba)',
      'Çit direği ve duvar tipi solar aplik',
      'Kurulum, yön ve açı ayarı dahil montaj'
    ],
    faq: [
      ['Solar lamba kışın çalışır mı?', 'Evet. Bulutlu günlerde de şarj olur; kışın kısa günlerde çalışma süresi kısalabilir. Doğru panel boyutu ve doğru yönle (güneye bakacak şekilde) kurulumu yapıyoruz.'],
      ['Arsamda elektrik yok, aydınlatma yapılabilir mi?', 'Solar aydınlatmanın en büyük avantajı budur: elektrik aboneliği olmadan arsanızı ve girişinizi aydınlatabilirsiniz.']
    ]
  },
  {
    slug: 'peyzaj',
    name: 'Peyzaj ve Bahçe Düzenleme',
    icon: 'tree',
    short: 'Bahçe düzenleme, rulo çim, ağaç dikimi, otomatik sulama ve arsa temizliği.',
    keywords: ['peyzaj', 'bahçe düzenleme', 'rulo çim', 'bahçe peyzaj', 'otomatik sulama', 'arsa temizliği'],
    intro:
      'Çitiniz bittikten sonra bahçenizi de yaşanır hale getiriyoruz. Arsa temizliği, toprak tesviyesi, rulo çim serimi, ağaç ve çit bitkisi dikimi, otomatik sulama ve taş yol uygulamaları ile bahçenizi baştan sona düzenliyoruz.',
    details: [
      'Arsa temizliği, ot biçme ve toprak tesviyesi',
      'Rulo çim ve tohum çim uygulaması',
      'Meyve ağacı, mazı ve çit bitkisi dikimi',
      'Damlama ve fıskiyeli otomatik sulama',
      'Bahçe yolu, taş döşeme ve çakıl uygulaması'
    ],
    faq: [
      ['Peyzaj işini çitle birlikte yaptırabilir miyim?', 'Evet, aynı ekip hem çit hem bahçe düzenlemesini yapar; tek teklif, tek muhatap.'],
      ['Rulo çim ne zaman serilir?', 'En uygun dönem ilkbahar ve sonbahardır, ancak düzenli sulama ile yaz aylarında da serilebilir.']
    ]
  }
];

// prefix: true ise köy sayfası "Silivri Ortaköy" şeklinde ilçe adıyla birlikte yazılır.
// loc: bulunma hali eki özel ise (ör. Beylikdüzü'nde) elle yazılır.
export const districts = [
  {
    slug: 'silivri',
    name: 'Silivri',
    city: 'İstanbul',
    prefix: true,
    note:
      'Silivri’de en çok hobi bahçesi, yazlık, villa arsası ve tarla çevirme işi yapıyoruz. Selimpaşa ve Gümüşyaka gibi sahil bölgelerinde yazlık bahçeleri, Değirmenköy, Çanta ve Seymen tarafında ise geniş arazi ve tarlalar ağırlıktadır.',
    landTypes: ['hobi bahçesi', 'yazlık', 'villa arsası', 'tarla'],
    villages: [
      'Selimpaşa', 'Ortaköy', 'Kavaklı', 'Gümüşyaka', 'Değirmenköy', 'Çanta', 'Sayalar', 'Seymen', 'Fener',
      'Büyükçavuşlu', 'Akören', 'Alipaşa', 'Beyciler', 'Bekirli', 'Büyükkılıçlı', 'Küçükkılıçlı', 'Çayırdere',
      'Çeltik', 'Danamandıra', 'Kadıköy', 'Kurfallı', 'Gazitepe', 'Yolçatı', 'Semizkumlar', 'Büyüksinekli',
      'Küçüksinekli', 'Kınalı', 'Alibey'
    ]
  },
  {
    slug: 'catalca',
    name: 'Çatalca',
    city: 'İstanbul',
    prefix: true,
    note:
      'Çatalca’da tarım arazileri, çiftlikler, hayvan çitleri ve hobi bahçeleri öne çıkar. Geniş arazilerde ekonomik tel çit, çiftlik ve ahır çevrelerinde ise yüksek ve sağlam çit çözümleri uyguluyoruz.',
    landTypes: ['tarla', 'çiftlik', 'hobi bahçesi', 'bağ evi'],
    villages: [
      'Ferhatpaşa', 'Kaleiçi', 'Çakıl', 'Binkılıç', 'Ormanlı', 'Gökçeali', 'Karacaköy', 'Subaşı', 'Yalıköy',
      'Kızılcaali', 'İnceğiz', 'Muratbey', 'Hallaçlı', 'Elbasan', 'Oklalı', 'Dağyenice', 'Akalan', 'Çiftlikköy',
      'Çanakça', 'Nakkaş', 'Kestanelik', 'Hisarbeyli', 'Aydınlar', 'Örcünlü', 'Kabakça', 'Yaylacık',
      'Gümüşpınar', 'İzzettin', 'Karamandere', 'Belgrat', 'Başak', 'Celepköy', 'Kalfa', 'Yazlık', 'Ovayenice'
    ]
  },
  {
    slug: 'beylikduzu',
    name: 'Beylikdüzü',
    loc: 'Beylikdüzü’nde',
    city: 'İstanbul',
    prefix: true,
    note:
      'Beylikdüzü’nde müstakil ev ve villa bahçeleri, site çevreleri ve iş yerleri için panel çit ve çim çit ile görüntü kesme uygulamaları en çok talep gören işlerdir.',
    landTypes: ['villa bahçesi', 'site', 'müstakil ev', 'iş yeri'],
    villages: [
      'Yakuplu', 'Kavaklı', 'Gürpınar', 'Adnan Kahveci', 'Barış', 'Büyükşehir', 'Cumhuriyet', 'Dereağzı',
      'Marmara', 'Sahil', 'Yenimahalle'
    ]
  },
  {
    slug: 'buyukcekmece',
    name: 'Büyükçekmece',
    city: 'İstanbul',
    prefix: true,
    note:
      'Büyükçekmece’de Celaliye, Kumburgaz, Tepecik ve Mimarsinan gibi bölgelerde yazlık bahçeleri, villa arsaları ve hobi bahçeleri için tel çit, panel çit ve çim çit uyguluyoruz.',
    landTypes: ['yazlık', 'villa arsası', 'hobi bahçesi', 'müstakil ev'],
    villages: [
      'Celaliye', 'Kumburgaz', 'Mimarsinan', 'Tepecik', 'Kamiloba', 'Çakmaklı', 'Ekinoba', 'Güzelce',
      'Karaağaç', 'Türkoba', 'Sinanoba', 'Murat Çeşme', 'Batıköy', 'Dizdariye', 'Pınartepe', 'Mimaroba'
    ]
  },
  {
    slug: 'tekirdag',
    name: 'Tekirdağ',
    city: 'Tekirdağ',
    prefix: false,
    note:
      'Tekirdağ’da Marmaraereğlisi ve Sultanköy yazlıklarından Çorlu ve Çerkezköy’deki fabrika, depo ve sanayi arsalarına kadar geniş bir bölgede çit ve güvenlik teli işleri yapıyoruz.',
    landTypes: ['fabrika ve depo', 'yazlık', 'tarla', 'sanayi arsası'],
    villages: [
      'Marmaraereğlisi', 'Sultanköy', 'Yeniçiftlik', 'Çeşmeli', 'Çorlu', 'Çerkezköy', 'Kapaklı', 'Ergene',
      'Velimeşe', 'Süleymanpaşa', 'Kumbağ', 'Saray', 'Muratlı'
    ],
    villageLoc: { 'Marmaraereğlisi': 'Marmaraereğlisi’nde' }
  }
];

// İş fotoğrafları (assets/foto/<file>-480.webp ve -960.webp). ratio = genişlik / yükseklik
export const photos = [
  { file: 'orgu-tel-cit-beton-direk', ratio: 585 / 545, caption: 'Beton direkli örgü tel çit ve dikenli tel', services: ['tel-cit', 'arsa-cevirme'] },
  { file: 'panel-cit-kapi-montaji', ratio: 1, caption: 'Panel çit, kapı montajı ve jiletli tel', services: ['panel-cit', 'bahce-kapisi', 'dikenli-tel', 'arsa-cevirme'] },
  { file: 'panel-cit-duvar-ustu', ratio: 720 / 687, caption: 'Duvar üstü yeşil panel çit', services: ['panel-cit'] },
  { file: 'jiletli-tel-konsertina', ratio: 1000 / 601, caption: 'İş yeri çevresine jiletli tel (konsertina)', services: ['dikenli-tel'] },
  { file: 'dikenli-tel-orgu-tel', ratio: 800 / 532, caption: 'Örgü tel çit üstüne dikenli tel', services: ['dikenli-tel', 'tel-cit'] }
];
