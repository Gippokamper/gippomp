<?php

namespace App\Http\Controllers\API\v1\Backend\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\VocabularyResource;
use App\Models\Vocabulary;
use Illuminate\Http\Request;

class VocabularyController extends Controller
{
    public function index(Request $request)
    {
        $vocabulary = Vocabulary::orderBy('id')->get();
        $formattedData = [];
        foreach ($vocabulary as $vocab) {
            $resourceData = (new VocabularyResource($vocab))->toArray($request);
            $formattedData = array_merge($formattedData, $resourceData);
        }
        return response()->json($formattedData);
    }
}
