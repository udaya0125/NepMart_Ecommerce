import React, { useState } from "react";
import {
    Cookie,
    Calendar,
    Download,
    Search,
    ChevronDown,
    ChevronUp,
    CheckCircle,
    XCircle,
    Settings,
} from "lucide-react";
import Footer from "@/ContentWrapper/Footer";
import Navbar from "@/ContentWrapper/Navbar";

const CookiePolicy = () => {
    const [expandedSections, setExpandedSections] = useState([0]);
    const [cookiePreferences, setCookiePreferences] = useState({
        essential: true,
        analytics: true,
        marketing: true,
        preferences: true,
    });

    const sections = [
        {
            title: "1. What Are Cookies?",
            content: `Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.

Cookies allow websites to recognize your device and remember information about your visit, such as your preferred language and other settings. This can make your next visit easier and the site more useful to you.

Cookies play an important role in helping us provide effective online services. Without cookies, we would not be able to provide many essential features and services on our website.`,
        },
        {
            title: "2. How We Use Cookies",
            content: `We use cookies for several important reasons:

To Enable Core Functionality: Some cookies are essential to help you access secure areas of our website and use its features, such as shopping carts and online billing.

To Improve Your Experience: We use cookies to remember your preferences and settings, such as your language choice, to provide a personalized experience.

To Analyze Site Usage: Cookies help us understand how visitors use our website, which pages are most popular, and how long visitors spend on each page. This information helps us improve our website and services.

To Deliver Relevant Advertising: We use cookies to show you advertisements that are relevant to your interests based on your browsing behavior.

To Enable Social Media Features: Cookies allow you to share pages and content that you find interesting through third-party social networking and other websites.`,
        },
        {
            title: "3. Types of Cookies We Use",
            content: `We use the following types of cookies on our website:

Essential Cookies (Required): These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt-out of these cookies as they are essential for the site to work.

Analytics Cookies (Optional): These cookies collect information about how visitors use our website, such as which pages are visited most often and if users receive error messages. These cookies help us improve how our website works.

Marketing Cookies (Optional): These cookies are used to deliver advertisements that are relevant to you and your interests. They are also used to limit the number of times you see an advertisement and help measure the effectiveness of advertising campaigns.

Preference Cookies (Optional): These cookies allow our website to remember choices you make (such as your username, language, or region) and provide enhanced, personalized features. They may also be used to provide services you have requested.`,
        },
        {
            title: "4. First-Party vs Third-Party Cookies",
            content: `First-Party Cookies: These are cookies set by our website directly. We have full control over these cookies and they are used to improve your experience on our site.

Third-Party Cookies: These are cookies set by domains other than the one you are visiting. For example, if you visit our website and we use Google Analytics, Google may set a cookie on your device. We use third-party cookies from trusted partners to:
• Analyze website traffic and user behavior
• Deliver targeted advertising
• Provide social media features
• Enable payment processing

We carefully select our third-party partners and require them to handle your data responsibly and in accordance with privacy laws.`,
        },
        {
            title: "5. Session vs Persistent Cookies",
            content: `Session Cookies: These are temporary cookies that remain in your browser only until you close it. They are deleted automatically when you exit your browser. Session cookies help us track your movement from page to page so you don't get asked for the same information repeatedly.

Persistent Cookies: These cookies remain on your device for a set period specified in the cookie (ranging from a few minutes to several years). They are activated each time you visit the website that created that particular cookie. We use persistent cookies to remember your preferences and to recognize you when you return to our website.`,
        },
        {
            title: "6. Specific Cookies We Use",
            content: `Essential Cookies:
• Session ID: Maintains your session across pages
• Authentication Token: Keeps you logged in
• Shopping Cart: Remembers items in your cart
• Security: Protects against cross-site request forgery

Analytics Cookies:
• Google Analytics (_ga, _gid): Tracks website usage and traffic
• Hotjar: Records user behavior for website optimization

Marketing Cookies:
• Facebook Pixel: Delivers targeted Facebook ads
• Google Ads: Shows relevant advertisements
• Retargeting Pixels: Displays personalized ads across the web

Preference Cookies:
• Language: Remembers your language preference
• Region: Stores your location settings
• Theme: Saves your display preferences`,
        },
        {
            title: "7. How Long Cookies Remain on Your Device",
            content: `The length of time a cookie will remain on your device depends on whether it is a session or persistent cookie:

Session Cookies: Deleted when you close your browser (typically a few minutes to a few hours)

Persistent Cookies: Remain until deleted or they reach their expiration date. The expiration period varies:
• Essential cookies: Usually 1-2 years
• Analytics cookies: Typically 2 years
• Marketing cookies: Usually 30 days to 2 years
• Preference cookies: Generally 1 year

You can manually delete cookies at any time through your browser settings.`,
        },
        {
            title: "8. Managing Your Cookie Preferences",
            content: `You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by:

Using Our Cookie Settings Tool: You can set your cookie preferences using our cookie management tool available on this page and in our cookie banner.

Browser Settings: Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.

Browser Add-ons: You can use browser add-ons and plugins to block certain types of cookies.

Opt-Out Links: Many advertising networks provide ways to opt out of targeted advertising. Visit www.aboutads.info or www.youronlinechoices.com for more information.

Please note that if you choose to block all cookies, you may not be able to access all or parts of our website, and some features may not function properly.`,
        },
        {
            title: "9. Third-Party Cookie Policies",
            content: `We use services from various third-party providers who may set cookies on your device. These providers have their own privacy and cookie policies:

Google Analytics: https://policies.google.com/privacy
Facebook: https://www.facebook.com/privacy
PayPal: https://www.paypal.com/privacy
Stripe: https://stripe.com/privacy

We recommend reviewing the privacy policies of these third-party services to understand how they use cookies and protect your data.

We are not responsible for the cookies set by third-party websites or services. If you have questions about third-party cookies, please contact the relevant third party directly.`,
        },
        {
            title: "10. Do Not Track Signals",
            content: `Some browsers incorporate a "Do Not Track" (DNT) feature that signals to websites you visit that you do not want to have your online activity tracked.

Currently, there is no industry standard for recognizing or honoring DNT signals, and we do not currently respond to DNT signals. We will continue to monitor developments in this area and update our practices as standards emerge.

If you wish to minimize tracking, you can adjust your cookie preferences using our cookie management tool or your browser settings.`,
        },
        {
            title: "11. Updates to This Cookie Policy",
            content: `We may update this Cookie Policy from time to time to reflect changes in technology, legislation, our operations, or for other operational, legal, or regulatory reasons.

When we update this policy, we will update the "Last Updated" date at the top of this page. We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies.

If we make significant changes to this Cookie Policy, we will notify you by email (if you have provided your email address) or by placing a prominent notice on our website.`,
        },
        {
            title: "12. Contact Us About Cookies",
            content: `If you have any questions about our use of cookies or this Cookie Policy, please contact us:

Email: privacy@store.com
Phone: +1 (234) 567-8900
Address: 123 Commerce Street, New York, NY 10013, United States

Data Protection Officer: dpo@store.com

We will respond to all inquiries within 30 days. Your feedback helps us improve our cookie practices and ensure we protect your privacy.`,
        },
    ];

    const cookieTypes = [
        {
            name: "Essential Cookies",
            id: "essential",
            description: "Required for the website to function properly",
            examples: "Login sessions, shopping cart, security",
            required: true,
        },
        {
            name: "Analytics Cookies",
            id: "analytics",
            description: "Help us understand how visitors use our website",
            examples: "Google Analytics, page views, user behavior",
            required: false,
        },
        {
            name: "Marketing Cookies",
            id: "marketing",
            description: "Used to deliver relevant advertisements",
            examples: "Facebook Pixel, Google Ads, retargeting",
            required: false,
        },
        {
            name: "Preference Cookies",
            id: "preferences",
            description: "Remember your choices and settings",
            examples: "Language, region, display preferences",
            required: false,
        },
    ];

    const toggleSection = (index) => {
        if (expandedSections.includes(index)) {
            setExpandedSections(expandedSections.filter((i) => i !== index));
        } else {
            setExpandedSections([...expandedSections, index]);
        }
    };

    const expandAll = () => {
        setExpandedSections(sections.map((_, index) => index));
    };

    const collapseAll = () => {
        setExpandedSections([]);
    };

    const toggleCookie = (id) => {
        if (id !== "essential") {
            setCookiePreferences({
                ...cookiePreferences,
                [id]: !cookiePreferences[id],
            });
        }
    };

    const savePreferences = () => {
        // Save preferences logic here
        alert("Cookie preferences saved successfully!");
    };

    return (
        <>
            <Navbar />
            <div className="">
                <div className="max-w-7xl mx-auto px-4 py-24">
                    <div className="flex items-center gap-3 mb-6">
                        <Settings className="w-6 h-6 text-gray-700" />
                        <h2 className="text-2xl font-light text-gray-900">
                            Manage Cookie Preferences
                        </h2>
                    </div>
                    {/* Cookie Preferences Manager */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <div className="space-y-4 mb-6">
                            {cookieTypes.map((cookie) => (
                                <div
                                    key={cookie.id}
                                    className="border border-gray-200 rounded-xl p-6"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {cookie.name}
                                                </h3>
                                                {cookie.required && (
                                                    <span className="text-xs px-3 py-1 bg-gray-900 text-white rounded-full">
                                                        Required
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 mb-2">
                                                {cookie.description}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Examples: {cookie.examples}
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={
                                                    cookiePreferences[cookie.id]
                                                }
                                                onChange={() =>
                                                    toggleCookie(cookie.id)
                                                }
                                                disabled={cookie.required}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={savePreferences}
                                className="px-6 py-3 w-64 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
                            >
                                Save Preferences
                            </button>
                        </div>
                    </div>

                    {/* Policy Sections */}
                    <div className="bg-white rounded-2xl p-8 md:p-12">
                        <div className="space-y-6">
                            {sections.map((section, index) => (
                                <div
                                    key={index}
                                    id={`section-${index}`}
                                    className="border-b border-gray-200 last:border-0 pb-6 last:pb-0"
                                >
                                    <button
                                        onClick={() => toggleSection(index)}
                                        className="w-full flex items-center justify-between text-left mb-4 group"
                                    >
                                        <h2 className="text-xl md:text-2xl font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                                            {section.title}
                                        </h2>
                                        {expandedSections.includes(index) ? (
                                            <ChevronUp className="w-6 h-6 text-gray-500 flex-shrink-0" />
                                        ) : (
                                            <ChevronDown className="w-6 h-6 text-gray-500 flex-shrink-0" />
                                        )}
                                    </button>
                                    {expandedSections.includes(index) && (
                                        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {section.content}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CookiePolicy;
