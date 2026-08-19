<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Bo'lim (chapter) darajasida premium: maqolaning bir qismi bepul, boshqasi
// pullik bo'lishi uchun. Ilgari faqat butun maqola premium bo'lardi.
return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('chapters') && !Schema::hasColumn('chapters', 'paid')) {
            Schema::table('chapters', function (Blueprint $table) {
                $table->boolean('paid')->default(false)->after('description');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('chapters', 'paid')) {
            Schema::table('chapters', function (Blueprint $table) {
                $table->dropColumn('paid');
            });
        }
    }
};
