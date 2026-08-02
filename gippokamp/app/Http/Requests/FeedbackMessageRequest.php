<?php

namespace App\Http\Requests;

use App\Enums\GenderType;
use App\Enums\ProfessionType;
use App\Enums\ResponseError;
use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class FeedbackMessageRequest extends FormRequest
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
            'author' => ['nullable', 'string'],
            'message' => ['required', 'string'],
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'author' => auth('sanctum')->user()->getRoleAttribute(),
        ]);
    }

    public function messages()
    {
        return [
            'string' => trans('validation.string', [], request()->lang),
            'array' => trans('validation.array', [], request()->lang),
            'integer' => trans('validation.integer', [], request()->lang),
            'in' => trans('validation.in', [], request()->lang),
        ];
    }

    public function failedValidation(Validator $validator)
    {
        $errors = $validator->errors();

        $response = $this->errorResponse(400, __(ResponseError::ERROR_400->value), 400, $errors->messages());

        throw new HttpResponseException($response);
    }
}
