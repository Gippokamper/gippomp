<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'payme' => [
        'key' => env('PAYME_KEY'),
    ],

    'click' => [
        'secret_key' => env('CLICK_SECRET_KEY'),
        'service_id' => env('CLICK_SERVICE_ID'),
    ],

    'apelsin' => [
        'key' => env('APELSIN_KEY'),
    ],

    'upay' => [
        'key' => env('UPAY_KEY'),
    ],

    'sms' => [
        'url'      => env('SMS_URL', 'http://sms.etc.uz:8084/json2sms'),
        'login'    => env('SMS_LOGIN'),
        'password' => env('SMS_PASSWORD'),
        'sender'   => env('SMS_SENDER', 'Gippokamp'),
    ],

    'fcm' => [
        'server_key' => env('FCM_SERVER_KEY'),
    ],

];
