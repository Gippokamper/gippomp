<?php

namespace App\Services;

use App\Models\Quiz;
use App\Models\UserQuizCompletion;
use Illuminate\Support\Facades\DB;

/**
 * Test bo'limlari daraxtini bitta javobda yig'adi.
 *
 * Nega Eloquent'ning `with('childQuiz.childQuiz')` usuli emas: u har bir daraja
 * uchun alohida yozib chiqishni talab qiladi, ya'ni chuqurlik kodga qattiq
 * bog'lanadi (ilgari 2 daraja edi). Bu yerda hamma yozuv bir marta o'qiladi va
 * daraxt PHP tomonda yig'iladi — daraja soni cheklanmagan, so'rovlar soni esa
 * daraxt kattaligiga bog'liq emas.
 */
class QuizTreeService
{
    /** Sikldan (A -> B -> A) himoya: shundan chuqur ketmaydi. */
    private const MAX_DEPTH = 25;

    /**
     * @return array<int, array> Ildiz tugunlar ro'yxati.
     */
    public function tree(?int $userId = null): array
    {
        $quizzes = Quiz::orderBy('sort')->get(['id', 'slug', 'sort', 'name', 'info'])->keyBy('id');

        if ($quizzes->isEmpty()) {
            return [];
        }

        $edges       = $this->edges();
        $ownTotals   = $this->questionTotals();
        $ownSolved   = $userId ? $this->solvedTotals($userId) : [];
        $completed   = $userId ? $this->completedIds($userId) : [];

        // Ildiz — hech kimning bolasi bo'lmagan bo'limlar.
        $childIds = [];
        foreach ($edges as $children) {
            foreach ($children as $childId) {
                $childIds[$childId] = true;
            }
        }

        $roots = $quizzes->keys()->filter(fn ($id) => !isset($childIds[$id]))->values();

        $build = function (int $id, array $path) use (
            &$build, $quizzes, $edges, $ownTotals, $ownSolved, $completed
        ) {
            $quiz = $quizzes->get($id);

            if (!$quiz || isset($path[$id]) || count($path) >= self::MAX_DEPTH) {
                return null;
            }

            $path[$id] = true;

            $children = [];
            foreach ($edges[$id] ?? [] as $childId) {
                $child = $build($childId, $path);
                if ($child !== null) {
                    $children[] = $child;
                }
            }

            $total = $ownTotals[$id] ?? 0;
            $used  = min($ownSolved[$id] ?? 0, $total);

            foreach ($children as $child) {
                $total += $child['total'];
                $used  += $child['used'];
            }

            $done = isset($completed[$id]);

            return [
                'id'       => $id,
                'slug'     => (string) $quiz->slug,
                'name'     => (array) $quiz->name,
                'info'     => (array) $quiz->info,
                // Bo'lim o'zida savol bloklari bormi — bosilganda testga o'tadimi.
                'testable' => ($ownTotals[$id] ?? 0) > 0,
                'total'    => $total,
                // Belgilangan bo'lim to'liq yechilgan deb ko'rsatiladi.
                'used'     => $done ? $total : $used,
                'done'     => $done,
                'children' => $children,
            ];
        };

        return $roots
            ->map(fn ($id) => $build((int) $id, []))
            ->filter()
            ->values()
            ->all();
    }

    /**
     * Bo'lim va uning butun ostki daraxtini "bajarildi" deb belgilaydi.
     * Belgilangach, hamma bolasi belgilangan ota-bo'limlar ham belgilanadi —
     * aks holda ota qatorda yarim belgilangan holat qolib ketardi.
     */
    public function complete(int $userId, int $quizId): void
    {
        $ids = $this->subtreeIds($quizId);

        $rows = array_map(fn ($id) => [
            'user_id'    => $userId,
            'quiz_id'    => $id,
            'created_at' => now(),
            'updated_at' => now(),
        ], $ids);

        // insertOrIgnore — unique(user_id, quiz_id) tufayli takror belgilash xato bermaydi.
        DB::table('user_quiz_completions')->insertOrIgnore($rows);

        $this->syncAncestors($userId, $quizId);
    }

    /**
     * Belgini bo'lim va ostki daraxtidan olib tashlaydi. Ota-bo'limlar ham
     * belgisiz qoladi: ichida bajarilmagan bo'lim bo'lsa, ota "bajarildi" emas.
     */
    public function uncomplete(int $userId, int $quizId): void
    {
        $ids = array_merge($this->subtreeIds($quizId), $this->ancestorIds($quizId));

        UserQuizCompletion::where('user_id', $userId)
            ->whereIn('quiz_id', $ids)
            ->delete();
    }

