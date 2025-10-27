<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Category extends Model
{
    //
    protected $fillable = ['category'];
    // One category has many subcategories
    public function subCategories(): HasMany
    {
        return $this->hasMany(SubCategory::class, 'category_id');
    }

     // One category has many product
    public function product(): HasMany
    {
        return $this->hasMany(Product::class);
    }

     // One category has many blog
    public function blog(): HasMany
    {
        return $this->hasMany(Blog::class);
    }
}
