<?php

namespace App\Services;

use App\Enums\ResponseError;
use App\Traits\ApiResponse;
use App\Traits\MediaTrait;


abstract class BaseService
{
    use MediaTrait;
    use ApiResponse;
}
