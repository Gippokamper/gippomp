<?php

namespace Database\Seeders;

use App\Models\VideoLanding;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VideoLandingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $videos = [
            [
                'id' => 1,
                'name' => 'video_1',
                'video' => '/images/video/v-1.webm',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 2,
                'name' => 'video_2',
                'video' => '/images/video/v-2.webm',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 3,
                'name' => 'video_3',
                'video' => '/images/video/v-3.webm',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        foreach ($videos as $video){
            VideoLanding::updateOrInsert(['id' => $video['id']], $video);
        }
    }
}
