<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'user_id',
        'user_name',
        'email',
        'product_id',
        'rating',
        'comment',
    ];

    /**
     * Relationships
     */

    // Each review belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Each review belongs to a product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
