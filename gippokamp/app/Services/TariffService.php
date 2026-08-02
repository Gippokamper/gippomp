<?php

namespace App\Services;

use App\Enums\ResponseError;
use App\Models\Answer;
use App\Models\Article;
use App\Models\Question;
use App\Models\Tariff;
use App\Models\UserTariff;
use Illuminate\Support\Str;

class TariffService extends BaseService
{
    public function store($request)
    {
        try {
            $tariff = Tariff::create($request);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $tariff];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function update($request, $id)
    {
        try {
            $tariff = Tariff::findOrFail($id);
            $tariff->update($request);
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value, 'data' => $tariff];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => ResponseError::ERROR_400->name, 'message' => $e->getMessage(), 'httpCode' => 400];
        }
    }

    public function destroy(int $id)
    {
        try {
            if(!UserTariff::where('tariff_id', $id)->exists()){
                $tariff = Tariff::findOrFail($id);
                $this->delete(null, null, null, $tariff->photo);
                $tariff->delete();
            }
            return ['status' => true, 'message' => ResponseError::NO_ERROR->value];
        } catch (\Exception $e) {
            return ['status' => false, 'code' => 400, 'message' => $e->getMessage(), 'httpCode' => 400];
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
