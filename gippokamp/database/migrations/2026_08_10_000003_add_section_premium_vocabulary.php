<?php

use App\Models\Vocabulary;
use Illuminate\Database\Migrations\Migration;

/* Bo'lim tepasidagi "premium ma'lumot mavjud" xabari. */
return new class extends Migration
{
    private const KEYS = [
        'This section contains premium information' => [
            'uz' => 'Ushbu bo\'limda premium ma\'lumot mavjud',
            'ru' => 'В этом разделе есть премиум-информация',
            'en' => 'This section contains premium information',
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
