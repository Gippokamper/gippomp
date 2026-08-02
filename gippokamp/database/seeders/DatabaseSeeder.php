<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(UserSeeder::class);
        $this->call(RoleSeeder::class);
        $this->call(LangSeeder::class);
        $this->call(ModelHasRoleSeeder::class);
        $this->call(TariffTermSeeder::class);
        $this->call(RegionSeeder::class);
        $this->call(PhotoLandingSeeder::class);
        $this->call(VideoLandingSeeder::class);
        $this->call(PrivacyPolicySeeder::class);
    }
}
