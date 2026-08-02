<?php

namespace Database\Seeders;

use App\Models\PrivacyPolicy;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PrivacyPolicySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $policy =  [
            'id' => 1,
            'text' => collect([
                'ru' => '',
                'uz' => '',
                'en' => '',
            ]),
            'created_at' => now(),
            'updated_at' => now()
        ];

        PrivacyPolicy::updateOrInsert(['id' => $policy['id']], $policy);
    }
}
