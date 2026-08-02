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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->uuid()->index();
            $table->string('firstname')->index();
            $table->string('lastname')->nullable()->index();
            $table->bigInteger('phone')->unique()->index();
            $table->string('email')->unique()->nullable()->index();
            $table->string('gender')->default('male');
            $table->string('profession')->nullable();
            $table->integer('graduation_year')->nullable();
            $table->string('place_of_study')->nullable();
            $table->string('interests')->nullable();
            $table->date('birthday')->nullable();
            $table->integer('verification_code')->nullable();
            $table->integer('verification_attempts')->nullable();
            $table->timestamp('phone_verified_at')->nullable();
            $table->integer('university_id')->nullable();
            $table->string('region')->nullable();
            $table->string('province')->nullable();
            $table->string('address')->nullable();
            $table->string('password', 100);
            $table->string('image')->nullable();
            $table->string('reset_password_token')->nullable();
            $table->ipAddress()->nullable();
            $table->boolean('status')->default(true);
            $table->timestamp('trial_ends_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
