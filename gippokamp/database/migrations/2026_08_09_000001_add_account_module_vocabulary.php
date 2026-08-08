<?php

use App\Models\Vocabulary;
use Illuminate\Database\Migrations\Migration;

/*
 * Shaxsiy kabinet uchun tarjimalar.
 *
 * Bir qismi yangi ("Akkaunt", "Mening tarifim"), bir qismi esa eskidan
 * ishlatilib kelinayotgan, lekin lug'atda bo'lmagani uchun interfeysда
 * inglizcha ko'rinardi: "Yes", "No", "Do you want to log out?", "UZS".
 */
return new class extends Migration
{
    private const KEYS = [
        'Account'      => ['uz' => 'Akkaunt',           'ru' => 'Аккаунт',          'en' => 'Account'],
        'Edit profile' => ['uz' => 'Profilni tahrirlash', 'ru' => 'Изменить профиль', 'en' => 'Edit profile'],
        'Email'        => ['uz' => 'Elektron pochta',   'ru' => 'Эл. почта',        'en' => 'Email'],
        'My tariff'    => ['uz' => 'Mening tarifim',    'ru' => 'Мой тариф',        'en' => 'My tariff'],
        'Manage tariffs' => ['uz' => 'Tariflarni boshqarish', 'ru' => 'Управление тарифами', 'en' => 'Manage tariffs'],
        'Purchase a tariff to access all materials' => [
            'uz' => 'Barcha materiallarga kirish uchun tarif sotib oling',
            'ru' => 'Купите тариф, чтобы открыть все материалы',
            'en' => 'Purchase a tariff to access all materials',
        ],
        'Active tariff not found' => [
            'uz' => 'Amaldagi tarif yo\'q',
            'ru' => 'Активный тариф не найден',
            'en' => 'Active tariff not found',
        ],
        'UZS' => ['uz' => 'so\'m', 'ru' => 'сум', 'en' => 'UZS'],
        'Yes' => ['uz' => 'Ha',    'ru' => 'Да',  'en' => 'Yes'],
        'No'  => ['uz' => 'Yo\'q', 'ru' => 'Нет', 'en' => 'No'],
        'Do you want to log out?' => [
            'uz' => 'Hisobdan chiqmoqchimisiz?',
            'ru' => 'Выйти из аккаунта?',
            'en' => 'Do you want to log out?',
        ],
        "After you sign out, you'll need to enter your credentials again to sign in" => [
            'uz' => 'Chiqqaningizdan so\'ng qayta kirish uchun ma\'lumotlaringizni yana kiritishingiz kerak',
            'ru' => 'После выхода для входа снова потребуется ввести данные',
            'en' => "After you sign out, you'll need to enter your credentials again to sign in",
        ],
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        foreach (self::KEYS as $key => $translation) {
            Vocabulary::updateOrCreate(['key' => $key], ['translation' => $translation]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Vocabulary::whereIn('key', array_keys(self::KEYS))->delete();
    }
};
