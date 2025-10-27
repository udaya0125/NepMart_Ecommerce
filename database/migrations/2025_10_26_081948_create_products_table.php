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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('sku')->nullable();
            $table->string('brand')->nullable();
            $table->string('category_id');
            $table->string('sub_category_id');
            $table->decimal('price', 8, 2);
            $table->unsignedTinyInteger('discount')->nullable();
            $table->string('in_stock');
            $table->string('stock_quantity');
            $table->string('estimated_delivery')->nullable();
            $table->string('free_shipping');
            $table->string('returns');
            $table->string('short_description')->nullable();
            $table->longText('long_description')->nullable();
            $table->string('sizes')->nullable();
            $table->string('colors')->nullable();
            $table->longText('features')->nullable();
            $table->string('slug')->unique();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
