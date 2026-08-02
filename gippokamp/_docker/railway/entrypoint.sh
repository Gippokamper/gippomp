#!/usr/bin/env bash
set -e

# Railway $PORT ni nginx konfigiga qo'yamiz (sed — ortiqcha paketsiz)
: "${PORT:=8080}"
sed -i "s/__PORT__/${PORT}/g" /etc/nginx/sites-available/default
ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# APP_KEY Railway env'da berilmasa — yaratamiz
if [ -z "${APP_KEY}" ]; then
  php artisan key:generate --force || true
fi

# Paketlarni aniqlash (build'да --no-scripts ishlatilgan)
php artisan package:discover --ansi || true

# Config keshlash (tezlik). route:cache YO'Q — /optimize route'да closure bor, cache'lab bo'lmaydi.
php artisan config:clear || true
php artisan config:cache || true

# Storage symlink (public/storage -> storage/app/public)
php artisan storage:link || true

# ESLATMA: migratsiya bu yerда ISHLAMAYDI — baza production dump'idan import qilinadi
# (to'liq sxema + real kontent). Kerak bo'lsa migratsiyani qo'lда bir marta ishga tushirasiz.

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
