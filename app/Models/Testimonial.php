<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'user', 'comment', 'rating', 'title'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'rating' => 'integer',
    ];

    /**
     * Validation rules
     */
    public static function rules()
    {
        return [
            'user' => 'required|string|max:255',
            'comment' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
        ];
    }

    /**
     * Scope for highly rated testimonials (4-5 stars)
     */
    public function scopeHighlyRated($query)
    {
        return $query->where('rating', '>=', 4);
    }

    /**
     * Scope for testimonials by rating
     */
    public function scopeWithRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }

    /**
     * Get star rating as HTML
     */
    public function getStarRatingAttribute()
    {
        $stars = '';
        $fullStars = $this->rating;
        $emptyStars = 5 - $fullStars;

        // Full stars
        for ($i = 0; $i < $fullStars; $i++) {
            $stars .= '<span class="star full">★</span>';
        }

        // Empty stars
        for ($i = 0; $i < $emptyStars; $i++) {
            $stars .= '<span class="star empty">☆</span>';
        }

        return $stars;
    }
}