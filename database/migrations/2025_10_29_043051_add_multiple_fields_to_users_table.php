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
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->after('email')->nullable();
            $table->string('image')->after('role')->nullable();

            // Separate address-related fields
            $table->string('street_address')->after('image')->nullable();
            $table->string('city')->after('street_address')->nullable();
            $table->string('zip_code')->after('city')->nullable();
            $table->string('state_province')->after('zip_code')->nullable();

            $table->string('phone_no')->after('state_province')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
            $table->dropColumn('image');
            $table->dropColumn('street_address');
            $table->dropColumn('city');
            $table->dropColumn('state_province');
            $table->dropColumn('phone_no');
        });
    }
};
