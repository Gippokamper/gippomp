<?php

namespace App\Helpers;

class Utility
{

    public static function replacePhone($phone) {
        return preg_replace('/[^\d]/', '', $phone);
    }
}
