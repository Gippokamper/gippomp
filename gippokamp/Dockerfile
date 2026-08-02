# Gippokamp backend — Railway uchun production image (nginx + php-fpm bitta konteynerда).
FROM php:8.2-fpm-bookworm

# Tizim kutubxonalari + PHP kengaytmalari (gd/webp, pdo_mysql, bcmath, zip, intl)
RUN apt-get update && apt-get install -y \
        nginx supervisor \
        libwebp-dev libjpeg62-turbo-dev libpng-dev libzip-dev libicu-dev \
        zip unzip git curl \
    && docker-php-ext-configure gd --with-jpeg --with-webp \
    && docker-php-ext-install -j"$(nproc)" pdo_mysql bcmath zip gd intl exif \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /var/www

# Avval faqat composer fayllari — qatlam keshi uchun
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction

# Qolgan kod
COPY . .
RUN composer dump-autoload --optimize --no-dev \
    && mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# nginx + supervisor + ishga tushirish skripti
COPY _docker/railway/nginx.conf   /etc/nginx/sites-available/default
COPY _docker/railway/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY _docker/railway/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

# Railway $PORT beradi (default 8080)
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["entrypoint"]
