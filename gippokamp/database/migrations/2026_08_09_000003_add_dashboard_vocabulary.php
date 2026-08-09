<?php

use App\Models\Vocabulary;
use Illuminate\Database\Migrations\Migration;

/* Bosh sahifa uchun tarjimalar. */
return new class extends Migration
{
    private const KEYS = [
        'Home'  => ['uz' => 'Bosh sahifa', 'ru' => 'Главная', 'en' => 'Home'],
        'Hello' => ['uz' => 'Salom',       'ru' => 'Привет',  'en' => 'Hello'],
        'What are we learning today?' => [
            'uz' => 'Bugun nima o\'rganamiz?',
            'ru' => 'Что изучаем сегодня?',
            'en' => 'What are we learning today?',
        ],
        'Continue reading' => [
            'uz' => 'O\'qishni davom ettirish',
            'ru' => 'Продолжить чтение',
            'en' => 'Continue reading',
        ],
        'Modules' => ['uz' => 'Modullar', 'ru' => 'Модули', 'en' => 'Modules'],
        'Open'    => ['uz' => 'Ochish',   'ru' => 'Открыть', 'en' => 'Open'],
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
