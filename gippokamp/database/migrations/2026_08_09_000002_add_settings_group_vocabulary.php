<?php

use App\Models\Vocabulary;
use Illuminate\Database\Migrations\Migration;

/* Sozlamalar formasidagi guruh sarlavhalari. */
return new class extends Migration
{
    private const KEYS = [
        'Personal information' => ['uz' => 'Shaxsiy ma\'lumotlar', 'ru' => 'Личные данные', 'en' => 'Personal information'],
        'Education'            => ['uz' => 'Ta\'lim',              'ru' => 'Образование',   'en' => 'Education'],
        'Contacts'             => ['uz' => 'Aloqa',                'ru' => 'Контакты',      'en' => 'Contacts'],
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
