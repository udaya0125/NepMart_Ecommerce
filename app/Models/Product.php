<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    protected $fillable = [
        'name',
        'price',
        'discount',
        'short_description',
        'long_description',
        'sizes',
        'colors',
        'in_stock',
        'stock_quantity',
        'estimated_delivery',
        'free_shipping',
        'returns',
        'features',
        'brand',
        'sku',
        'slug',
        'category_id',
        'sub_category_id'
    ];

    protected $appends = ['discounted_price', 'discount_label'];

    /**
     * Automatically generate a unique slug before creating a product.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            $slug = Str::slug($product->name);
            $originalSlug = $slug;
            $count = 1;

            // Ensure slug uniqueness
            while (Product::where('slug', $slug)->exists()) {
                $slug = "{$originalSlug}-{$count}";
                $count++;
            }

            $product->slug = $slug;
        });
    }

    /**
     * Accessor: Discounted price.
     */
    public function getDiscountedPriceAttribute()
    {
        if ($this->discount && $this->discount > 0) {
            return round($this->price - ($this->price * $this->discount / 100), 2);
        }

        return $this->price;
    }

    /**
     * Accessor: Discount label.
     */
    public function getDiscountLabelAttribute()
    {
        return $this->discount ? $this->discount . '% off' : null;
    }

    /**
     * Relationships.
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class);
    }
}
