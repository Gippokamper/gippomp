<?php

namespace App\Http\Controllers\API\v1\Backend\User;

use App\Enums\ResponseError;
use App\Http\Requests\ArticleRequests\LaboratoryDeleteRequest;
use App\Http\Requests\ArticleRequests\ArticleRequest;
use App\Http\Requests\ArticleRequests\NewsDeleteRequest;
use App\Http\Requests\ArticleRequests\NewsRequest;
use App\Http\Resources\ArticleNotePhotoResource;
use App\Http\Resources\ArticleNoteTextResource;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\BlockResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ChapterResource;
use App\Http\Resources\DeviceResource;
use App\Http\Resources\FeedbackResource;
use App\Http\Resources\LaboratoryResource;
use App\Http\Resources\NewsResource;
use App\Http\Resources\QuestionResource;
use App\Http\Resources\QuizResource;
use App\Http\Resources\RegionResource;
use App\Http\Resources\StudyPlanResource;
use App\Http\Resources\TariffResource;
use App\Http\Resources\TermResource;
use App\Http\Resources\UniversityResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\VideoCategoryResource;
use App\Http\Resources\VideoResource;
use App\Models\Article;
use App\Models\ArticleNotePhoto;
use App\Models\ArticleNoteText;
use App\Models\ArticleRead;
use App\Models\Category;
use App\Models\Chapter;
use App\Models\Device;
use App\Models\Feedback;
use App\Models\Laboratory;
use App\Models\News;
use App\Models\QuestionBlock;
use App\Models\Quiz;
use App\Models\Region;
use App\Models\StudyPlan;
use App\Models\Tariff;
use App\Models\TariffTerm;
use App\Models\University;
use App\Models\Video;
use App\Models\VideoCategory;
use App\Services\ArticleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;

