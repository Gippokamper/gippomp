<?php

namespace Database\Seeders;

use App\Models\PhotoLanding;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PhotoLandingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $photos = [
            [
                'id' => 1,
                'name' => 'main_banner_1',
                'photo' => '/images/main/m-1.jpg',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 2,
                'name' => 'main_banner_2',
                'photo' => '/images/main/m-2.jpg',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 3,
                'name' => 'main_banner_3',
                'photo' => '/images/main/m-3.jpg',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 4,
                'name' => 'main_banner_4',
                'photo' => '/images/main/m-4.jpg',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 5,
                'name' => 'about_1',
                'photo' => '/images/about/a-1.jpg',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 6,
                'name' => 'about_2',
                'photo' => '/images/about/a-2.jpg',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 7,
                'name' => 'about_3',
                'photo' => '/images/about/a-3.jpg',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        foreach ($photos as $photo){
            PhotoLanding::updateOrInsert(['id' => $photo['id']], $photo);
        }
    }
}
