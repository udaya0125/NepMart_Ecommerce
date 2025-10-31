<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductsCart extends Model
{
    protected $fillable = [
        'user_name',
        'product_name',
        'short_description',
        'long_description',
        'features',
        'sku',
        'brand',
        'price',
        'discounted_price',
        'quantity',
        'size',
        'color',
    ];

    /**
     * Relationship with User model
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship with Product model
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Accessor: Calculate total price for this cart item
     */
    public function getTotalPriceAttribute()
    {
        $price = $this->discounted_price ?? $this->price;
        return $price * $this->quantity;
    }
}
