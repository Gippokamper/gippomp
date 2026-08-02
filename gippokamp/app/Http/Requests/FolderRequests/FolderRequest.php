<?php

namespace App\Http\Requests\FolderRequests;

use App\Enums\ResponseError;
use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Str;


class FolderRequest extends FormRequest
{
    use ApiResponse;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'slug' => ['nullable', 'string'],
            'folder_ids' => ['nullable', 'array', 'exists:folders,id'],
//            'sort' => ['nullable', 'array'],
            'name' => ['required', 'array'],
//            'description' => ['required', 'array'],
//            'folder_ids_with_sort' => ['nullable'],
        ];
    }

//    public function withValidator($validator)
//    {
//        $folderIds = $this->get('folder_ids');
//        $sort = $this->get('sort');
//        if (!is_null($folderIds) && !is_null($sort)) {
//            $validator->after(function ($validator) {
//                if (count($this->get('folder_ids')) !== count($this->get('sort'))) {
//                    $validator->errors()->add('folder_ids', 'The count of folder_ids and sort must be the same.');
//                }
//            });
//        }
//    }

    protected function prepareForValidation()
    {
//        $folderIds = $this->get('folder_ids');
//        $sort = $this->get('sort');
//        $folderIdsWithSort = [];
//        if (!is_null($folderIds) && !is_null($sort)){
//            foreach ($folderIds as $index => $folderId) {
//                $folderIdsWithSort[$folderId] = ['sort' => $sort[$index]];
//            }
//        }
        $this->merge([
            'slug' => Str::slug($this->get('name')['uz']),
//            'folder_ids_with_sort' => $folderIdsWithSort
        ]);
    }

    public function messages()
    {
        return [
            'required' => trans('validation.required', [], request()->lang),
            'array' => trans('validation.array', [], request()->lang),
            'exists' => trans('validation.exists', [], request()->lang),
        ];
    }

    public function failedValidation(Validator $validator)
    {
        $errors = $validator->errors();

        $response = $this->errorResponse(400, __(ResponseError::ERROR_400->value),400, $errors->messages());

        throw new HttpResponseException($response);
    }
}
