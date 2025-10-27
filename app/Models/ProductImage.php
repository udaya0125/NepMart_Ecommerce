<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    protected $fillable = [
        'product_id',
        'image_path',
        'alt_text',
        'is_primary'
    ];

    /**
     * Relationship with Product model
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
