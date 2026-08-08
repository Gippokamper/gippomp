<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
 * Talabaning "bu bo'limni bajardim" belgilari.
 *
 * Bu haqiqiy test natijasi emas — foydalanuvchi o'zi uchun qo'yadigan belgi.
 * Haqiqiy statistika `user_test_attempts` da qoladi va bu jadval unga tegmaydi.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_quiz_completions', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id');
            $table->bigInteger('quiz_id');
            $table->timestamps();

            // Bir bo'lim bir foydalanuvchida faqat bir marta belgilanadi.
            $table->unique(['user_id', 'quiz_id']);
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_quiz_completions');
    }
};
