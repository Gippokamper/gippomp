<?php

namespace App\Http\Controllers\API\v1\Backend\User;

use App\Models\UserSave;
use Illuminate\Http\Request;

/**
 * Saqlangan materiallar — maqola, video, yangilik.
 *
 * Tur nomi tashqarida qisqa ("article"), bazada esa to'liq sinf saqlanadi.
 * Mijoz istalgan sinf nomini yubora olmaydi: ro'yxat `UserSave::TYPES` da.
 */
class SaveController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Saqlanganlar ro'yxati. `type` berilsa — faqat o'sha tur.
     * Eng oxirgi saqlangani birinchi bo'ladi.
     */
    public function index(Request $request)
    {
        $type = (string) $request->get('type');

        $saves = UserSave::with('savable')
            ->where('user_id', auth('sanctum')->id())
            ->when($type !== '', function ($query) use ($type) {
                $query->where('savable_type', UserSave::classFor($type) ?? '');
            })
            ->orderByDesc('created_at')
            ->paginate($request->get('perPage') ?? 20);

        $items = collect($saves->items())
            // O'chirilgan material saqlanganlar ro'yxatida osilib qolmasin.
            ->filter(fn ($save) => $save->savable !== null)
            ->map(fn ($save) => [
                'id'         => (int) $save->id,
                'type'       => UserSave::typeFor($save->savable_type),
                'saved_at'   => $save->created_at,
                'item'       => $this->present($save),
            ])
            ->values();

        return $this->successResponse('success', [
            'data' => $items,
            'meta' => [
                'current_page' => $saves->currentPage(),
                'last_page'    => $saves->lastPage(),
                'total'        => $saves->total(),
            ],
        ]);
    }

    /** Saqlash / bekor qilish — bitta chaqiruv holatni almashtiradi. */
    public function toggle(string $type, int $id)
    {
        $class = UserSave::classFor($type);

        if (!$class) {
            return $this->errorResponse(422, 'Unknown type', 422);
        }

        if (!$class::query()->whereKey($id)->exists()) {
            return $this->errorResponse(404, 'Not found', 404);
        }

        $save = UserSave::firstOrNew([
            'user_id'      => auth('sanctum')->id(),
            'savable_type' => $class,
            'savable_id'   => $id,
        ]);

        if ($save->exists) {
            $save->delete();
            return $this->successResponse('success', ['saved' => false]);
        }

        $save->save();

        return $this->successResponse('success', ['saved' => true]);
    }

    /**
     * Ro'yxatda ko'rsatish uchun eng zarur maydonlar. To'liq resurs emas —
     * maqolaning butun matni saqlanganlar ro'yxatiga kerak emas.
     */
    private function present(UserSave $save): array
    {
        $item = $save->savable;

        return [
            'id'   => (int) $item->id,
            'slug' => (string) ($item->slug ?? ''),
            'name' => (array) ($item->name ?? []),
            'paid' => (bool) ($item->paid ?? false),
            'link' => (string) ($item->link ?? ''),
            'photo' => (string) ($item->photo ?? ''),
        ];
    }
}
