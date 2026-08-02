<?php

namespace App\Enums;

enum ResponseError: string
{
    case NO_ERROR = 'errors.no_error';
    case ERROR_LOGIN = 'errors.ERROR_LOGIN'; // 'Login error.'
    case ERROR_102 = 'errors.ERROR_102'; // 'Bad credentials.'
    case ERROR_103 = 'errors.ERROR_103'; // 'Your email address is not verified'
    case ERROR_104 = 'errors.ERROR_104'; // 'Your phone number is not verified'
    case ERROR_105 = 'errors.ERROR_105'; // 'Your account is not verified'
    case ERROR_109 = 'errors.ERROR_109'; // 'Insufficient wallet balance'
    case ERROR_110 = 'errors.ERROR_110'; // 'Can't update this user role'

    case ERROR_201 = 'errors.ERROR_201'; // 'Wrong OTP Code'
    case ERROR_202 = 'errors.ERROR_202'; // 'Too many request, try later'
    case ERROR_203 = 'errors.ERROR_203'; // 'OTP code is expired'
    case ERROR_208 = 'errors.ERROR_208'; // 'Subscription already active'

    case ERROR_400 = 'errors.ERROR_400'; // 'Bad request'
    case ERROR_401 = 'errors.ERROR_401'; // 'Unauthorized'
    case ERROR_403 = 'errors.ERROR_403'; // 'User does not have the right roles.'

    case ERROR_404 = 'errors.ERROR_404'; // 'Item\'s not found.'
    case ERROR_409 = 'errors.ERROR_409'; // 'Email already by taken.'

    case ERROR_500 = 'errors.ERROR_500'; // 'Error during create.'
    case ERROR_501 = 'errors.ERROR_501'; // 'Error during create.'
    case ERROR_502 = 'errors.ERROR_502'; // 'Error during update.'
    case ERROR_503 = 'errors.ERROR_503'; // 'You can't leave comments'
}
