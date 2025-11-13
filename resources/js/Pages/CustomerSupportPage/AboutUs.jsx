import React from "react";
import {
    Smartphone,
    ShoppingBag,
    Watch,
    Package,
    MapPin,
    Phone,
    Mail,
    ArrowRight,
    Home,
    Shirt,
    Camera,
    BookOpen,
    Heart,
    Gamepad2,
} from "lucide-react";
import Navbar from "@/ContentWrapper/Navbar";
import Footer from "@/ContentWrapper/Footer";
import { Link } from "@inertiajs/react";

const AboutUs = () => {
    return (
        <>
            <Navbar />
            <div className=" bg-white">
                {/* Hero Section */}
                <div
                    className="relative h-96 overflow-hidden bg-cover bg-center"
                    style={{
                        backgroundImage:
                            'url("https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
                    }}
                >
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-transparent"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-wide">
                            About Us
                        </h1>
                        <p className="text-lg md:text-xl text-gray-100 mb-6">
                            Your Trusted Online Shopping Destination Since 2010
                        </p>
                    </div>
                </div>

                {/* Diagonal Separator */}
                <div className="relative h-16 bg-white">
                    <svg
                        className="absolute top-0 w-full h-16"
                        viewBox="0 0 1200 60"
                        preserveAspectRatio="none"
                    >
                        <path d="M0,60 L1200,0 L1200,60 Z" fill="white"></path>
                    </svg>
                </div>

                {/* Main Content Section */}
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Image Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-purple-400 to-pink-400 h-64 rounded-lg overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
                                        alt="Headphones"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="bg-gradient-to-br from-blue-400 to-purple-400 h-48 rounded-lg overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop"
                                        alt="Watch"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4 pt-8">
                                <div className="bg-gradient-to-br from-pink-400 to-orange-400 h-48 rounded-lg overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=300&fit=crop"
                                        alt="Clothing"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="bg-gradient-to-br from-indigo-400 to-blue-400 h-48 rounded-lg overflow-hidden shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&h=300&fit=crop"
                                        alt="Handbag"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div>
                            <p className="text-sm text-pink-500 font-semibold mb-2 tracking-wider">
                                SINCE 2010
                            </p>
                            <h2 className="text-4xl font-bold text-slate-800 mb-6">
                                We Are Your One-Stop Shop for Everything
                            </h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                Welcome to our premier online shopping
                                destination where fashion meets technology. We
                                curate the finest selection of electronics,
                                clothing, bags, and accessories to bring you the
                                latest trends and must-have items all in one
                                convenient place.
                            </p>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                Our journey began with a simple mission: to make
                                quality products accessible to everyone. Today,
                                we're proud to serve thousands of satisfied
                                customers worldwide, offering an extensive
                                collection that caters to every style and need.
                            </p>
                            <h3 className="text-xl font-bold text-slate-800 mb-3 mt-8">
                                Quality products, unbeatable prices, and
                                exceptional service
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                We carefully select each item in our collection,
                                working directly with trusted manufacturers and
                                brands to ensure authenticity and quality. Our
                                commitment to customer satisfaction means you
                                can shop with confidence, backed by our
                                hassle-free returns and dedicated support team.
                            </p>
                        </div>
                    </div>
                </div>

                {/* What We Offer Section */}
                {/* <div className="bg-gray-50 py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center text-slate-800 mb-12">
                            What We Offer
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            
                            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                                <Smartphone className="w-10 h-10 mb-4" />
                                <h3 className="text-2xl font-bold mb-4">
                                    ELECTRONICS
                                </h3>
                                <p className="text-blue-100 mb-6 leading-relaxed">
                                    Latest smartphones, laptops, headphones, and
                                    smart devices from top brands
                                </p>
                                
                            </div>

                            
                            <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                                <ShoppingBag className="w-10 h-10 mb-4" />
                                <h3 className="text-2xl font-bold mb-4">
                                    CLOTHING
                                </h3>
                                <p className="text-pink-100 mb-6 leading-relaxed">
                                    Trendy fashion for men, women, and kids.
                                    From casual to formal wear
                                </p>
                                
                            </div>

                          
                            <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                                <Package className="w-10 h-10 mb-4" />
                                <h3 className="text-2xl font-bold mb-4">
                                    BAGS
                                </h3>
                                <p className="text-purple-100 mb-6 leading-relaxed">
                                    Designer handbags, backpacks, travel bags,
                                    and luxury leather goods
                                </p>
                                
                            </div>

                           
                            <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                                <Watch className="w-10 h-10 mb-4" />
                                <h3 className="text-2xl font-bold mb-4">
                                    ACCESSORIES
                                </h3>
                                <p className="text-orange-100 mb-6 leading-relaxed">
                                    Watches, jewelry, sunglasses, and fashion
                                    accessories to complete your look
                                </p>
                                
                            </div>

                          
                            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                                <Home className="w-10 h-10 mb-4" />
                                <h3 className="text-2xl font-bold mb-4">
                                    HOME & LIVING
                                </h3>
                                <p className="text-emerald-100 mb-6 leading-relaxed">
                                    Furniture, home decor, kitchenware, and
                                    everything to make your house a home
                                </p>
                                
                            </div>

                          
                            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                                <Heart className="w-10 h-10 mb-4" />
                                <h3 className="text-2xl font-bold mb-4">
                                    SPORTS & FITNESS
                                </h3>
                                <p className="text-red-100 mb-6 leading-relaxed">
                                    Gym equipment, sportswear, supplements, and
                                    fitness accessories
                                </p>
                                
                            </div>

                            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                                <BookOpen className="w-10 h-10 mb-4" />
                                <h3 className="text-2xl font-bold mb-4">
                                    BOOKS & STATIONERY
                                </h3>
                                <p className="text-indigo-100 mb-6 leading-relaxed">
                                    Best-selling books, office supplies, and
                                    creative stationery items
                                </p>
                               
                            </div>

                          
                            <div className="bg-gradient-to-br from-violet-600 to-violet-700 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
                                <Gamepad2 className="w-10 h-10 mb-4" />
                                <h3 className="text-2xl font-bold mb-4">
                                    GAMING & ENTERTAINMENT
                                </h3>
                                <p className="text-violet-100 mb-6 leading-relaxed">
                                    Gaming consoles, video games, collectibles,
                                    and entertainment systems
                                </p>
                               
                            </div>
                        </div>

                        <div className="text-center">
                            <Link
                                href="/category"
                                className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-10 py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                VIEW ALL COLLECTIONS
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div> */}

                <div className="bg-gray-50 py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center text-slate-800 mb-12">
                            What We Offer
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {/* Electronics Card */}
                            <div className="bg-white text-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100">
                                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop"
                                        alt="Electronics"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">
                                    ELECTRONICS
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Latest smartphones, laptops, headphones, and
                                    smart devices from top brands
                                </p>
                            </div>

                            {/* Clothing Card */}
                            <div className="bg-white text-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100">
                                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop"
                                        alt="Clothing"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">
                                    CLOTHING
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Trendy fashion for men, women, and kids.
                                    From casual to formal wear
                                </p>
                            </div>

                            {/* Bags Card */}
                            <div className="bg-white text-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100">
                                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop"
                                        alt="Bags"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">
                                    BAGS
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Designer handbags, backpacks, travel bags,
                                    and luxury leather goods
                                </p>
                            </div>

                            {/* Accessories Card */}
                            <div className="bg-white text-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100">
                                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop"
                                        alt="Accessories"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">
                                    ACCESSORIES
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Watches, jewelry, sunglasses, and fashion
                                    accessories to complete your look
                                </p>
                            </div>

                            {/* Home & Living Card */}
                            <div className="bg-white text-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100">
                                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
                                        alt="Home & Living"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">
                                    HOME & LIVING
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Furniture, home decor, kitchenware, and
                                    everything to make your house a home
                                </p>
                            </div>

                            {/* Sports & Fitness Card */}
                            <div className="bg-white text-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100">
                                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
                                        alt="Sports & Fitness"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">
                                    SPORTS & FITNESS
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Gym equipment, sportswear, supplements, and
                                    fitness accessories
                                </p>
                            </div>

                            {/* Books & Stationery Card */}
                            <div className="bg-white text-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100">
                                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop"
                                        alt="Books & Stationery"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">
                                    BOOKS & STATIONERY
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Best-selling books, office supplies, and
                                    creative stationery items
                                </p>
                            </div>

                            {/* Gaming & Entertainment Card */}
                            <div className="bg-white text-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100">
                                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop"
                                        alt="Gaming & Entertainment"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">
                                    GAMING & ENTERTAINMENT
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Gaming consoles, video games, collectibles,
                                    and entertainment systems
                                </p>
                            </div>
                        </div>

                        <div className="text-center">
                            <Link
                                href="/category"
                                className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-10 py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                VIEW ALL COLLECTIONS
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* CTA Section with Fixed Background */}
                <div
                    className="relative h-96 overflow-hidden bg-fixed bg-cover bg-center"
                    style={{
                        backgroundImage:
                            'url("https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
                    }}
                >
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-8xl md:text-9xl font-bold text-white/10 tracking-wider">
                            SHOP
                        </div>
                    </div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center leading-tight">
                            Electronics, Clothing, Bags & More,
                            <br />
                            Everything You Need in One Place.
                        </h2>
                        <p className="text-lg text-gray-100 mb-6">
                            Free Shipping on Orders Over $50
                        </p>
                        <Link
                            href={"/"}
                            className="bg-white hover:bg-gray-100 text-purple-600 px-10 py-4 rounded-full font-bold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white py-12 border-t">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div>
                                <MapPin className="w-8 h-8 text-pink-500 mx-auto mb-3" />
                                <h3 className="font-bold text-slate-800 mb-2">
                                    HEAD OFFICE
                                </h3>
                                <p className="text-gray-600">
                                    123 Commerce Street, Lovelly Hill
                                </p>
                            </div>
                            <div>
                                <Phone className="w-8 h-8 text-pink-500 mx-auto mb-3" />
                                <h3 className="font-bold text-slate-800 mb-2">
                                    CALL US
                                </h3>
                                <p className="text-gray-600">+977 9800000001</p>
                            </div>
                            <div>
                                <Mail className="w-8 h-8 text-pink-500 mx-auto mb-3" />
                                <h3 className="font-bold text-slate-800 mb-2">
                                    EMAIL US
                                </h3>
                                <p className="text-gray-600">info@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AboutUs;
