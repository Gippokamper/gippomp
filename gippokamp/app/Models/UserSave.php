<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class UserSave extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'savable_type',
        'savable_id',
    ];

    /**
     * Tashqarida qisqa nom ishlatiladi ("article"), bazada esa to'liq sinf.
     * Ro'yxat oldindan belgilangan — mijoz istalgan modelni yubora olmasin.
     */
    public const TYPES = [
        'article' => Article::class,
        'video'   => Video::class,
        'news'    => News::class,
    ];

    public static function classFor(string $type): ?string
    {
        return self::TYPES[$type] ?? null;
    }

    public static function typeFor(string $class): ?string
    {
        return array_search($class, self::TYPES, true) ?: null;
    }

    public function savable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Joriy foydalanuvchi shu turdan nimalarni saqlaganini qaytaradi
     * (kalit — id). Natija so'rov davomida eslab qolinadi: aks holda 12 ta
     * videolik ro'yxatda 12 ta ortiqcha so'rov ketardi.
     *
     * @return array<int, int> id => id
     */
    public static function savedIds(string $class): array
    {
        static $cache = [];

        $userId = auth('sanctum')->id();

        if (!$userId) {
            return [];
        }

        $key = $userId . '|' . $class;

        if (!array_key_exists($key, $cache)) {
            $cache[$key] = self::where('user_id', $userId)
                ->where('savable_type', $class)
                ->pluck('savable_id')
                ->flip()
                ->all();
        }

        return $cache[$key];
    }

    /** Shu material joriy foydalanuvchida saqlanganmi. */
    public static function isSaved(string $class, int $id): bool
    {
        return isset(self::savedIds($class)[$id]);
    }
}
