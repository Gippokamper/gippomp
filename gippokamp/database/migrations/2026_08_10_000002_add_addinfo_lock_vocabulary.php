<?php

use App\Models\Vocabulary;
use Illuminate\Database\Migrations\Migration;

/*
 * Qulflangan qo'shimcha ma'lumot: `info` ruxsati yo'q foydalanuvchida
 * `<u>` bloklari o'rnida chiqadigan taklif matnlari.
 *
 * "Premiumga o'tish" uchun yangi kalit qo'shilmadi — lug'atda `Upgrade`
 * allaqachon bor va aynan shu ma'noda tarjima qilingan.
 *
 * Uchala til ham majburiy: VocabularyResource `translation[$lang]` ni
 * tekshirmasdan o'qiydi, biror til yetishmasa o'sha kalit butun ilovada
 * buziladi.
 */
return new class extends Migration
{
    private const KEYS = [
        'Available in Premium' => [
            'uz' => 'Premiumda ochiladi',
            'ru' => 'Доступно в Premium',
            'en' => 'Available in Premium',
        ],
        /*
         * O'rin egallovchi ataylab `%n%`, `{{count}}` emas: i18next `{{...}}`
         * ni o'zi almashtirmoqchi bo'ladi va qiymat berilmagani uchun uni
         * yo'qotib qo'yardi. Sonni `prepare-html` qo'yadi, chunki u har bir
         * taklif uchun alohida hisoblanadi.
         */
        'More hidden items' => [
            'uz' => 'Yana %n% ta band',
            'ru' => 'Ещё %n%',
            'en' => '%n% more items',
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
