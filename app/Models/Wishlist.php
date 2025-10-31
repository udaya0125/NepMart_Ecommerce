<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    //
    protected $fillable = [
        'user_name',
        'product_name',
        'short_description',
        'long_description',
        'features',
        'sku',
        'brand',
    ];
}
