<?php

namespace App\Traits;

use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

trait MediaTrait
{
    public function video($video)
    {
        if ($video) {
            $name = Str::random(10) . '.' . $video->getClientOriginalExtension();
            $path = '/videos/' . $name;
            $video->move(public_path() . '/videos', $name);
            return $path;
        }
        return null;
    }

    public function photo($photo, $directory)
    {
        if ($photo->getClientOriginalExtension() == 'svg'){
            $svg_name = Str::random(10);
            $photo->move(public_path() . '/svg/', $svg_name .  '.' . $photo->getClientOriginalExtension());
            return '/svg/' . $svg_name .  '.' . $photo->getClientOriginalExtension();
        }else{
            $height = Image::make($photo)->height();
            $width = Image::make($photo)->width();

            $photoName = Str::random(10) . '.webp';
            $photoPath = '/image/' . $directory . '/';

            if (file_exists(public_path($photoPath))){
                Image::make($photo)->encode('webp', 90)->resize($width, $height)->save(public_path($photoPath . $photoName));
            }else{
                mkdir(public_path($photoPath), 0755, true);
                Image::make($photo)->encode('webp', 90)->resize($width, $height)->save(public_path($photoPath . $photoName));
            }
            return $photoPath . $photoName;
        }
    }

    public function svg($svg)
    {
        $svg_name = Str::random(10);
        $svg->move(public_path() . '/svg/', $svg_name .  '.' . $svg->getClientOriginalExtension());

        $svg_path = '/svg/' . $svg_name .  '.' . $svg->getClientOriginalExtension();

        $paths = simplexml_load_file(public_path($svg_path));
        $view_box = $paths->attributes()->viewBox;

        unlink(public_path() . '/' . $svg_path);
        return [
            'paths' => $paths,
            'view_box' => $view_box
        ];
    }

    public function delete($model = null, $id, $col_name, $path = null)
    {
        if (is_null($path) && !is_null($model)){
            $model = 'App\Models\\' . $model;
            $path = $model::find($id)->$col_name;
            if (is_file(public_path($path))){
                unlink(public_path() . $path);
            }
        }else{
            if (is_file(public_path($path))){
                unlink(public_path() . $path);
            }
        }
        return back();
    }
}
