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
        Schema::create('transactions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('user_id');
            $table->string('payment_sys_id');
            $table->integer('click_paydoc_id')->nullable();
            $table->string('payment_sys')->nullable();
            $table->bigInteger('amount');
            $table->unsignedBigInteger('perform_time')->nullable();
            $table->unsignedBigInteger('cancel_time')->nullable();
            $table->string('reason')->nullable();
            $table->boolean('status')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
