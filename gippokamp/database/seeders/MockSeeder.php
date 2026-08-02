<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Balance;
use App\Models\Category;
use App\Models\Chapter;
use App\Models\News;
use App\Models\StudyPlan;
use App\Models\Tariff;
use App\Models\TariffTerm;
use App\Models\User;
use App\Models\Video;
use App\Models\VideoCategory;
use App\Models\Vocabulary;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class MockSeeder extends Seeder
{
    /** Ko'p tilli maydon uchun qulaylik */
    private function ml(string $uz, string $ru, string $en): array
    {
        return ['uz' => $uz, 'ru' => $ru, 'en' => $en];
    }

    public function run(): void
    {
        $img = '/image/mock.png';

        // ---------- Lug'at (i18n tarjimalari) ----------
        $vocab = [
            'Videos' => $this->ml('Videolar', 'Видео', 'Videos'),
            'Login to profile' => $this->ml('Profilga kirish', 'Вход в профиль', 'Login to profile'),
            'Password' => $this->ml('Parol', 'Пароль', 'Password'),
            'Continue' => $this->ml('Davom etish', 'Продолжить', 'Continue'),
            'Registration' => $this->ml('Ro\'yxatdan o\'tish', 'Регистрация', 'Registration'),
            'News' => $this->ml('Yangiliklar', 'Новости', 'News'),
            'Tariffs' => $this->ml('Tariflar', 'Тарифы', 'Tariffs'),
            'Library' => $this->ml('Kutubxona', 'Библиотека', 'Library'),
            'Tests' => $this->ml('Testlar', 'Тесты', 'Tests'),
            'Settings' => $this->ml('Sozlamalar', 'Настройки', 'Settings'),
            'Purchase' => $this->ml('Sotib olish', 'Купить', 'Purchase'),
            'Enter' => $this->ml('Kirish', 'Войти', 'Enter'),
            'Passed' => $this->ml('To\'landi', 'Оплачено', 'Passed'),
            'UZS' => $this->ml('so\'m', 'сум', 'UZS'),
        ];
        foreach ($vocab as $key => $tr) {
            Vocabulary::updateOrCreate(['key' => $key], ['translation' => $tr]);
        }

        // ---------- Tariflar ----------
        $month = TariffTerm::create(['name' => $this->ml('1 oy', '1 месяц', '1 month'), 'month_count' => 1]);
        $year  = TariffTerm::create(['name' => $this->ml('1 yil', '1 год', '1 year'), 'month_count' => 12]);

        Tariff::create([
            'term_id' => $month->id, 'sort' => 1, 'photo' => $img,
            'name' => $this->ml('Standart', 'Стандарт', 'Standard'),
            'advantages' => $this->ml('Maqolalar va videolar', 'Статьи и видео', 'Articles and videos'),
            'price' => 4900000,
        ]);
        Tariff::create([
            'term_id' => $year->id, 'sort' => 2, 'photo' => $img,
            'name' => $this->ml('Premium', 'Премиум', 'Premium'),
            'advantages' => $this->ml('Barcha imkoniyatlar + testlar', 'Все возможности + тесты', 'Everything + tests'),
            'price' => 39900000,
        ]);

        // ---------- Yangiliklar ----------
        $newsItems = [
            ['anatomiya-yangiligi', 'Anatomiya bo\'yicha yangi maqola', 'Новая статья по анатомии', 'New anatomy article'],
            ['kardiologiya-test', 'Kardiologiya testlari qo\'shildi', 'Добавлены тесты по кардиологии', 'Cardiology tests added'],
            ['platforma-yangilik', 'Platformada yangilanish', 'Обновление платформы', 'Platform update'],
        ];
        foreach ($newsItems as $i => $n) {
            News::create([
                'slug' => $n[0],
                'photo' => $img,
                'title' => $this->ml($n[1], $n[2], $n[3]),
                'description' => $this->ml('Batafsil ma\'lumot shu yerda.', 'Подробная информация здесь.', 'Details here.'),
                'date' => Carbon::now()->subDays($i),
                'actual' => true,
            ]);
        }

        // ---------- Kategoriya + Maqolalar + Boblar ----------
        $category = Category::create([
            'slug' => 'anatomiya', 'sort' => 1,
            'name' => $this->ml('Anatomiya', 'Анатомия', 'Anatomy'), 'paid' => 0,
        ]);

        $articlesData = [
            ['umurtqa-pogonasi', 'Umurtqa pog\'onasi', 'Позвоночник', 'Spine'],
            ['yurak-tuzilishi', 'Yurak tuzilishi', 'Строение сердца', 'Heart structure'],
        ];
        foreach ($articlesData as $ai => $a) {
            $article = Article::create([
                'slug' => $a[0],
                'name' => $this->ml($a[1], $a[2], $a[3]),
                'paid' => 0,
            ]);
            DB::table('category_has_articles')->insert([
                'category_id' => $category->id, 'article_id' => $article->id, 'sort' => $ai + 1,
            ]);
            for ($c = 1; $c <= 2; $c++) {
                $chapter = Chapter::create([
                    'title' => $this->ml("$a[1] — bo'lim $c", "$a[2] — раздел $c", "$a[3] — part $c"),
                    'description' => $this->ml(
                        '<p>Bu namunaviy bob matni. Haqiqiy kontent serverdagi bazadan keladi.</p>',
                        '<p>Это пример текста раздела.</p>',
                        '<p>This is sample chapter text.</p>'
                    ),
                ]);
                DB::table('article_has_chapters')->insert([
                    'article_id' => $article->id, 'chapter_id' => $chapter->id, 'sort' => $c,
                ]);
            }
        }

        // ---------- Video kategoriya + Videolar ----------
        $videoCat = VideoCategory::create([
            'slug' => 'anatomiya-video', 'sort' => 1,
            'name' => $this->ml('Anatomiya videolari', 'Видео по анатомии', 'Anatomy videos'),
        ]);
        $videosData = [
            ['skelet-tizimi', 'Skelet tizimi', 'Скелетная система', 'Skeletal system'],
            ['muskul-tizimi', 'Muskul tizimi', 'Мышечная система', 'Muscular system'],
        ];
        foreach ($videosData as $vi => $v) {
            $video = Video::create([
                'slug' => $v[0],
                'name' => $this->ml($v[1], $v[2], $v[3]),
                'link' => 'https://vjs.zencdn.net/v/oceans.mp4',
            ]);
            DB::table('video_category_has_videos')->insert([
                'category_id' => $videoCat->id, 'video_id' => $video->id, 'sort' => $vi + 1,
            ]);
        }

        // ---------- O'quv rejalari ----------
        StudyPlan::create([
            'slug' => 'boshlangich-reja', 'sort' => 1,
            'name' => $this->ml('Boshlang\'ich reja', 'Начальный план', 'Beginner plan'),
            'info' => $this->ml('30 kunlik reja', 'План на 30 дней', '30-day plan'),
        ]);
        StudyPlan::create([
            'slug' => 'ilgor-reja', 'sort' => 2,
            'name' => $this->ml('Ilg\'or reja', 'Продвинутый план', 'Advanced plan'),
            'info' => $this->ml('60 kunlik reja', 'План на 60 дней', '60-day plan'),
        ]);

        // ---------- Foydalanuvchi uchun balans/to'lov tarixi ----------
        $user = User::where('phone', 998902223344)->first();
        if ($user) {
            foreach ([['Premium tarif', 39900000], ['Standart tarif', 4900000]] as $i => $b) {
                Balance::create([
                    'user_id' => $user->id,
                    'message' => json_encode($this->ml($b[0] . ' sotib olindi', $b[0] . ' куплен', $b[0] . ' purchased')),
                    'amount' => $b[1],
                ]);
            }
        }

        $this->command->info('Mock data qo\'shildi: lug\'at, tariflar, yangiliklar, maqolalar, videolar, rejalar.');
    }
}
