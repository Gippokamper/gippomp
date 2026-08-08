<?php

use App\Http\Controllers\API\v1\Auth\LoginController;
use App\Http\Controllers\API\v1\Auth\RegisterController;
use App\Http\Controllers\API\v1\Backend;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Role;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
// Xavfli operatsion route'lar — faqat autentifikatsiyalangan admin uchun.
Route::middleware(['sanctum.check', 'roles:admin'])->group(function () {
    Route::get('/optimize', function (){
        \Illuminate\Support\Facades\Artisan::call('route:clear');
        \Illuminate\Support\Facades\Artisan::call('cache:clear');
        \Illuminate\Support\Facades\Artisan::call('config:clear');
        \Illuminate\Support\Facades\Artisan::call('config:cache');
        \Illuminate\Support\Facades\Artisan::call('route:cache');
        return 'success';
    });

    Route::get('/action', [\App\Http\Controllers\TemporaryController::class, 'action']);
});

Route::middleware('api')->group(function () {
    Route::prefix('payment')->group(function () {
        // UpaySystem routes
        Route::post('/upay/check', [Backend\Payment\UpaySystemController::class, 'check']);
        Route::post('/upay/pay', [Backend\Payment\UpaySystemController::class, 'pay']);

        // Click routes
        Route::post('/click/check', [Backend\Payment\ClickController::class, 'check']);
        Route::post('/click/pay', [Backend\Payment\ClickController::class, 'pay']);

        // Payme route
        Route::post('/payme', [Backend\Payment\PaymeController::class, 'payme']);

        // Apelsin routes
        Route::get('/apelsin/check', [Backend\Payment\ApelsinController::class, 'check']);
        Route::post('/apelsin/pay', [Backend\Payment\ApelsinController::class, 'pay']);
    });
});

