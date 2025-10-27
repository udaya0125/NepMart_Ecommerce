import React from "react";

const Fashion = () => {
    const products = [
        {
            category: "2024 FASHION",
            title: "Locomotive Men Blue T-shirt",
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop"
        },
        {
            category: "STYLISH SHOES",
            title: "Solethreads Women Sneakers Shoes",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=600&fit=crop"
        },
        {
            category: "LOOKOUT FASHION",
            title: "Sisterhood Beige Small Bag",
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=600&fit=crop"
        },
    ];

    return (
        <div className="">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
                <div className="text-center mb-4">
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4">
                        Latest Collection
                    </h1>
                    <p className="text-gray-600 text-lg">Discover your style with our curated selection</p>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products.map((product, idx) => (
                        <div 
                            key={idx} 
                            className="group cursor-pointer"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                                {/* Product Image with Overlay */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{
                                        backgroundImage: `url(${product.image})`,
                                    }}
                                />
                                
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500"></div>
                                
                                {/* Accent Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${product.accent} mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-end p-8">
                                    <div className="transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                                        <div className="inline-block mb-3">
                                            <span className="text-xs font-bold text-white/90 tracking-[0.2em] bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                                                {product.category}
                                            </span>
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
                                            {product.title}
                                        </h2>
                                        <button className="group/btn inline-flex items-center gap-2 text-sm font-bold text-white bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border-2 border-white/40 hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105">
                                            <span>SHOP NOW</span>
                                            <svg 
                                                className="w-4 h-4 transform transition-transform duration-300 group-hover/btn:translate-x-1" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Shine Effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 group-hover:left-full transition-all duration-1000"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom CTA */}
            {/* <div className="max-w-7xl mx-auto px-4 pb-16 text-center">
                <p className="text-gray-500 mb-4">New arrivals every week</p>
                <button className="text-gray-900 font-semibold hover:text-gray-600 transition-colors duration-200 border-b-2 border-gray-900 hover:border-gray-600 pb-1">
                    VIEW ALL PRODUCTS
                </button>
            </div> */}
        </div>
    );
};

export default Fashion;