<?php

namespace App\Services;

use App\Enums\ResponseError;
use App\Http\Requests\FolderRequests\FolderRequest;
use App\Models\Article;
use App\Models\Folder;
use App\Models\Video;
use Illuminate\Support\Str;

class FolderService extends BaseService
{
    public function store($request)
    {
        try {
            $folder = Folder::create($request);
            $folder->parentFolder()->attach($request['folder_ids']);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $folder];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => ResponseError::ERROR_400->name, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function update($request, $id)
    {
        try {
            $folder = Folder::findOrFail($id);
            $folder->update($request);
            $folder->parentFolder()->sync($request['folder_ids']);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $folder];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => ResponseError::ERROR_400->name, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }
    public function destroy(int $id)
    {
        try {
            $folder = Folder::findOrFail($id);
            $folder->parentFolder()->detach();
            $folder->childFolder()->detach();
            $folder->questions()->detach();
            $folder->delete();
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => ResponseError::ERROR_400->name, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }
    public function bulk_destroy(array $request)
    {
        foreach ($request['ids'] as $id)
        {
            $this->destroy($id);
        }
        return ['status' => true, 'message' => ResponseError::NO_ERROR->value];
    }
}
