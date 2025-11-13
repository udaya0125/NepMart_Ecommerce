import React, { useState } from "react";
import {
    Search,
    Mail,
    Phone,
    MessageCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    MapPin,
    HelpCircle,
} from "lucide-react";
import Navbar from "@/ContentWrapper/Navbar";
import Footer from "@/ContentWrapper/Footer";

const HelpandSupport = () => {
    const [openFaq, setOpenFaq] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const faqs = [
        {
            question: "How do I track my order?",
            answer: "You can track your order by logging into your account and visiting the 'Orders' section. You'll find real-time tracking information for all your shipments. You'll also receive tracking updates via email.",
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy for most items. Products must be unused, in original packaging, and with tags attached. To initiate a return, visit your order history and select the item you'd like to return.",
        },
        {
            question: "How long does shipping take?",
            answer: "Standard shipping takes 5-7 business days. Express shipping delivers in 2-3 business days. International orders may take 10-15 business days depending on your location.",
        },
        {
            question: "Do you ship internationally?",
            answer: "Yes, we ship to over 100 countries worldwide. Shipping costs and delivery times vary by destination. You can view shipping options during checkout.",
        },
        {
            question: "How can I change or cancel my order?",
            answer: "Orders can be modified or cancelled within 1 hour of placement. After this window, please contact our support team for assistance. We'll do our best to help before the order ships.",
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept only eSewa payment.",
        },
    ];

    const filteredFaqs = faqs.filter(
        (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <>
            <Navbar />
            <div className="">
                {/* Header Section */}
                <div className="relative h-[550px] overflow-hidden">
                    <img
                        src="https://images.pexels.com/photos/1525612/pexels-photo-1525612.jpeg"
                        alt="Blog hero image"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                        <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
                            Help & Support
                        </h1>
                        <p className="text-xl md:text-2xl text-center max-w-2xl mb-8">
                            Insights, trends, and stories from the world of
                            style, tech, and lifestyle.
                        </p>
                    </div>
                </div>
                <div className="bg-white shadow-sm">
                    <div className="max-w-6xl mx-auto px-4 py-16 text-center">
                        <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
                            How Can We Help You?
                        </h1>
                        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                            Find answers to common questions or reach out to our
                            support team
                        </p>
                    </div>
                </div>

                {/* Contact Options */}
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        <div className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-[#EFE9E3] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-gray-700" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">
                                Email Us
                            </h3>
                            <p className="text-gray-600 mb-4">
                                We'll respond within 24 hours
                            </p>
                            <a
                                href="mailto:support@store.com"
                                className="text-gray-700 hover:text-gray-900 font-medium"
                            >
                                support@store.com
                            </a>
                        </div>

                        <div className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-[#EFE9E3] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Phone className="w-8 h-8 text-gray-700" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">
                                Call Us
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Sun-Fri, 9AM - 6PM EST
                            </p>
                            <a
                                href="tel:+1234567890"
                                className="text-gray-700 hover:text-gray-900 font-medium"
                            >
                                +977 9800000001
                            </a>
                        </div>

                        <div className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-[#EFE9E3] rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="w-8 h-8 text-gray-700" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">
                                Live Chat
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Available during business hours
                            </p>
                            <button className="text-gray-700 hover:text-gray-900 font-medium">
                                Start Chat
                            </button>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-white rounded-2xl p-8 md:p-12 mb-12">
                        <div className="flex items-center gap-3 mb-8">
                            <HelpCircle className="w-6 h-6 text-gray-700" />
                            <h2 className="text-3xl font-light text-gray-900">
                                Frequently Asked Questions
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {filteredFaqs.length > 0 ? (
                                filteredFaqs.map((faq, index) => (
                                    <div
                                        key={index}
                                        className="border-b border-gray-200 last:border-0"
                                    >
                                        <button
                                            onClick={() => toggleFaq(index)}
                                            className="w-full py-6 flex items-center justify-between text-left hover:text-gray-600 transition-colors"
                                        >
                                            <span className="text-lg font-medium text-gray-900 pr-4">
                                                {faq.question}
                                            </span>
                                            {openFaq === index ? (
                                                <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                            )}
                                        </button>
                                        {openFaq === index && (
                                            <div className="pb-6 text-gray-600 leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-8">
                                    No results found. Try a different search
                                    term or contact support.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-8">
                            <div className="flex items-start gap-4">
                                <Clock className="w-6 h-6 text-gray-700 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                                        Business Hours
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Sunday - Friday: 9:00 AM - 6:00 PM EST
                                        {/* <br />
                                        Saturday: 10:00 AM - 4:00 PM EST */}
                                        <br />
                                        Sunday: Closed
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-8">
                            <div className="flex items-start gap-4">
                                <MapPin className="w-6 h-6 text-gray-700 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                                        Our Location
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        123 Commerce Street
                                        <br />
                                        Lovelly Hill, CA 90210
                                        <br />
                                        Nepal
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default HelpandSupport;
