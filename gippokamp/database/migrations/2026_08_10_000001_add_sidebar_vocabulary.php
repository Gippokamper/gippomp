<?php

use App\Models\Vocabulary;
use Illuminate\Database\Migrations\Migration;

/* Chap menyu: guruh sarlavhalari va yig'ish tugmasi uchun tarjimalar. */
return new class extends Migration
{
    private const KEYS = [
        'Main menu'     => ['uz' => 'Asosiy menyu',  'ru' => 'Главное меню', 'en' => 'Main menu'],
        'Learning'      => ['uz' => "O'rganish",     'ru' => 'Обучение',     'en' => 'Learning'],
        'Practice'      => ['uz' => 'Sinov',         'ru' => 'Практика',     'en' => 'Practice'],
        'Updates'       => ['uz' => 'Xabar',         'ru' => 'Новости',      'en' => 'Updates'],
        'Collapse menu' => ['uz' => "Menyuni yig'ish", 'ru' => 'Свернуть меню', 'en' => 'Collapse menu'],
        'Expand menu'   => ['uz' => 'Menyuni ochish', 'ru' => 'Развернуть меню', 'en' => 'Expand menu'],
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
