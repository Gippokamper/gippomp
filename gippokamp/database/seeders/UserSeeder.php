<?php
namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = [
            [
                'id' => 102,
                'uuid' => str()->uuid(),
                'firstname' => 'Admin',
                'lastname' => 'Superadmin',
                'phone' => '998913090318',
                'email' => 'ravshanovsamir@gmail.com',
                'phone_verified_at' => now(),
                'created_at' => now(),
                'password' => Hash::make('123456789'),
            ]
        ];

        foreach ($users as $user){
            User::updateOrInsert(['id' => $user['id']], $user);
        }

    }
}
