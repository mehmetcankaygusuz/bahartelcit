// Bahar Tel Çit: WhatsApp talep formu ve Google Ads dönüşüm takibi
(function () {
  var C = window.BTC || {};

  function track(kind) {
    try {
      if (typeof window.gtag !== 'function') return;
      window.gtag('event', kind === 'call' ? 'telefon_tiklama' : kind === 'form' ? 'form_gonderimi' : 'whatsapp_tiklama', { sayfa: C.page || location.pathname });
      var list = (C.conv && C.conv[kind]) || [];
      for (var i = 0; i < list.length; i++) window.gtag('event', 'conversion', { send_to: list[i] });
    } catch (e) {}
  }

  // WhatsApp ve telefon tıklamalarını say
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-ev]');
    if (a) track(a.getAttribute('data-ev'));
  });

  // Form -> hazır WhatsApp mesajı
  var forms = document.querySelectorAll('form[data-lead]');
  for (var i = 0; i < forms.length; i++) {
    forms[i].addEventListener('submit', function (e) {
      e.preventDefault();
      var f = e.target;
      var v = function (n) { return (f.elements[n] && f.elements[n].value || '').trim(); };
      var bolge = f.elements.bolge;
      if (!v('bolge')) { bolge.classList.add('err'); bolge.focus(); bolge.placeholder = 'Lütfen arsanın yerini yazın'; return; }
      bolge.classList.remove('err');
      var lines = ['Merhaba, web sitenizden fiyat teklifi istiyorum.'];
      if (v('ad')) lines.push('Ad: ' + v('ad'));
      lines.push('Yer: ' + v('bolge'));
      lines.push('Hizmet: ' + v('hizmet'));
      if (v('metre')) lines.push('Yaklaşık uzunluk: ' + v('metre') + ' metre');
      if (v('not')) lines.push('Not: ' + v('not'));
      lines.push('(Konumumu da göndereceğim.)');
      track('form');
      var url = 'https://wa.me/' + C.wa + '?text=' + encodeURIComponent(lines.join('\n'));
      setTimeout(function () { window.location.href = url; }, 250);
    });
  }
})();