Route::group(['prefix' => 'v1'], function () {

    /* Auth */
    Route::post('/auth/login', [LoginController::class, 'login']);
    Route::post('/auth/logout', [LoginController::class, 'logout']);
    Route::post('/auth/register', [RegisterController::class, 'register']);

    Route::get('/phone/verification', [\App\Http\Controllers\API\v1\Auth\PhoneVerificationController::class, 'verification'])->name('verification');
    Route::post('/phone/verification', [\App\Http\Controllers\API\v1\Auth\PhoneVerificationController::class, 'verificationCheck'])->name('verificationCheck');

    Route::post('/forgot_password/send_code', [\App\Http\Controllers\API\v1\Auth\ForgotPasswordController::class, 'sendCode'])->middleware('throttle:3,10')->name('forgot_password.sendCode');
    Route::post('/forgot_password/check_code', [\App\Http\Controllers\API\v1\Auth\ForgotPasswordController::class, 'checkCode'])->middleware('throttle:5,10')->name('forgot_password.checkCode');
    Route::post('/forgot_password/new_password', [\App\Http\Controllers\API\v1\Auth\ForgotPasswordController::class, 'newPassword'])->middleware('throttle:5,10')->name('forgot_password.newPassword');

//            Vocabulary
    Route::get('/vocabulary', [Backend\User\VocabularyController::class, 'index'])->name('vocabulary.index');

    // DASHBOARD BLOCK
    Route::group(['middleware' => ['sanctum.check', 'phone.verified'], 'prefix' => 'dashboard'], function () {

//        Get permission
        Route::get('/permissions', [Backend\User\PermissionController::class, 'index'])->name('permissions');

//      Photo Upload
        Route::post('/photo_upload', [Backend\Admin\PhotoUploadController::class, 'upload'])->name('photo.upload');
        Route::post('/video_upload', [Backend\Admin\VideoUploadController::class, 'upload'])->name('video.upload');

        // ADMIN BLOCK
        Route::group(['middleware' => 'roles:admin', 'prefix' => 'admin', 'as' => 'admin'], function () {

//            User
            Route::get('/users/statistics', [Backend\Admin\UserController::class, 'statistics'])->name('users.statistics');
            // UserController'da store/destroy yo'q — apiResource ularni ham ro'yxatga
            // olgani uchun POST/DELETE 500 ("Method does not exist") qaytarardi.
            Route::apiResource('users', Backend\Admin\UserController::class)
                ->only(['index', 'show', 'update']);

//            Categories
            Route::delete('/child_relation/categories/categories/{id}', [Backend\Admin\CategoryController::class, 'has_categories_destroy'])->name('child_relation.has_categories_destroy');
            Route::delete('/child_relation/categories/articles/{id}', [Backend\Admin\CategoryController::class, 'has_articles_destroy'])->name('child_relation.has_articles_destroy');
            Route::delete('/categories/bulk_delete', [Backend\Admin\CategoryController::class, 'bulk_destroy'])->name('categories.bulk_destroy');
            Route::apiResource('categories', Backend\Admin\CategoryController::class);

//            Articles
            Route::delete('/child_relation/articles/chapters/{id}', [Backend\Admin\ArticleController::class, 'has_chapters_destroy'])->name('child_relation.has_chapters_destroy');
            Route::delete('/articles/bulk_delete', [Backend\Admin\ArticleController::class, 'bulk_destroy'])->name('articles.bulk_destroy');
            Route::apiResource('/articles', Backend\Admin\ArticleController::class);

//            Article Note Photo
            Route::delete('/article_note_photos/bulk_delete', [Backend\Admin\ArticleNotePhotoController::class, 'bulk_destroy'])->name('article_note_photos.bulk_delete');
            Route::apiResource('/article_note_photos', Backend\Admin\ArticleNotePhotoController::class);

//            Article Note Text
            Route::delete('/article_note_texts/bulk_delete', [Backend\Admin\ArticleNoteTextController::class, 'bulk_destroy'])->name('article_note_texts.bulk_delete');;
            Route::apiResource('/article_note_texts', Backend\Admin\ArticleNoteTextController::class);

//            Chapters
            Route::delete('/chapters/bulk_delete', [Backend\Admin\ChapterController::class, 'bulk_destroy'])->name('chapters.bulk_delete');;
            Route::apiResource('/chapters', Backend\Admin\ChapterController::class);

//            Video Category
            Route::delete('/child_relation/video_categories/video_categories/{id}', [Backend\Admin\VideoCategoryController::class, 'has_video_categories_destroy'])->name('child_relation.has_video_categories_destroy');
            Route::delete('/child_relation/video_categories/videos/{id}', [Backend\Admin\VideoCategoryController::class, 'has_videos_destroy'])->name('child_relation.has_videos_destroy');
            Route::delete('/video_categories/bulk_delete', [Backend\Admin\VideoCategoryController::class, 'bulk_destroy'])->name('video_categories.bulk_delete');
            Route::apiResource('/video_categories', Backend\Admin\VideoCategoryController::class);

//            Video
            Route::delete('/videos/bulk_delete', [Backend\Admin\VideoController::class, 'bulk_destroy'])->name('videos.bulk_destroy');
            Route::apiResource('/videos', Backend\Admin\VideoController::class);

//            News
            Route::delete('/news/bulk_delete', [Backend\Admin\NewsController::class, 'bulk_destroy'])->name('news.bulk_destroy');
            Route::apiResource('/news', Backend\Admin\NewsController::class);

//            Folder
            Route::delete('/folders/bulk_delete', [Backend\Admin\FolderController::class, 'bulk_destroy'])->name('folders.bulk_destroy');
            Route::get('/folders/{slug}/questions_string', [Backend\Admin\FolderController::class, 'questions_string'])->name('folders.questions_string');
            Route::apiResource('/folders', Backend\Admin\FolderController::class);

//            Question
            Route::delete('/questions/bulk_delete', [Backend\Admin\QuestionController::class, 'bulk_destroy'])->name('questions.bulk_destroy');
            Route::apiResource('/questions', Backend\Admin\QuestionController::class);

//            Question Block
            // QuestionBlockController'da index/show yo'q — GET so'rovlari 500 berardi.
            Route::apiResource('/question_blocks', Backend\Admin\QuestionBlockController::class)
                ->only(['store', 'update', 'destroy']);

//            Study Plan
            Route::delete('/study_plan/bulk_delete', [Backend\Admin\StudyPlanController::class, 'bulk_destroy'])->name('study_plan.bulk_destroy');
            Route::apiResource('/study_plan', Backend\Admin\StudyPlanController::class);

//            Quiz
            Route::delete('/quizzes/bulk_delete', [Backend\Admin\QuizController::class, 'bulk_destroy'])->name('quizzes.bulk_destroy');
            Route::apiResource('/quizzes', Backend\Admin\QuizController::class);

//            Tariff
            Route::delete('/tariffs/bulk_delete', [Backend\Admin\TariffController::class, 'bulk_destroy'])->name('tariffs.bulk_destroy');
            Route::get('/terms', [Backend\Admin\TariffController::class, 'terms'])->name('terms.index');
            Route::apiResource('/tariffs', Backend\Admin\TariffController::class);

//            Feedback
            Route::get('/feedback', [Backend\Admin\FeedbackController::class, 'index'])->name('feedback.index');
            Route::post('/feedback', [Backend\Admin\FeedbackController::class, 'store'])->name('feedback.store');
            Route::post('/feedback/{id}', [Backend\Admin\FeedbackController::class, 'store_message'])->name('feedback.store_message');

//            Feedback Notification
            Route::get('/notification/feedback', [Backend\Admin\FeedbackController::class, 'notification'])->name('feedback.notification');
            Route::post('/notification/feedback/is_read/{id}', [Backend\Admin\FeedbackController::class, 'is_read'])->name('feedback.is_read');

//            Vocabulary
            Route::delete('/vocabulary/bulk_delete', [Backend\Admin\VocabularyController::class, 'bulk_destroy'])->name('vocabulary.bulk_destroy');
            Route::apiResource('/vocabulary', Backend\Admin\VocabularyController::class);

//            Regions
            Route::get('/regions', [Backend\Admin\RegionController::class, 'index'])->name('regions.index');

//            University
            Route::get('/universities', [Backend\Admin\UniversityController::class, 'index'])->name('universities.index');

//            Laboratory
            Route::delete('/laboratory/bulk_delete', [Backend\Admin\LaboratoryController::class, 'bulk_destroy'])->name('laboratory.bulk_destroy');
            Route::apiResource('/laboratory', Backend\Admin\LaboratoryController::class);

//            Resume
            Route::get('/resume', [Backend\Admin\ResumeController::class, 'index'])->name('resume.index');
            Route::get('/resume/{id}', [Backend\Admin\ResumeController::class, 'show'])->name('resume.show');

//            Partners
            Route::delete('/partners/bulk_delete', [Backend\Admin\PartnerController::class, 'bulk_destroy'])->name('partners.bulk_destroy');
            Route::apiResource('/partners', Backend\Admin\PartnerController::class);

//            Photo Landing
            Route::apiResource('/photos_landing', Backend\Admin\PhotoLandingController::class)->except('store', 'destroy');

//            Video Landing
            Route::apiResource('/videos_landing', Backend\Admin\VideoLandingController::class)->except('store', 'destroy');

//            Video Landing
            Route::apiResource('/category_landing', Backend\Admin\CategoryLandingController::class);

//            Quiz Landing
            Route::delete('/quiz_landing/bulk_delete', [Backend\Admin\QuizLandingController::class, 'bulk_destroy'])->name('quiz_landing.bulk_destroy');
            Route::apiResource('/quiz_landing', Backend\Admin\QuizLandingController::class);

//            Feedback Site
            Route::get('/feedback_site', [Backend\Admin\FeedbackSiteController::class, 'index'])->name('feedback_site.index');
            Route::get('/feedback_site/{feedback_site}', [Backend\Admin\FeedbackSiteController::class, 'show'])->name('feedback_site.show');

//            Privacy Policy
            Route::get('/privacy_policy', [Backend\Admin\PrivacyPolicyController::class, 'show'])->name('privacy_policy.show');
            Route::put('/privacy_policy', [Backend\Admin\PrivacyPolicyController::class, 'update'])->name('privacy_policy.update');

        });

        // USER BLOCK
        Route::group(['middleware' => ['roles:user'], 'prefix' => 'user', 'as' => 'user'], function () {

//            Device
            Route::get('/devices', [Backend\User\DeviceController::class, 'index'])->name('devices.index');
            Route::delete('/devices/{id}', [Backend\User\DeviceController::class, 'destroy'])->name('devices.delete');

//            Device Token Update
            Route::put('/devices/{id}', [Backend\User\DeviceController::class, 'update'])->name('devices.update');

            Route::group(['middleware' => 'checkDeviceLimit'], function (){

//            Refresh token
                Route::get('/refresh_token', [\App\Http\Controllers\API\v1\Auth\RefreshTokenController::class, 'refresh'])->name('refresh');

//            Privacy Policy
                Route::get('/privacy_policy', [Backend\User\PrivacyPolicyController::class, 'show'])->name('privacy_policy.show');

//            Profile
                Route::get('/profile', [Backend\User\ProfileController::class, 'show'])->name('profile.show');
                Route::put('/profile', [Backend\User\ProfileController::class, 'update'])->name('profile.update');

//            Payment
                Route::get('/payments', [Backend\User\PaymentController::class, 'index'])->name('payments.index');

//            News
                Route::get('/news', [Backend\User\NewsController::class, 'index'])->name('news.index');
                Route::get('/news/{slug}', [Backend\User\NewsController::class, 'show'])->name('news.show');
                Route::post('/news/{id}/save', [Backend\User\NewsController::class, 'save'])->name('news.save');

//            Feedback
                Route::get('/feedback', [Backend\User\FeedbackController::class, 'index'])->name('feedback.index');
                Route::post('/feedback', [Backend\User\FeedbackController::class, 'store'])->name('feedback.store');
                Route::post('/feedback_site', [Backend\User\FeedbackController::class, 'storeSite'])->name('feedback_site.store');
                Route::post('/feedback/{id}', [Backend\User\FeedbackController::class, 'store_message'])->name('feedback.store_message');

//            Feedback Notification
                Route::get('/notification/feedback', [Backend\User\FeedbackController::class, 'notification'])->name('feedback.notification');
                Route::post('/notification/feedback/is_read/{id}', [Backend\User\FeedbackController::class, 'is_read'])->name('feedback.is_read');

//            Search
                Route::get('/search', [Backend\User\SearchController::class, 'search'])->name('search');

//            Categories
                Route::get('/categories', [Backend\User\CategoryController::class, 'index'])->name('categories.index');
                Route::get('/categories/{slug}', [Backend\User\CategoryController::class, 'show'])->name('categories.show');

//            Articles
                Route::get('/articles', [Backend\User\ArticleController::class, 'index'])->name('articles.index');

//            Video Category
                Route::get('/video_categories', [Backend\User\VideoCategoryController::class, 'index'])->name('video_categories.index');
                Route::get('/video_categories/{slug}', [Backend\User\VideoCategoryController::class, 'show'])->name('video_categories.show');

//            Tariffs
                Route::get('/terms', [Backend\User\TariffController::class, 'terms'])->name('terms.index');
                Route::get('/tariffs', [Backend\User\TariffController::class, 'index'])->name('tariffs.index');
                Route::get('/tariffs/history', [Backend\User\TariffController::class, 'history'])->name('tariffs.history');
                Route::get('/tariffs/{id}', [Backend\User\TariffController::class, 'buy'])->name('tariffs.buy');

//            Regions
                Route::get('/regions', [Backend\User\RegionController::class, 'index'])->name('regions.index');

//            University
                Route::get('/universities', [Backend\User\UniversityController::class, 'index'])->name('universities.index');

//                Study Plan
                Route::get('/study_plan', [Backend\User\StudyPlanController::class, 'index'])->name('study_plan.index');
                Route::get('/study_plan/{slug}', [Backend\User\StudyPlanController::class, 'show'])->name('study_plan.show');

//                  Quiz
                Route::get('/quizzes', [Backend\User\QuizController::class, 'index'])->name('quiz.index');
                // `tree` {slug} dan oldin turishi shart — aks holda slug sifatida tushunilardi.
                Route::get('/quizzes/tree', [Backend\User\QuizController::class, 'tree'])->name('quiz.tree');
                Route::post('/quizzes/{slug}/complete', [Backend\User\QuizController::class, 'complete'])->name('quiz.complete');
                Route::delete('/quizzes/{slug}/complete', [Backend\User\QuizController::class, 'uncomplete'])->name('quiz.uncomplete');
                Route::get('/quizzes/{slug}', [Backend\User\QuizController::class, 'show'])->name('quiz.show');

//            TARIFF
                Route::group(['middleware' => 'check.tariff'], function (){

//                  DB download
                    Route::get('/db_download', [Backend\User\DBDownloadController::class, 'export'])->name('db_download.export');

//                  Article
                    Route::get('/articles/{slug}', [Backend\User\ArticleController::class, 'show'])->name('articles.show');
                    Route::post('/articles/{id}/read', [Backend\User\ArticleController::class, 'read'])->name('articles.read');

//                  Article Note Photo
                    Route::get('/article_note_photos/{id}', [Backend\User\ArticleNotePhotoController::class, 'show'])->name('article_note_photos.show');

//                  Article Note Text
                    Route::get('/article_note_text/{id}', [Backend\User\ArticleNoteTextController::class, 'show'])->name('article_note_text.show');

//                  Chapters
                    Route::get('/chapters', [Backend\User\ChapterController::class, 'index'])->name('chapters.index');
                    Route::get('/chapters/{id}', [Backend\User\ChapterController::class, 'show'])->name('chapters.show');

//                  Video
                    Route::get('/videos', [Backend\User\VideoController::class, 'index'])->name('videos.index');
                    Route::get('/videos/{slug}', [Backend\User\VideoController::class, 'show'])->name('videos.show');

//                  Test start
                    Route::get('/user_test_attempt/{block_id}/start', [Backend\User\UserTestAttemptController::class, 'start'])->name('user_test_attempt.start');

//                  Test list
                    Route::get('/user_test_attempt', [Backend\User\UserTestAttemptController::class, 'index'])->name('user_test_attempt.index');

//                  Test Statistics
                    Route::get('/user_test_attempt/{block_id}/statistics', [Backend\User\UserTestAttemptController::class, 'statistics'])->name('user_test_attempt.statistics');

//                  Test Finish
                    Route::post('/user_test_attempt/{block_id}/finish', [Backend\User\UserTestAttemptController::class, 'finish'])->name('user_test_attempt.finish');

//                  Laboratory
                    Route::get('/laboratory', [Backend\User\LaboratoryController::class, 'index'])->name('laboratory.index');
                    Route::get('/laboratory/{id}', [Backend\User\LaboratoryController::class, 'show'])->name('laboratory.show');
                });
            });

        });
    });

});
