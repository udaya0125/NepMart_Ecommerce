import React, { useState } from "react";
import {
    Shield,
    Lock,
    Eye,
    Database,
    UserCheck,
    Globe,
    FileText,
    Bell,
    ChevronRight,
} from "lucide-react";
import Navbar from "@/ContentWrapper/Navbar";
import Footer from "@/ContentWrapper/Footer";

const PrivacyandSecurity = () => {
    const [activeSection, setActiveSection] = useState(null);

    const sections = [
        {
            icon: Database,
            title: "Information We Collect",
            content:
                "We collect information that you provide directly to us, including your name, email address, postal address, phone number, and payment information when you make a purchase. We also automatically collect certain information about your device when you use our services, including IP address, browser type, and browsing behavior on our site.",
        },
        {
            icon: Eye,
            title: "How We Use Your Information",
            content:
                "We use the information we collect to process your orders, communicate with you about your purchases, provide customer support, send you marketing communications (with your consent), improve our website and services, and prevent fraud and enhance security. We never sell your personal information to third parties.",
        },
        {
            icon: Lock,
            title: "Data Security",
            content:
                "We implement industry-standard security measures to protect your personal information, including SSL encryption for all data transmission, secure payment processing through PCI-compliant providers, regular security audits and updates, and restricted access to personal data within our organization. All passwords are encrypted and stored securely.",
        },
        {
            icon: UserCheck,
            title: "Your Privacy Rights",
            content:
                "You have the right to access, correct, or delete your personal information at any time. You can opt-out of marketing communications, request a copy of your data, request data portability, and withdraw consent for data processing. Contact us at privacy@store.com to exercise these rights.",
        },
        {
            icon: Globe,
            title: "Cookies & Tracking",
            content:
                "We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. Essential cookies are necessary for site functionality, while analytics cookies help us improve our services. You can manage your cookie preferences through your browser settings at any time.",
        },
        {
            icon: FileText,
            title: "Third-Party Services",
            content:
                "We work with trusted third-party service providers for payment processing, shipping, marketing, and analytics. These partners are contractually obligated to protect your information and use it only for the services they provide to us. We carefully vet all partners for security and privacy compliance.",
        },
    ];

    const securityFeatures = [
        {
            icon: Shield,
            title: "SSL Encryption",
            description: "All data transmitted is encrypted with 256-bit SSL",
        },
        {
            icon: Lock,
            title: "Secure Payments",
            description: "PCI-DSS compliant payment processing",
        },
        {
            icon: UserCheck,
            title: "Privacy Compliance",
            description: "GDPR and CCPA compliant practices",
        },
        {
            icon: Bell,
            title: "Breach Notification",
            description:
                "Immediate notification in case of any security incident",
        },
    ];

    return (
        <>
            <Navbar />
            <div className="">
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
                {/* Header Section */}
                <div className="bg-white shadow-sm">
                    <div className="max-w-6xl mx-auto px-4 py-16 text-center">
                        <div className="w-20 h-20 bg-[#EFE9E3] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Shield className="w-10 h-10 text-gray-700" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
                            Privacy & Security
                        </h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Your privacy and security are our top priorities.
                            Learn how we protect and handle your information.
                        </p>
                        <p className="text-sm text-gray-500 mt-4">
                            Last updated: November 2025
                        </p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-12">
                    {/* Security Features Grid */}
                    <div className="grid md:grid-cols-4 gap-6 mb-16">
                        {securityFeatures.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
                                >
                                    <div className="w-14 h-14 bg-[#EFE9E3] rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-7 h-7 text-gray-700" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Main Content Sections */}
                    <div className="bg-white rounded-2xl p-8 md:p-12 mb-12">
                        <h2 className="text-3xl font-light text-gray-900 mb-8">
                            Privacy Policy Details
                        </h2>

                        <div className="space-y-4">
                            {sections.map((section, index) => {
                                const Icon = section.icon;
                                const isActive = activeSection === index;

                                return (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors"
                                    >
                                        <button
                                            onClick={() =>
                                                setActiveSection(
                                                    isActive ? null : index
                                                )
                                            }
                                            className="w-full p-6 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="w-12 h-12 bg-[#EFE9E3] rounded-full flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-6 h-6 text-gray-700" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-medium text-gray-900">
                                                    {section.title}
                                                </h3>
                                            </div>
                                            <ChevronRight
                                                className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
                                                    isActive ? "rotate-90" : ""
                                                }`}
                                            />
                                        </button>

                                        {isActive && (
                                            <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-6">
                                                {section.content}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-white rounded-2xl p-8 md:p-12">
                        <div className="max-w-7xl mx-auto text-center">
                            <h2 className="text-2xl font-light text-gray-900 mb-4">
                                Questions About Your Privacy?
                            </h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                If you have any questions, concerns, or requests
                                regarding your privacy or data security, our
                                dedicated privacy team is here to help. We're
                                committed to transparency and will respond to
                                all inquiries within 48 hours.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="mailto:privacy@store.com"
                                    className="px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
                                >
                                    Email Privacy Team
                                </a>
                                <a
                                    href="/help-support"
                                    className="px-8 py-3 bg-[#EFE9E3] text-gray-900 rounded-full hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Visit Help Center
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="mt-12 bg-white rounded-2xl p-8 border-l-4 border-gray-900">
                        <p className="text-sm text-gray-600 leading-relaxed">
                            <strong className="text-gray-900">
                                Important:
                            </strong>{" "}
                            We may update this Privacy & Security policy from
                            time to time to reflect changes in our practices or
                            legal requirements. We will notify you of any
                            material changes by posting the updated policy on
                            this page and updating the "Last updated" date. Your
                            continued use of our services after such changes
                            constitutes acceptance of the updated policy.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyandSecurity;
