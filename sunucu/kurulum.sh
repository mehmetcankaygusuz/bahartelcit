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

# SSL: alan adı bu sunucuyu gösteriyorsa ve sertifika yoksa Let's Encrypt kur
echo "SSL kontrolü başlıyor."
if [ -d /etc/letsencrypt/live/$DOMAIN ]; then
  echo "SSL sertifikası zaten var: $(ls /etc/letsencrypt/live/$DOMAIN | tr '\n' ' ')"
  grep -q "ssl_certificate" /etc/nginx/sites-available/$DOMAIN 2>/dev/null && echo "Nginx SSL ayarı var." || echo "Nginx ayarında SSL yok."
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
