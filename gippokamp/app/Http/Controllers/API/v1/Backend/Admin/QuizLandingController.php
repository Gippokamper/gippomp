<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;

use App\Http\Requests\QuizLandingRequest;
use App\Http\Resources\QuizLandingResource;
use App\Models\QuizLanding;
use App\Traits\MediaTrait;
use Illuminate\Http\Request;

class QuizLandingController extends AdminBaseController
{
    use MediaTrait;
    public function __construct()
    {
        parent::__construct();
    }

    public function index(Request $request)
    {
        $quiz = QuizLanding::orderBy('id', 'desc')
            ->paginate($request->get('perPage') ?? 12);
        return QuizLandingResource::collection($quiz);
    }

    public function store(QuizLandingRequest $request)
    {
        try {
            $request = $request->validated();
            $quiz = QuizLanding::create($request);
            return $this->successResponse('success', QuizLandingResource::make($quiz));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function show(int $id)
    {
        try {
            $quiz = QuizLanding::findOrFail($id);
            return $this->successResponse('success', QuizLandingResource::make($quiz));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function update(QuizLandingRequest $request, $id)
    {
        try {
            $request = $request->validated();
            $quiz = QuizLanding::findOrFail($id);
            $quiz->update($request);
            return $this->successResponse('success', QuizLandingResource::make($quiz));
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }
    public function destroy($id)
    {
        try {
            $quiz = QuizLanding::findOrFail($id);
            $quiz->delete();
            return $this->successResponse('success', []);
        }catch (\Exception $e){
            return $this->errorResponse(404, $e->getMessage(), 404);
        }
    }

    public function bulk_destroy(Request $request)
    {
        try {
            foreach ($request->get('ids') as $id) {
                $this->destroy($id);
            }
            return $this->successResponse('success', []);
        } catch (\Exception $e) {
            return $this->errorResponse(500, $e->getMessage(), 500);
        }
    }
}
