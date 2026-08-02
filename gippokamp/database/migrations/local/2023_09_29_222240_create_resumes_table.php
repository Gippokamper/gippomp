<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('resumes', function (Blueprint $table) {
            $table->id();
            $table->integer('vacancy_id');
            $table->string('full_name');
            $table->date('birthday');
            $table->string('address');
            $table->string('email');
            $table->string('phone');
            $table->string('now_do')->nullable();
            $table->string('study_info')->nullable();
            $table->boolean('english')->default(0);
            $table->boolean('german')->default(0);
            $table->string('language_level')->nullable();
            $table->string('stimulus')->nullable();
            $table->string('interest')->nullable();
            $table->string('comment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resumes');
    }
};
