<?php

namespace App\Http\Requests\UserRequests;

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

class UserCreateRequest extends FormRequest
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
            'firstname' => ['required', 'string', 'max:55', 'min:2'],
            'phone' => ['required', 'string', 'unique:users,phone', 'max:25'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'ip_address' => ['string'],
            'gender' => ['string'],
            'profession' => ['string'],
            'role' => ['string']
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'ip_address' => \request()->ip(),
            'gender' => GenderType::Male->value,
            'profession' => ProfessionType::Student->value,
            'role' => 'user'
        ]);
    }

    public function messages()
    {
        return [
            'required' => trans('validation.required', [], request()->lang),
            'string' => trans('validation.string', [], request()->lang),
        ];
    }

    public function failedValidation(Validator $validator)
    {
        $errors = $validator->errors();

        $response = $this->errorResponse(
            ResponseError::ERROR_400->name,
            trans(ResponseError::ERROR_400->value, [], request()->lang ?? config('app.locale')),
         Response::HTTP_BAD_REQUEST, $errors->messages());

        throw new HttpResponseException($response);
    }
}
