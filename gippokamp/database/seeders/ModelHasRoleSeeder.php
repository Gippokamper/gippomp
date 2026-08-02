<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ModelHasRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $hasRoles = [
            [
                'role_id' => 321,
                'model_type' => 'App\Models\User',
                'model_id' => 102
            ]
        ];

        foreach ($hasRoles as $role){
            DB::table('model_has_roles')->insert($role);
        }
    }
}
