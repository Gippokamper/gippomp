<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class LocalSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // Prod dump'dagi rollar 'api' guard bilan yozilgan. Spatie'ning default guard'i
        // esa 'web' — shu sababli guard'ni qattiq 'api' qilib beramiz, aks holda
        // roles jadvalida ikkinchi (dublikat) admin/user qatorlari paydo bo'ladi.
        $roles = [];
        foreach (['admin', 'user'] as $roleName) {
            $roles[$roleName] = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'api']);
        }

        // Admin foydalanuvchi
        $admin = User::firstOrCreate(
            ['phone' => 998901112233],
            [
                'firstname'         => 'Super',
                'lastname'          => 'Admin',
                'password'          => 'admin12345',      // mutator hash qiladi
                'phone_verified_at' => Carbon::now(),
                'status'            => true,
                'trial_ends_at'     => Carbon::now()->addYear(),
            ]
        );
        // Role obyektini beramiz — string bo'lsa Spatie uni 'web' guard'da qidiradi va topolmaydi.
        $admin->syncRoles([$roles['admin']]);
        // Qayta ishga tushirilganda ham parol aniq bo'lishi uchun (firstOrCreate mavjud
        // yozuvni yangilamaydi).
        $admin->password = 'admin12345';
        $admin->save();

        // Oddiy foydalanuvchi
        $user = User::firstOrCreate(
            ['phone' => 998902223344],
            [
                'firstname'         => 'Oddiy',
                'lastname'          => 'User',
                'password'          => 'user12345',
                'phone_verified_at' => Carbon::now(),
                'status'            => true,
                'trial_ends_at'     => Carbon::now()->addYear(),
            ]
        );
        $user->syncRoles([$roles['user']]);
        $user->password = 'user12345';
        $user->save();

        $this->command->info('Admin: 998901112233 / admin12345  (rol: admin)');
        $this->command->info('User : 998902223344 / user12345   (rol: user)');
    }
}
