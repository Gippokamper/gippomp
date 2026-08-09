<?php

use App\Models\Vocabulary;
use Illuminate\Database\Migrations\Migration;

/* Bosh sahifadagi o'quv tahlili bloklari uchun tarjimalar. */
return new class extends Migration
{
    private const KEYS = [
        'Study summary'    => ['uz' => 'O\'quv xulosasi',   'ru' => 'Сводка обучения',  'en' => 'Study summary'],
        'Correct answers'  => ['uz' => 'To\'g\'ri javoblar', 'ru' => 'Верные ответы',    'en' => 'Correct answers'],
        'Solved questions' => ['uz' => 'Yechilgan savollar', 'ru' => 'Решено вопросов',  'en' => 'Solved questions'],
        'Sessions'         => ['uz' => 'Sessiyalar',        'ru' => 'Сессии',           'en' => 'Sessions'],
        'Focus on these'   => ['uz' => 'Shularga e\'tibor bering', 'ru' => 'Обратите внимание', 'en' => 'Focus on these'],
        'Recent sessions'  => ['uz' => 'Oxirgi sessiyalar', 'ru' => 'Последние сессии', 'en' => 'Recent sessions'],
        'You have not solved any tests yet' => [
            'uz' => 'Hali test yechmagansiz',
            'ru' => 'Вы ещё не решали тесты',
            'en' => 'You have not solved any tests yet',
        ],
        'Solve your first test and your progress will appear here' => [
            'uz' => 'Birinchi testni yeching — natijangiz shu yerda ko\'rinadi',
            'ru' => 'Решите первый тест — результат появится здесь',
            'en' => 'Solve your first test and your progress will appear here',
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
