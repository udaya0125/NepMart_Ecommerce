import React, { useState } from "react";
import {
    FileText,
    Calendar,
    Download,
    ChevronDown,
    ChevronUp,
    Settings,
} from "lucide-react";
import Footer from "@/ContentWrapper/Footer";
import Navbar from "@/ContentWrapper/Navbar";

const PrivacyPolicy = () => {
    const [expandedSections, setExpandedSections] = useState([0]);

    const sections = [
        {
            title: "1. Introduction",
            content: `Welcome to our Privacy Policy. This policy describes how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.

We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.`,
        },
        {
            title: "2. Information We Collect",
            content: `We collect information about you in a variety of ways. The information we may collect on the Site includes:

Personal Data: Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards.

Derivative Data: Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.

Financial Data: Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site. We store only very limited, if any, financial information that we collect.

Mobile Device Data: Device information, such as your mobile device ID, model, and manufacturer, and information about the location of your device, if you access the Site from a mobile device.`,
        },
        {
            title: "3. Use of Your Information",
            content: `Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:

• Create and manage your account
• Process your transactions and send you related information
• Email you regarding your account or order
• Fulfill and manage purchases, orders, payments, and other transactions
• Generate a personal profile about you to make future visits to the Site more personalized
• Increase the efficiency and operation of the Site
• Monitor and analyze usage and trends to improve your experience with the Site
• Notify you of updates to the Site
• Offer new products, services, and/or recommendations to you
• Perform other business activities as needed
• Prevent fraudulent transactions, monitor against theft, and protect against criminal activity
• Request feedback and contact you about your use of the Site
• Resolve disputes and troubleshoot problems
• Respond to product and customer service requests
• Send you a newsletter`,
        },
        {
            title: "4. Disclosure of Your Information",
            content: `We may share information we have collected about you in certain situations. Your information may be disclosed as follows:

By Law or to Protect Rights: If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.

Third-Party Service Providers: We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.

Marketing Communications: With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes, as permitted by law.

Business Transfers: We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.

Affiliates: We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy.`,
        },
        {
            title: "5. Tracking Technologies",
            content: `Cookies and Web Beacons: We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site.

Internet-Based Advertising: Additionally, we may use third-party software to serve ads on the Site, implement email marketing campaigns, and manage other interactive marketing initiatives. This third-party software may use cookies or similar tracking technology to help manage and optimize your online experience with us.

Website Analytics: We may also partner with selected third-party vendors to allow tracking technologies and remarketing services on the Site through the use of first party cookies and third-party cookies, to, among other things, analyze and track users' use of the Site, determine the popularity of certain content, and better understand online activity.`,
        },
        {
            title: "6. Third-Party Websites",
            content: `The Site may contain links to third-party websites and applications of interest, including advertisements and external services, that are not affiliated with us. Once you have used these links to leave the Site, any information you provide to these third parties is not covered by this Privacy Policy, and we cannot guarantee the safety and privacy of your information.

Before visiting and providing any information to any third-party websites, you should inform yourself of the privacy policies and practices (if any) of the third party responsible for that website, and should take those steps necessary to, in your discretion, protect the privacy of your information. We are not responsible for the content or privacy and security practices and policies of any third parties.`,
        },
        {
            title: "7. Security of Your Information",
            content: `We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.

Any information disclosed online is vulnerable to interception and misuse by unauthorized parties. Therefore, we cannot guarantee complete security if you provide personal information.`,
        },
        {
            title: "8. Policy for Children",
            content: `We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.`,
        },
        {
            title: "9. Your Rights and Choices",
            content: `Depending on your location, you may have certain rights regarding your personal information:

• Right to Access: You have the right to request access to the personal information we hold about you
• Right to Rectification: You have the right to request that we correct any inaccurate personal information
• Right to Erasure: You have the right to request deletion of your personal information
• Right to Restrict Processing: You have the right to request that we restrict the processing of your personal information
• Right to Data Portability: You have the right to receive your personal information in a structured, commonly used format
• Right to Object: You have the right to object to our processing of your personal information
• Right to Withdraw Consent: You have the right to withdraw your consent at any time

To exercise these rights, please contact us using the information provided in the Contact Us section.`,
        },
        {
            title: "10. California Privacy Rights",
            content: `California Civil Code Section 1798.83, also known as the "Shine The Light" law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year.

If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.`,
        },
        {
            title: "11. GDPR Compliance",
            content: `If you are located in the European Economic Area (EEA), you have certain data protection rights under the General Data Protection Regulation (GDPR). We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your personal information.

Legal Basis for Processing: We process your personal information under the following legal bases:
• Your consent
• Performance of a contract with you
• Compliance with legal obligations
• Our legitimate interests

International Data Transfers: Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.`,
        },
        {
            title: "12. Changes to This Privacy Policy",
            content: `We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.

You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.`,
        },
        {
            title: "13. Contact Us",
            content: `If you have questions or comments about this Privacy Policy, please contact us at:

Email: privacy@store.com
Phone: +1 (234) 567-8900
Address: 123 Commerce Street, New York, NY 10013, United States

Our Data Protection Officer can be reached at: dpo@store.com

We will respond to all requests, inquiries, or concerns within 30 days.`,
        },
    ];

    const toggleSection = (index) => {
        if (expandedSections.includes(index)) {
            setExpandedSections(expandedSections.filter((i) => i !== index));
        } else {
            setExpandedSections([...expandedSections, index]);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#EFE9E3]">
                <div className="max-w-7xl mx-auto px-4 py-24">
                    {/* Policy Sections */}
                    <div className="flex items-center gap-3 mb-6">
                        <Settings className="w-6 h-6 text-gray-700" />
                        <h2 className="text-2xl font-light text-gray-900">
                            Privacy Policy
                        </h2>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg  p-8 md:p-12">
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

                    {/* Contact Footer */}
                    <div className="mt-8 bg-white rounded-2xl p-8 border-l-4 border-gray-900">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">
                            Questions About This Policy?
                        </h3>
                        <p className="text-gray-700 mb-4">
                            If you have any questions, concerns, or requests
                            regarding this Privacy Policy, please don't hesitate
                            to contact our privacy team.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="mailto:privacy@store.com"
                                className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors text-center font-medium"
                            >
                                Email Privacy Team
                            </a>
                            <a
                                href="/help-support"
                                className="px-6 py-3 bg-[#EFE9E3] text-gray-900 rounded-full hover:bg-gray-300 transition-colors text-center font-medium"
                            >
                                Visit Help Center
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;