    /** parent_id => [child_id, ...], sort bo'yicha. */
    private function edges(): array
    {
        $rows = DB::table('quiz_has_quizzes')
            ->orderBy('sort')
            ->get(['parent_quiz_id', 'child_quiz_id']);

        $edges = [];
        foreach ($rows as $row) {
            $edges[(int) $row->parent_quiz_id][] = (int) $row->child_quiz_id;
        }

        return $edges;
    }

    /** quiz_id => o'z bloklaridagi savollar soni. */
    private function questionTotals(): array
    {
        $rows = DB::table('question_blocks')
            ->join('question_block_has_questions', 'question_blocks.id', '=', 'question_block_has_questions.block_id')
            ->where('question_blocks.blockable_type', Quiz::class)
            ->groupBy('question_blocks.blockable_id')
            ->select('question_blocks.blockable_id', DB::raw('COUNT(*) as total'))
            ->pluck('total', 'blockable_id');

        return $rows->map(fn ($v) => (int) $v)->all();
    }

    /**
     * quiz_id => foydalanuvchi yechgan savollar soni.
     *
     * Bir blokni bir necha marta yechish mumkin, shuning uchun blok bo'yicha eng
     * yaxshi urinish olinadi — urinishlarni qo'shsak, son savol sonidan oshib ketardi.
     */
    private function solvedTotals(int $userId): array
    {
        $rows = DB::table('question_blocks')
            ->join('user_test_attempts', 'question_blocks.id', '=', 'user_test_attempts.block_id')
            ->where('question_blocks.blockable_type', Quiz::class)
            ->where('user_test_attempts.user_id', $userId)
            ->groupBy('question_blocks.blockable_id', 'question_blocks.id')
            ->select(
                'question_blocks.blockable_id',
                DB::raw('MAX(user_test_attempts.right_answer + user_test_attempts.wrong_answer + user_test_attempts.help_answer) as solved')
            )
            ->get();

        $totals = [];
        foreach ($rows as $row) {
            $totals[(int) $row->blockable_id] = ($totals[(int) $row->blockable_id] ?? 0) + (int) $row->solved;
        }

        return $totals;
    }

    /** @return array<int, true> */
    private function completedIds(int $userId): array
    {
        return UserQuizCompletion::where('user_id', $userId)
            ->pluck('quiz_id')
            ->flip()
            ->map(fn () => true)
            ->all();
    }

    /** Bo'limning o'zi + barcha avlodlari. */
    private function subtreeIds(int $quizId): array
    {
        $edges = $this->edges();
        $seen  = [];
        $stack = [[$quizId, 0]];

        while ($stack) {
            [$id, $depth] = array_pop($stack);

            if (isset($seen[$id]) || $depth >= self::MAX_DEPTH) {
                continue;
            }

            $seen[$id] = true;

            foreach ($edges[$id] ?? [] as $childId) {
                $stack[] = [$childId, $depth + 1];
            }
        }

        return array_keys($seen);
    }

    /** Bo'limning barcha ota-bobolari (o'zisiz). */
    private function ancestorIds(int $quizId): array
    {
        $parents = [];
        foreach ($this->edges() as $parentId => $children) {
            foreach ($children as $childId) {
                $parents[$childId][] = $parentId;
            }
        }

        $seen  = [];
        $stack = [[$quizId, 0]];

        while ($stack) {
            [$id, $depth] = array_pop($stack);

            if ($depth >= self::MAX_DEPTH) {
                continue;
            }

            foreach ($parents[$id] ?? [] as $parentId) {
                if (!isset($seen[$parentId])) {
                    $seen[$parentId] = true;
                    $stack[] = [$parentId, $depth + 1];
                }
            }
        }

        return array_keys($seen);
    }

    /** Hamma bolasi belgilangan ota-bo'limni ham belgilaydi (pastdan yuqoriga). */
    private function syncAncestors(int $userId, int $quizId): void
    {
        $edges     = $this->edges();
        $ancestors = $this->ancestorIds($quizId);

        if (!$ancestors) {
            return;
        }

        // Yaqin ota birinchi bo'lishi uchun — pastdan yuqoriga ko'tarilamiz.
        $marked = UserQuizCompletion::where('user_id', $userId)->pluck('quiz_id')->flip();

        $changed = true;
        while ($changed) {
            $changed = false;

            foreach ($ancestors as $ancestorId) {
                if ($marked->has($ancestorId)) {
                    continue;
                }

                $children = $edges[$ancestorId] ?? [];

                if (!$children) {
                    continue;
                }

                $allDone = collect($children)->every(fn ($childId) => $marked->has($childId));

                if ($allDone) {
                    UserQuizCompletion::firstOrCreate(['user_id' => $userId, 'quiz_id' => $ancestorId]);
                    $marked->put($ancestorId, true);
                    $changed = true;
                }
            }
        }
    }
}
