<?php

use App\Models\Vocabulary;
use Illuminate\Database\Migrations\Migration;

/* Bosh sahifadagi qidiruv ekrani uchun tarjimalar. */
return new class extends Migration
{
    private const KEYS = [
        'What are you searching for?' => [
            'uz' => 'Nimani qidiryapsiz?',
            'ru' => 'Что вы ищете?',
            'en' => 'What are you searching for?',
        ],
        'The library is constantly updated and expanded' => [
            'uz' => 'Kutubxona doimiy to\'ldirilib va yangilanib boriladi',
            'ru' => 'Библиотека постоянно пополняется и обновляется',
            'en' => 'The library is constantly updated and expanded',
        ],
        'Find content' => [
            'uz' => 'Maqola yoki mavzu qidiring',
            'ru' => 'Найти статью или тему',
            'en' => 'Find content',
        ],
        'Explore more' => ['uz' => 'Pastroqda', 'ru' => 'Смотреть ниже', 'en' => 'Explore more'],
        'Recently viewed articles' => [
            'uz' => 'Oxirgi ko\'rilgan maqolalar',
            'ru' => 'Недавно просмотренные статьи',
            'en' => 'Recently viewed articles',
        ],
        'Learning' => ['uz' => 'O\'quv', 'ru' => 'Обучение', 'en' => 'Learning'],
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
