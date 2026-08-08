<?php

use App\Models\Vocabulary;
use Illuminate\Database\Migrations\Migration;

/*
 * Videolar sahifasidagi filtrlar uchun tarjimalar.
 *
 * `Purchase` va `Make an additional payment` yangi emas — ular to'lov oynasida
 * allaqachon ishlatiladi, lekin lug'atda yo'q edi va interfeysда inglizcha
 * ko'rinardi. Shu yerda birga to'g'rilanadi.
 */
return new class extends Migration
{
    private const KEYS = [
        'Newest'        => ['uz' => 'Avval yangilari', 'ru' => 'Сначала новые',  'en' => 'Newest'],
        'Oldest'        => ['uz' => 'Avval eskilari',  'ru' => 'Сначала старые', 'en' => 'Oldest'],
        'By name'       => ['uz' => 'Nomi bo\'yicha',  'ru' => 'По названию',    'en' => 'By name'],
        'Nothing found' => ['uz' => 'Hech narsa topilmadi', 'ru' => 'Ничего не найдено', 'en' => 'Nothing found'],
        'Load more'     => ['uz' => 'Yana yuklash',    'ru' => 'Показать ещё',   'en' => 'Load more'],
        'Purchase'      => ['uz' => 'Sotib olish',     'ru' => 'Купить',         'en' => 'Purchase'],
        'Make an additional payment' => [
            'uz' => 'Qo\'shimcha to\'lov qiling',
            'ru' => 'Внесите дополнительный платёж',
            'en' => 'Make an additional payment',
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
