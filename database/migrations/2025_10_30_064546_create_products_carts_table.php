<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products_carts', function (Blueprint $table) {
            $table->id();

            // Basic info
            $table->string('user_name');
            $table->string('product_name');

            // Product details (aligned with products table)
            $table->string('sku')->nullable();
            $table->string('brand')->nullable();
            $table->integer('quantity')->default(1);
            $table->decimal('price', 10, 2);
            $table->decimal('discounted_price', 10, 2)->nullable();

            // Product options
            $table->string('size')->nullable();
            $table->string('color')->nullable();

            // Descriptions and extra info
            $table->string('short_description')->nullable();
            $table->longText('long_description')->nullable();
            $table->longText('features')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products_carts');
    }
};
