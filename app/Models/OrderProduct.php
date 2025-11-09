<?php

namespace App\Models;
use Illuminate\Support\Str;

use Illuminate\Database\Eloquent\Model;

class OrderProduct extends Model
{
    //
    protected $fillable = [
        'order_id',
        'user_name',
        'product_id',
        'product_name',
        'user_email',
        'payment_method',
        'product_sku',
        'product_brand',
        'quantity',
        'price',
        'discounted_price',
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
