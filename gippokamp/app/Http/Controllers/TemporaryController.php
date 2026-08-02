<?php

namespace App\Http\Controllers;

use App\Helpers\Utility;
use App\Models\Balance;
use App\Models\Transaction;
use App\Models\University;
use App\Models\User;
use App\Models\Wallet;
use Carbon\Carbon;
use Faker\Core\DateTime;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class TemporaryController extends Controller
{

    public function action()
    {
        $response = \Illuminate\Support\Facades\Http::get('https://gippokamp.uz/user_export');
        $data = $response->json();
                foreach ($data as $user){
                    if (!User::where('phone', Utility::replacePhone($user['phone']))->exists()){
                        DB::transaction(function () use ($user){
                            $date = \DateTime::createFromFormat('d.m.Y', $user['birthday']);
                            if ($user['profession'] == 1){
                                $profession = 'student';
                            }elseif ($user['profession'] == 2){
                                $profession = 'doctor';
                            }else{
                                $profession = 'teacher';
                            }
                            if ($date){
                                $date = $date->format('d.m.Y');
                                if ($date == '30.11.-0001'){
                                    $date = Carbon::now()->format('d.m.Y');
                                }
                            }else{
                                $date = Carbon::now()->format('d.m.Y');
                            }
                            $u = User::create([
                                'uuid' => Str::uuid(),
                                'firstname' => $user['name'],
                                'lastname' => $user['surname'],
                                'phone' => Utility::replacePhone($user['phone']),
                                'email' => $user['email'],
                                'gender' => $user['gender'] == 1 ? 'male' : 'female',
                                'profession' => $profession,
                                'university_id' => $user['university'],
                                'interests' => $user['interest'],
                                'birthday' => $date,
                                'phone_verified_at' => $user['email_verified_at'],
                                'province' => $user['province'],
                                'status' => $user['status'] ?? true
                            ]);
                            // Import qilingan parol allaqachon hashlangan — mutatordan chetlab, qayta hashlamaymiz.
                            DB::table('users')->where('id', $u->id)->update(['password' => $user['password']]);
                            Wallet::create([
                                'user_id' => $u->id,
                                'amount' => floatval($user['balance'])
                            ]);
                            $role = Role::firstWhere('name', 'user');
                            $u->assignRole($role);
                        });
                    }else{
                        $u = User::where('phone', Utility::replacePhone($user['phone']))->first();
                        $date = Carbon::createFromFormat('Y-m-d H:i:s', $user['created_at']);
                        $date->addDays(15);
                        $u->update([
                            'trial_ends_at' => $date
                        ]);
                    }
                }
        return response()->json([
           'status' => true
        ]);
    }
}
