<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $fillable = [
        'user_name',
        'product_id', // Added product_id
        'product_name',
        'product_sku',
        'product_brand',
        'price',
        'discounted_price',
        'quantity',
        'size',
        'color',
    ];

    protected $appends = ['total_price']; // Append accessor to JSON

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