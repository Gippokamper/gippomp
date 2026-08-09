<?php

use App\Models\Vocabulary;
use Illuminate\Database\Migrations\Migration;

/* Bosh sahifadagi suhbat uchun tarjimalar. */
return new class extends Migration
{
    private const KEYS = [
        'Ask about any topic — I will find the materials' => [
            'uz' => 'Istalgan mavzuni so\'rang — materiallarni topib beraman',
            'ru' => 'Спросите о любой теме — найду материалы',
            'en' => 'Ask about any topic — I will find the materials',
        ],
        'Ask a question' => [
            'uz' => 'Savolingizni yozing',
            'ru' => 'Задайте вопрос',
            'en' => 'Ask a question',
        ],
        'Your recent questions' => [
            'uz' => 'Oxirgi savollaringiz',
            'ru' => 'Ваши последние вопросы',
            'en' => 'Your recent questions',
        ],
        'Recent questions' => ['uz' => 'Oxirgi savollar', 'ru' => 'Последние вопросы', 'en' => 'Recent questions'],
        'Found materials'  => ['uz' => 'Topilgan materiallar', 'ru' => 'Найдено материалов', 'en' => 'Found materials'],
        'Try another word or check the spelling' => [
            'uz' => 'Boshqa so\'z bilan urinib ko\'ring yoki imloni tekshiring',
            'ru' => 'Попробуйте другое слово или проверьте написание',
            'en' => 'Try another word or check the spelling',
        ],
        'Send'   => ['uz' => 'Yuborish', 'ru' => 'Отправить', 'en' => 'Send'],
        'Topics' => ['uz' => 'Mavzular', 'ru' => 'Темы',      'en' => 'Topics'],
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
