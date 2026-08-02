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
        Schema::create('question_blocks', function (Blueprint $table) {
            $table->id();
            $table->integer('blockable_id');
            $table->string('blockable_type');
            $table->string('slug')->unique();
            $table->integer('sort');
            $table->text('name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_blocks');
    }
};
