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

    protected $appends = ['discounted_price', 'discount_label', 'in_stock'];

    /**
     * Automatically generate a unique slug before creating a product.
     */
    // protected static function boot()
    // {
    //     parent::boot();

    //     static::creating(function ($product) {
    //         $slug = Str::slug($product->name);
    //         $originalSlug = $slug;
    //         $count = 1;

    //         // Ensure slug uniqueness
    //         while (Product::where('slug', $slug)->exists()) {
    //             $slug = "{$originalSlug}-{$count}";
    //             $count++;
    //         }

    //         $product->slug = $slug;
    //     });
    // }

    protected static function boot()
{
    parent::boot();

    static::created(function ($product) {
        // Generate base slug from product name
        $baseSlug = Str::slug($product->name);

        // Generate random 6-digit number
        $random = random_int(100000, 999999);

        // Create unique slug pattern: name + id + random number
        $slug = "{$baseSlug}-{$product->id}-{$random}";

        // Ensure uniqueness
        while (Product::where('slug', $slug)->exists()) {
            $random = random_int(100000, 999999);
            $slug = "{$baseSlug}-{$random}";
        }

        // Update slug AFTER creation
        $product->slug = $slug;
        $product->save();
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
     * Accessor: In Stock status based on stock quantity.
     */
    public function getInStockAttribute()
    {
        return $this->stock_quantity > 0;
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