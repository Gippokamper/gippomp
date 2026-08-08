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

# Migratsiyalar — har biri ALOHIDA.
#
# Nega oddiy `php artisan migrate` emas: baza production dump'idan kelgan va
# `migrations` jadvali bazadagi haqiqiy holatga mos emas (masalan `balances`
# jadvali bor, lekin yozuvi yo'q). Oddiy `migrate` birinchi nomuvofiqlikda
# to'xtaydi va undan keyingi HAMMA migratsiya o'tmay qoladi.
#
# Fayl-bafayl yurganda: o'tishi kerak bo'lgani o'tadi, eskisi xato bersa ham
# deploy to'xtamaydi. Allaqachon o'tgan migratsiyani Laravel o'zi o'tkazib
# yuboradi, shuning uchun buni har deploy'da ishlatish xavfsiz.
echo "--- migratsiyalar ---"
for migration in database/migrations/*.php; do
  name=$(basename "$migration" .php)
  # `|| true` — `set -e` bitta xato migratsiya tufayli deploy'ni to'xtatmasin.
  output=$(php artisan migrate --force --path="$migration" 2>&1) || true
  case "$output" in
    *DONE*) echo "  o'tdi:    $name" ;;
    *FAIL*) echo "  O'TMADI:  $name" ;;
    # "Nothing to migrate" — allaqachon o'tgan, logni to'ldirmaymiz.
  esac
done
echo "--- migratsiyalar tugadi ---"

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
