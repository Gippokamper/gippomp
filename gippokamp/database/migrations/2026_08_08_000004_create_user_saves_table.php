<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
 * Foydalanuvchi saqlab qo'ygan materiallar ("Saqlanganlar").
 *
 * Bitta jadval har xil tur uchun: maqola, video, yangilik va keyinchalik
 * qo'shiladiganlari. Shu sababdan `savable_type` + `savable_id` — alohida
 * jadval ochib yurmaslik uchun (yangiliklarda `news_saves` shunday qilingan
 * edi, endi yangilari shu yerga tushadi).
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_saves', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id');
            $table->string('savable_type');
            $table->bigInteger('savable_id');
            $table->timestamps();

            // Bir material bir foydalanuvchida bir marta saqlanadi.
            $table->unique(['user_id', 'savable_type', 'savable_id'], 'user_saves_unique');
            // "Saqlanganlar" ro'yxati — eng yangisi tepada.
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_saves');
    }
};
