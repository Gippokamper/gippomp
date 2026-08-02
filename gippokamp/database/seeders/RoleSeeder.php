<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles = [
            [
                'id' => 312,
                'name' => 'admin',
                'guard_name' => 'api',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 123,
                'name' => 'user',
                'guard_name' => 'api',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        foreach ($roles as $role){
            Role::updateOrInsert(['id' => $role['id']], $role);
        }
    }
}
