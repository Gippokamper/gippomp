<?php

use App\Models\Vocabulary;
use Illuminate\Database\Migrations\Migration;

/*
 * Shaxsiy hisob raqami — to'lov tizimlariga kiritiladigan raqam.
 * Payme uni `account.user_id`, Click esa `merchant_trans_id` deb kutadi.
 */
return new class extends Migration
{
    private const KEYS = [
        'Personal account number' => [
            'uz' => 'Shaxsiy hisob raqami',
            'ru' => 'Лицевой счёт',
            'en' => 'Personal account number',
        ],
        'Copy'    => ['uz' => 'Nusxalash',  'ru' => 'Копировать', 'en' => 'Copy'],
        'Copied'  => ['uz' => 'Nusxalandi', 'ru' => 'Скопировано', 'en' => 'Copied'],
        'Balance' => ['uz' => 'Balans',     'ru' => 'Баланс',     'en' => 'Balance'],
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
