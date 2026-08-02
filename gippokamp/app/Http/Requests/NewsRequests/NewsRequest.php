<?php

namespace App\Http\Requests\NewsRequests;

use App\Enums\ResponseError;
use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Str;

class NewsRequest extends FormRequest
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
            'slug' => ['nullable'],
            'photo' => ['required', 'string'],
            'title' => ['required', 'array'],
            'description' => ['required', 'array'],
            'actual' => ['required', 'boolean'],
            'date' => ['required', 'date_format:Y-m-d H:i:s'],
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'slug' => Str::slug($this->get('title')['uz'])
        ]);
    }

    public function messages()
    {
        return [
            'required' => trans('validation.required', [], request()->lang),
            'string' => trans('validation.string', [], request()->lang),
            'array' => trans('validation.array', [], request()->lang),
            'boolean' => trans('validation.boolean', [], request()->lang),
            'timestamps' => trans('validation.date', [], request()->lang),
        ];
    }
    public function failedValidation(Validator $validator)
    {
        $errors = $validator->errors();

        $response = $this->errorResponse(400, __(ResponseError::ERROR_400->value), 400, $errors->messages());

        throw new HttpResponseException($response);
    }
}
