<?php

namespace Database\Seeders;

use App\Models\TariffTerm;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TariffTermSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $tariff_terms = [
            [
                'id' => 1,
                'name' => collect([
                    'ru' => '1 месяц',
                    'uz' => '1 oy',
                    'en' => '1 month'
                ]),
                'month_count' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'name' => collect([
                    'ru' => '6 месяцев',
                    'uz' => '6 oy',
                    'en' => '6 months'
                ]),
                'month_count' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'name' => collect([
                    'ru' => '12 месяцев',
                    'uz' => '12 oy',
                    'en' => '12 months'
                ]),
                'month_count' => 12,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($tariff_terms as $tariff_term){
            TariffTerm::updateOrInsert(['id' => $tariff_term['id']], $tariff_term);
        }
    }
}
