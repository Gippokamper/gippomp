<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;

use App\Enums\ResponseError;
use App\Http\Requests\ArticleRequests\ArticleDeleteRequest;
use App\Http\Requests\ArticleRequests\LaboratoryDeleteRequest;
use App\Http\Requests\ArticleRequests\ArticleRequest;
use App\Http\Requests\ArticleRequests\NewsDeleteRequest;
use App\Http\Requests\ArticleRequests\NewsRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\ResumeResource;
use App\Http\Resources\VacancyResource;
use App\Models\Article;
use App\Models\Resume;
use App\Models\Vacancy;
use App\Services\ArticleService;
use Illuminate\Http\Request;

class ResumeController extends AdminBaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $resume = Resume::with('vacancy')
            ->when($request->get('search'), function ($q) use ($request) {
                $q->where('full_name', 'like', '%' . $request->search . '%');
            })
            ->orderBy('id', 'desc')
            ->paginate($request->get('perPage') ?? 12);
        return ResumeResource::collection($resume);
    }

    public function show(int $id)
    {
        try {
            $resume = Resume::findOrFail($id);
            return $this->successResponse('success', ResumeResource::make($resume));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }
}
