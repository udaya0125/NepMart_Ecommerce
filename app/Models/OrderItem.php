<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
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
     * Automatically generate a unique order_id
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($orderItem) {
            // Generate a unique order_id like: ORD-20251031-AB12C
            $orderItem->order_id = 'ORD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5));
        });
    }
}
