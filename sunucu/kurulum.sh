#!/usr/bin/env bash
# bahartelcit.com sunucu kurulumu (Ubuntu). Her yayında GitHub Actions tarafından çalıştırılır.
# Tekrar tekrar çalıştırılması güvenlidir: sadece eksik olanı kurar, diğer sitelere dokunmaz.
set -euo pipefail
DOMAIN=bahartelcit.com
ROOT=/var/www/$DOMAIN

if [ -d /usr/local/psa ] || [ -d /usr/local/cpanel ]; then
  echo "HATA: Sunucuda Plesk/cPanel var. Alan adını panelden ekleyin, bu betik elle ayar yapmaz."; exit 1
fi

mkdir -p "$ROOT"
# Dosyaları yükleyen SSH kullanıcısı klasöre yazabilsin
[ -n "${1:-}" ] && chown -R "$1" "$ROOT"

if systemctl is-active --quiet nginx; then
  WEB=nginx
  CONF=/etc/nginx/sites-available/$DOMAIN
  if [ ! -f "$CONF" ]; then
    cat > "$CONF" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    root $ROOT;
    index index.html;
    error_page 404 /404.html;
    location / { try_files \$uri \$uri/ =404; }
    location /assets/ { expires 7d; add_header Cache-Control "public"; }
    gzip on;
    gzip_types text/css application/javascript application/xml image/svg+xml;
}
NGINX
    ln -sf "$CONF" /etc/nginx/sites-enabled/$DOMAIN
    nginx -t && systemctl reload nginx
    echo "Nginx ayarı oluşturuldu."
  fi
elif systemctl is-active --quiet apache2; then
  WEB=apache
  CONF=/etc/apache2/sites-available/$DOMAIN.conf
  if [ ! -f "$CONF" ]; then
    cat > "$CONF" <<APACHE
<VirtualHost *:80>
    ServerName $DOMAIN
    ServerAlias www.$DOMAIN
    DocumentRoot $ROOT
    ErrorDocument 404 /404.html
    <Directory $ROOT>
        Options -Indexes
        AllowOverride None
        Require all granted
    </Directory>
</VirtualHost>
APACHE
    a2ensite "$DOMAIN.conf" >/dev/null
    apache2ctl configtest && systemctl reload apache2
    echo "Apache ayarı oluşturuldu."
  fi
else
  echo "HATA: Çalışan Nginx veya Apache bulunamadı."; exit 1
fi

# Eski siteden kalan adresleri yeni sayfalara kalıcı (301) yönlendir
if [ "$WEB" = nginx ]; then
  cat > /etc/nginx/snippets/$DOMAIN-yonlendirme.conf <<'YON'
location = /hizmetler { return 301 /hizmetler/; }
location ~* ^/hizmetler/(tel-cit|tel-cit-uygulama)/?$ { return 301 /tel-cit/; }
location ~* ^/(hakkimizda|hakkimizda\.html|kurumsal|about)/?$ { return 301 /; }
location ~* ^/(iletisim\.html|iletisim\.php|contact)/?$ { return 301 /iletisim/; }
location ~* ^/(hizmetler\.html|hizmetlerimiz)/?$ { return 301 /hizmetler/; }
location ~* ^/(galeri|referanslar|projeler|projelerimiz)/?$ { return 301 /hizmetler/; }
location ~* ^/(index\.php|anasayfa)/?$ { return 301 /; }
location ~* ^/(silivri|catalca|corlu|tekirdag|beylikduzu|buyukcekmece)/?$ { return 301 /$1-tel-cit/; }
location ~* ^/marmara-?ereglisi(-tel-cit)?/?$ { return 301 /marmaraereglisi-tel-cit/; }
YON
  CONF_EN=/etc/nginx/sites-available/$DOMAIN
  if ! grep -q "$DOMAIN-yonlendirme.conf" "$CONF_EN"; then
    sed -i "s|^\(\s*root $ROOT;\)|\1\n    include /etc/nginx/snippets/$DOMAIN-yonlendirme.conf;|" "$CONF_EN"
  fi
  if nginx -t >/dev/null 2>&1; then systemctl reload nginx && echo "Nginx yönlendirmeleri güncel."
  else sed -i "/$DOMAIN-yonlendirme.conf/d" "$CONF_EN"; echo "HATA: yönlendirme ayarı geçersiz, geri alındı."; fi
fi

# SSL: alan adı bu sunucuyu gösteriyorsa ve sertifika yoksa Let's Encrypt kur
echo "SSL kontrolü başlıyor."
if [ -d /etc/letsencrypt/live/$DOMAIN ]; then
  echo "SSL sertifikası zaten var: $(ls /etc/letsencrypt/live/$DOMAIN | tr '\n' ' ')"
  if [ "$WEB" = nginx ] && ! grep -q "ssl_certificate" /etc/nginx/sites-available/$DOMAIN; then
    echo "Nginx ayarında SSL yok, sertifika bağlanıyor."
    certbot install --nginx --cert-name $DOMAIN --redirect --non-interactive 2>&1 | tail -n 4
    nginx -t 2>&1 | tail -n 1 && systemctl reload nginx && echo "SSL Nginx'e bağlandı."
  elif [ "$WEB" = apache ] && ! grep -q "SSLCertificateFile" /etc/apache2/sites-enabled/$DOMAIN*.conf 2>/dev/null; then
    echo "Apache ayarında SSL yok, sertifika bağlanıyor."
    certbot install --apache --cert-name $DOMAIN --redirect --non-interactive 2>&1 | tail -n 4
  else
    echo "SSL etkin."
  fi
fi
if [ ! -d /etc/letsencrypt/live/$DOMAIN ]; then
  SERVER_IP=$(curl -s4 --max-time 10 https://api.ipify.org || true)
  DNS_IP=$(getent ahostsv4 $DOMAIN | awk 'NR==1{print $1}' || true)
  if [ -n "$SERVER_IP" ] && [ "$SERVER_IP" = "$DNS_IP" ]; then
    command -v certbot >/dev/null || { apt-get update -qq && apt-get install -y -qq certbot python3-certbot-$WEB; }
    DOMS="-d $DOMAIN"
    [ "$(getent ahostsv4 www.$DOMAIN | awk 'NR==1{print $1}')" = "$SERVER_IP" ] && DOMS="$DOMS -d www.$DOMAIN"
    certbot --$WEB $DOMS --non-interactive --agree-tos --register-unsafely-without-email --redirect 2>&1 | tail -n 5
    echo "SSL kuruldu."
  else
    echo "UYARI: $DOMAIN henüz bu sunucuyu göstermiyor (DNS: ${DNS_IP:-yok}, sunucu: ${SERVER_IP:-?}). DNS ayarlanınca SSL bir sonraki yayında kurulacak."
  fi
fi
