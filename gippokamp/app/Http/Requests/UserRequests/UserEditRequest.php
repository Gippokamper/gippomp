<?php

namespace App\Http\Requests\UserRequests;

use App\Enums\GenderType;
use App\Enums\ResponseError;
use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class UserEditRequest extends FormRequest
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
            'firstname' => ['string', 'max:55', 'min:2'],
            'lastname' => ['string', 'max:55', 'min:2'],
//            'phone' => ['string', 'unique:users,phone', 'max:25'],
            'email' => ['string', Rule::unique('users', 'email')->ignore($this->route('uuid'), 'uuid')],
            'gender' => ['string', Rule::in('male', 'female')],
            'profession' => ['string', Rule::in('student', 'doctor', 'teacher')],
            'graduation_year' => ['numeric', 'min:0'],
            'university_id' => ['nullable', 'integer'],
            'interests' => ['string'],
            'birthday' => ['date'],
            'region_id' => ['nullable', 'exists:regions,id'],
            'province' => ['nullable', 'string'],
//            'status' => ['numeric', Rule::in(1, 0)],
//            'current_password' => ['string', 'min:9'],
//            'password' => ['string', 'min:9', 'confirmed'],
            'image' => ['nullable', 'string']
        ];
    }

    public function messages()
    {
        return [
            'required' => trans('validation.required', [], request()->lang),
            'numeric' => trans('validation.numeric', [], request()->lang),
            'email' => trans('validation.email', [], request()->lang),
            'date' => trans('validation.date', [], request()->lang),
            'string' => trans('validation.string', [], request()->lang),
            'in' => trans('validation.in', [], request()->lang),
            'exists' => trans('validation.in', [], request()->lang)
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
