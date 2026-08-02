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
        Schema::create('user_test_attempts', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->integer('block_id');
            $table->time('time')->nullable();
            $table->integer('right_answer')->default(0);
            $table->integer('wrong_answer')->default(0);
            $table->integer('help_answer')->default(0);
            $table->integer('no_answer')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_test_attempts');
    }
};
