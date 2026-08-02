<?php

namespace Database\Seeders;

use App\Models\Lang;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $langs = [
            [
                'id' => 1,
                'name' => 'ru',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 2,
                'name' => 'uz',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        foreach ($langs as $lang){
            Lang::updateOrInsert(['id' => $lang['id']], $lang);
        }
    }
}
