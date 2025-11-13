import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Heart, Eye, ExternalLink, ShoppingCart } from 'lucide-react'
import { Link, usePage } from '@inertiajs/react'
import ProductsPopup from './ProductsPopup'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext' 
import axios from 'axios'

const LatestProducts = () => {
  const [allProducts, setAllProducts] = useState([]) 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Get auth from page props
  const { auth } = usePage().props;
  const user = auth?.user;

  // Use the cart context
  const { addToCart } = useCart()
  
  // Use the wishlist context
  const { 
    addToWishlist, 
    removeFromWishlist, 
    isInWishlist, 
    getWishlistItemId,
    wishlist: { isLoading: wishlistLoading }
  } = useWishlist()

  // Use Effect for fetching products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log("Fetching products from:", route("ourproducts.index"))
        const response = await axios.get(route("ourproducts.index"))
        console.log("Products response:", response.data)
        setAllProducts(response.data.data || response.data)
      } catch (err) {
        console.error("Fetching error:", err)
        console.error("Error response:", err.response)
        setError("Failed to load products. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const scroll = (direction) => {
    const container = document.getElementById("latest-products-container")
    if (!container) return
    
    const scrollAmount = 320
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  const handleShowDetails = (product) => {
    setSelectedProduct(product)
    setShowDetails(true)
  }

  const handleAddToCart = async (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images || [],
        slug: product.slug,
        sku: product.sku || product.product_sku || `SKU-${product.id}`,
        product_sku: product.product_sku || product.sku || `SKU-${product.id}`,
        brand: product.brand || product.product_brand || 'Unknown Brand',
        product_brand: product.product_brand || product.brand || 'Unknown Brand',
        product_name: product.name,
        discounted_price: product.discounted_price || product.sale_price || product.price
      }

      console.log('Adding to cart:', cartProduct)
      await addToCart(cartProduct, 1)
      console.log(`Added ${product.name} to cart`)
      
    } catch (error) {
      console.error('Failed to add to cart:', error)
      alert(`Failed to add ${product.name} to cart: ${error.message}`)
    }
  }

  const handleWishlistToggle = async (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      if (isInWishlist(product.id)) {
        const wishlistItemId = getWishlistItemId(product.id)
        console.log('Removing from wishlist - Product ID:', product.id, 'Wishlist Item ID:', wishlistItemId)
        
        if (wishlistItemId) {
          await removeFromWishlist(wishlistItemId)
          console.log(`Removed ${product.name} from wishlist`)
        } else {
          console.error('Could not find wishlist item ID for product:', product.id)
        }
      } else {
        const wishlistProduct = {
          id: product.id,
          name: product.name,
          price: product.price,
          images: product.images || [],
          slug: product.slug,
          rating: product.rating || 0,
          inStock: product.inStock !== false,
          sku: product.sku || product.product_sku || `SKU-${product.id}`,
          product_sku: product.product_sku || product.sku || `SKU-${product.id}`,
          product_brand: product.brand || product.product_brand || 'Unknown Brand',
          product_name: product.name,
          discounted_price: product.discounted_price || product.sale_price || product.price
        }

        console.log('Adding to wishlist:', wishlistProduct)
        await addToWishlist(wishlistProduct)
        console.log(`Added ${product.name} to wishlist`)
        
        // Show message if user is not authenticated
        if (!user) {
          alert('Product added to local wishlist. Sign in to sync across devices.');
        }
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error)
      alert(`Failed to update wishlist: ${error.message}`)
    }
  }

  const renderStars = (rating) => {
    const normalizedRating = Math.min(Math.max(0, rating || 0), 5)
    
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < normalizedRating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  // Get first image or placeholder
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      return typeof firstImage === 'object' 
        ? firstImage.image_path 
          ? `/storage/${firstImage.image_path}`
          : firstImage.url || '/placeholder-image.jpg'
        : firstImage;
    }
    return '/placeholder-image.jpg';
  }

  if (loading) {
    return (
      <div className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Latest Products</h1>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Latest Products</h1>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Latest Products</h1>
          <p className="text-gray-600">Mauris quis nisi elit curabitur sodales libero ac interdum finibus.</p>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          {/* Left Arrow - Only show if there are products */}
          {allProducts.length > 0 && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            id="latest-products-container"
            className="flex gap-6 overflow-x-auto scroll-smooth hide-scrollbar pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {allProducts.length > 0 ? (
              allProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-72 bg-gray-50 rounded-lg overflow-hidden group relative"
                >
                  {/* Product Link Wrapper */}
                  <Link
                    href={`/products/${product.slug || product.id}`}
                    className="block"
                  >
                    {/* Image Container */}
                    <div className="relative bg-white h-72 flex items-center justify-center overflow-hidden">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg'
                        }}
                      />

                      {/* Discount Badge */}
                      {product.discount && (
                        <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-semibold">
                          -{product.discount}%
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 items-center justify-center flex flex-col">
                      <h3 className="text-sm font-medium text-gray-900 mb-2 h-10 line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="mb-2">
                        {renderStars(product.rating || 4)}
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-900">
                          Rs.{product.price}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Action Icons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleWishlistToggle(product, e)}
                      disabled={wishlistLoading}
                      className={`p-2 rounded-full shadow-md transition-colors ${
                        isInWishlist(product.id) 
                          ? "bg-pink-50 text-pink-500 hover:bg-pink-100" 
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart 
                        className="w-4 h-4" 
                        fill={isInWishlist(product.id) ? "currentColor" : "none"}
                      />
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleShowDetails(product)
                      }}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      aria-label="View details"
                    >
                      <Eye className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      aria-label="View on external site"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 w-full py-12">
                No products available.
              </div>
            )}
          </div>

          {/* Right Arrow */}
          {allProducts.length > 0 && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          )}
        </div>

        {/* Products Popup */}
        {showDetails && selectedProduct && (
          <ProductsPopup
            product={selectedProduct}
            showDetails={showDetails}
            setShowDetails={setShowDetails}
          />
        )}

        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </div>
  )
}

export default LatestProducts