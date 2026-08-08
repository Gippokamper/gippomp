<?php

use App\Models\Vocabulary;
use Illuminate\Database\Migrations\Migration;

/*
 * Uchinchi ko'rinish rejimi ("o'qish") uchun tarjimalar.
 *
 * `Theme settings` yangi emas — maqola sozlamalari oynasining sarlavhasida
 * allaqachon ishlatiladi, lekin lug'atda yo'q edi va inglizcha ko'rinardi.
 */
return new class extends Migration
{
    private const KEYS = [
        'Appearance'     => ['uz' => 'Ko\'rinish',        'ru' => 'Оформление',        'en' => 'Appearance'],
        'Reading'        => ['uz' => 'O\'qish',           'ru' => 'Чтение',            'en' => 'Reading'],
        'Theme settings' => ['uz' => 'Ko\'rinish sozlamalari', 'ru' => 'Настройки оформления', 'en' => 'Theme settings'],
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