class DBDownloadController extends UserBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function export()
    {
//        Profile
        $user = auth('sanctum')->user();
        $data['/api/v1/dashboard/user/profile'] = UserResource::make($user->load('university', 'region', 'wallet'));

//        Device
        $user_id = auth('sanctum')->user()->id;
        $devices = Device::where('user_id', $user_id)->get();
        $data['/api/v1/dashboard/user/devices'] = DeviceResource::collection($devices);

//        News
        $news = News::orderBy('id')->where('actual', false)->get();
        $data['/api/v1/dashboard/user/news'] = NewsResource::collection($news);

//        Actual news
        $news = News::orderBy('id')->where('actual', true)->get();
        $data['/api/v1/dashboard/user/news?actual=1'] = NewsResource::collection($news);

//        Saved news
        $news = News::whereHas('savedByUsers', function ($q) use ($user) {
            $q->where('users.id', $user->id);
        })->orderBy('id')->get();
        $data['/api/v1/dashboard/user/news?saved=1'] = NewsResource::collection($news);

//        Feedback
        $feedback = Feedback::with(['article', 'block', 'question', 'messages', 'chapter'])
            ->where('user_id', auth('sanctum')->user()->id)
            ->get();
        $data['/api/v1/dashboard/user/feedback'] = FeedbackResource::collection($feedback);

//        Categories
        $categories = Category::whereDoesntHave('parentCategory')->orderBy('sort')->get();
        $data['/api/v1/dashboard/user/categories'] = CategoryResource::collection($categories);

//        Categories single
        foreach (Category::all() as $category){
            $category = Category::with(['parentCategory', 'childCategory', 'articles'])->firstWhere('slug', $category->slug);
            $data['/api/v1/dashboard/user/categories/' . $category->slug] = CategoryResource::make($category);
        }

//        Article
        $articles = Article::orderBy('id')->get();
        $data['/api/v1/dashboard/user/articles'] = ArticleResource::collection($articles);

//        Article single
        foreach ($articles as $article){
            $article = Article::with(['categories', 'chapters', 'blocks'])->firstWhere('slug', $article->slug);
            $data['/api/v1/dashboard/user/articles/' . $article->slug] = ArticleResource::make($article);
        }

//        Video Category
        $video_categories = VideoCategory::orderBy('id')->get();
        $data['/api/v1/dashboard/user/video_categories'] = VideoCategoryResource::collection($video_categories);

//        Video Category single
        foreach ($video_categories as $video_category){
            $video_category = VideoCategory::with(['parentCategory', 'childCategory', 'videos'])->firstWhere('slug', $video_category->slug);
            $data['/api/v1/dashboard/user/video_categories/' . $video_category->slug] = VideoCategoryResource::make($video_category);
        }

//        Terms
        $terms = TariffTerm::orderBy('id')->get();
        $data['/api/v1/dashboard/user/terms'] = TermResource::collection($terms);

//        Tariffs
        $tariffs = Tariff::with('term')->orderBy('id')->get();
        $data['/api/v1/dashboard/user/tariffs'] = TariffResource::collection($tariffs);

//        Regions
        $regions = Region::orderBy('id')->get();
        $data['/api/v1/dashboard/user/regions'] = RegionResource::collection($regions);

//        University
        $universities = University::orderBy('id')->get();
        $data['/api/v1/dashboard/user/universities'] = UniversityResource::collection($universities);

//        Article Note Photo
        $article_note_photos = ArticleNotePhoto::orderBy('id')->get();
        foreach ($article_note_photos as $article_note_photo){
            $article_note_photo = ArticleNotePhoto::findOrFail($article_note_photo->id);
            $data['/api/v1/dashboard/user/article_note_photos/' . $article_note_photo->id] = ArticleNotePhotoResource::make($article_note_photo);
        }

//        Article Note Text
        $article_note_texts = ArticleNoteText::orderBy('id')->get();
        foreach ($article_note_texts as $article_note_text){
            $article_note_text = ArticleNoteText::findOrFail($article_note_text->id);
            $data['/api/v1/dashboard/user/article_note_text/' . $article_note_text->id] = ArticleNoteTextResource::make($article_note_text);
        }

//        Chapters
        $chapters = Chapter::orderBy('id')->get();
        $data['/api/v1/dashboard/user/chapters'] = ChapterResource::collection($chapters);

//        Chapters single
        foreach ($chapters as $chapter){
            $chapter = Chapter::findOrFail($chapter->id);
            $data['/api/v1/dashboard/user/chapters/' . $chapter->id] = ChapterResource::make($chapter);
        }

//        Videos
        $videos = Video::orderBy('id')->get();
        $data['/api/v1/dashboard/user/videos'] = VideoResource::collection($videos);

//        Videos single
        foreach ($videos as $video){
            $video = Video::with(['categories'])->firstWhere('slug', $video->slug);
            $data['/api/v1/dashboard/user/videos/' . $video->slug] = VideoResource::make($video);
        }

//        Study Pan
        $plans = StudyPlan::with('childPlan.childPlan')
            ->whereDoesntHave('parentPlan')
            ->get();
        $data['/api/v1/dashboard/user/study_plan'] = StudyPlanResource::collection($plans);

//         Study Plan single
        foreach (StudyPlan::all() as $plan){
            $plan = StudyPlan::with(['childPlan.childPlan', 'childPlan.articles', 'childPlan.blocks.questions', 'articles', 'blocks.questions'])->firstWhere('slug', $plan->slug);
            $data['/api/v1/dashboard/user/study_plan/' . $plan->slug] = StudyPlanResource::make($plan);
        }

//        Quiz
        $quizzes = Quiz::with('childQuiz.childQuiz', 'blocks')
            ->whereDoesntHave('parentQuiz')
            ->get();
        $data['/api/v1/dashboard/user/quizzes'] = QuizResource::collection($quizzes);

//         Quiz single
        foreach (Quiz::all() as $quiz){
            $quiz = Quiz::with(['childQuiz.childQuiz', 'childQuiz.blocks.questions', 'blocks.questions'])->firstWhere('slug', $quiz->slug);
            $data['/api/v1/dashboard/user/quizzes/' .  $quiz->slug] = QuizResource::make($quiz);
        }

//        Laboratory
        $laboratories = Laboratory::orderBy('id')->get();
        $data['/api/v1/dashboard/user/laboratory'] = LaboratoryResource::collection($laboratories);

//         Laboratory single
        foreach ($laboratories as $laboratory){
            $laboratory = Laboratory::findOrFail($laboratory->id);
            $data['/api/v1/dashboard/user/laboratory/' .  $laboratory->id] = LaboratoryResource::make($laboratory);
        }

//        User Test Attempt
        $blocks = QuestionBlock::with(['questions'])->get();
        foreach ($blocks as $block){
            $block = QuestionBlock::with(['questions.answers'])->find($block->id);
            $data['/api/v1/dashboard/user/user_test_attempt/' .  $block->id . '/start'] = [
                'attempt_question' => BlockResource::make($block)
            ];
        }

        return $this->successResponse('success', $data);
    }
}
