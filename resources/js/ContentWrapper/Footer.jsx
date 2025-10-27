import { Store, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Send } from "lucide-react";
import React, { useState } from "react";

const Footer = () => {
    const [email, setEmail] = useState("");

    const handleSubscribe = () => {
        if (email) {
            alert(`Subscribed with: ${email}`);
            setEmail("");
        }
    };

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Store className="h-8 w-8 text-red-500" />
                            <span className="text-2xl font-bold text-white">ShopNow</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Your one-stop destination for quality products at amazing prices. Shop with confidence and enjoy fast delivery.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="hover:text-red-500 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-red-500 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-red-500 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-red-500 transition-colors">
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">About Us</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">Shop</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">Categories</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">Blog</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">Contact</a>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Customer Service</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">My Account</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">Order Tracking</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">Shipping Info</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">Returns & Refunds</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-red-500 transition-colors">FAQs</a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Newsletter</h3>
                        <p className="text-sm mb-4">
                            Subscribe to get special offers and updates directly to your inbox.
                        </p>
                        <div className="space-y-3">
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                            <button
                                onClick={handleSubscribe}
                                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                Subscribe
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                        
                        {/* Contact Info */}
                        <div className="mt-6 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-red-500" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-red-500" />
                                <span>support@shopnow.com</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-red-500 mt-0.5" />
                                <span>123 Commerce Street, NY 10001</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-400">
                            © 2025 ShopNow. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <a href="#" className="hover:text-red-500 transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="hover:text-red-500 transition-colors">
                                Terms of Service
                            </a>
                            <a href="#" className="hover:text-red-500 transition-colors">
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;