<?php

use App\Models\Vocabulary;
use Illuminate\Database\Migrations\Migration;

/*
 * Sarlavhadagi profil qatorida ism ostida rol ko'rsatiladi.
 * Bazadagi rollar: `user` va `admin`.
 */
return new class extends Migration
{
    private const KEYS = [
        'Student'       => ['uz' => 'Talaba',      'ru' => 'Студент',       'en' => 'Student'],
        'Administrator' => ['uz' => 'Administrator', 'ru' => 'Администратор', 'en' => 'Administrator'],
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
