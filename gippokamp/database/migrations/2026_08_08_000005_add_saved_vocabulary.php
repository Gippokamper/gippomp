<?php

use App\Models\Vocabulary;
use Illuminate\Database\Migrations\Migration;

/* "Saqlanganlar" bo'limi va profil menyusidagi til tanlash uchun tarjimalar. */
return new class extends Migration
{
    private const KEYS = [
        'Saved'             => ['uz' => 'Saqlanganlar',  'ru' => 'Избранное',        'en' => 'Saved'],
        'Save'              => ['uz' => 'Saqlash',       'ru' => 'Сохранить',        'en' => 'Save'],
        'Remove from saved' => ['uz' => 'Saqlanganlardan olib tashlash', 'ru' => 'Убрать из избранного', 'en' => 'Remove from saved'],
        'Nothing saved yet' => ['uz' => 'Hali hech narsa saqlanmagan', 'ru' => 'Пока ничего не сохранено', 'en' => 'Nothing saved yet'],
        'Save materials to find them here' => [
            'uz' => 'Maqola va videolarni saqlasangiz, shu yerda turadi',
            'ru' => 'Сохранённые статьи и видео появятся здесь',
            'en' => 'Save materials to find them here',
        ],
        'Language' => ['uz' => 'Til', 'ru' => 'Язык', 'en' => 'Language'],
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
