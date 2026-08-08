<?php

use App\Models\Vocabulary;
use Illuminate\Database\Migrations\Migration;

/*
 * Test bo'limlari daraxti uchun yangi tarjima kalitlari.
 *
 * Lug'at bazada turadi (vocabularies), shuning uchun yangi kalitlar deploy
 * paytida o'zi qo'shilsin — aks holda interfeysда inglizcha kalit ko'rinadi.
 */
return new class extends Migration
{
    private const KEYS = [
        'Subject'      => ['uz' => 'Fan',                        'ru' => 'Предмет',                  'en' => 'Subject'],
        'Used'         => ['uz' => 'Ishlatilgan',                'ru' => 'Использовано',             'en' => 'Used'],
        'Mark as done' => ['uz' => 'Bajarildi deb belgilash',    'ru' => 'Отметить как выполненное', 'en' => 'Mark as done'],
        'Expand'       => ['uz' => 'Ochish',                     'ru' => 'Развернуть',               'en' => 'Expand'],
        'Collapse'     => ['uz' => 'Yopish',                     'ru' => 'Свернуть',                 'en' => 'Collapse'],
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
