<?php

namespace App\Http\Controllers\API\v1\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

abstract class AdminBaseController extends Controller
{
    use ApiResponse;
    public function __construct()
    {
        $this->middleware(['sanctum.check', 'verified.check', 'roles:admin']);
    }
}
