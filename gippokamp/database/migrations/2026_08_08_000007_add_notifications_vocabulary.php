<?php

use App\Models\Vocabulary;
use Illuminate\Database\Migrations\Migration;

/* Bildirishnomalar oynasining sarlavhasi. */
return new class extends Migration
{
    private const KEYS = [
        'Notifications' => ['uz' => 'Bildirishnomalar', 'ru' => 'Уведомления', 'en' => 'Notifications'],
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
