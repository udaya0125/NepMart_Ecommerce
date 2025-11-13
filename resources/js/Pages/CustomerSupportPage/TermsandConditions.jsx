import React, { useState } from "react";
import {
    FileCheck,
    Calendar,
    Download,
    CheckCircle,
    ChevronUp,
    ChevronDown,
    Settings,
} from "lucide-react";
import Footer from "@/ContentWrapper/Footer";
import Navbar from "@/ContentWrapper/Navbar";

const TermsandConditions = () => {
    const [expandedSections, setExpandedSections] = useState([0]);

    const sections = [
        {
            title: "1. Agreement to Terms",
            content: `By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.

These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and our company ("Company", "we", "us", or "our"), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.

You agree that by accessing the Site, you have read, understood, and agreed to be bound by all of these Terms and Conditions. If you do not agree with all of these Terms and Conditions, then you are expressly prohibited from using the Site and you must discontinue use immediately.`,
        },
        {
            title: "2. Intellectual Property Rights",
            content: `Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws of the United States, international copyright laws, and international conventions.

The Content and the Marks are provided on the Site "AS IS" for your information and personal use only. Except as expressly provided in these Terms and Conditions, no part of the Site and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.

Provided that you are eligible to use the Site, you are granted a limited license to access and use the Site and to download or print a copy of any portion of the Content to which you have properly gained access solely for your personal, non-commercial use. We reserve all rights not expressly granted to you in and to the Site, the Content and the Marks.`,
        },
        {
            title: "3. User Representations",
            content: `By using the Site, you represent and warrant that:
• All registration information you submit will be true, accurate, current, and complete
• You will maintain the accuracy of such information and promptly update such registration information as necessary
• You have the legal capacity and you agree to comply with these Terms and Conditions
• You are not a minor in the jurisdiction in which you reside
• You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise
• You will not use the Site for any illegal or unauthorized purpose
• Your use of the Site will not violate any applicable law or regulation

If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Site (or any portion thereof).`,
        },
        {
            title: "4. User Registration",
            content: `You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.

You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password, whether your password is with our Service or a third-party service.`,
        },
        {
            title: "5. Prohibited Activities",
            content: `You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.

As a user of the Site, you agree not to:
• Systematically retrieve data or other content from the Site to create or compile a collection
• Make any unauthorized use of the Site, including collecting usernames and/or email addresses
• Use the Site to advertise or offer to sell goods and services
• Circumvent, disable, or otherwise interfere with security-related features of the Site
• Engage in unauthorized framing of or linking to the Site
• Trick, defraud, or mislead us and other users
• Make improper use of our support services or submit false reports of abuse or misconduct
• Engage in any automated use of the system
• Interfere with, disrupt, or create an undue burden on the Site or the networks
• Attempt to impersonate another user or person
• Use any information obtained from the Site to harass, abuse, or harm another person
• Use the Site as part of any effort to compete with us or otherwise use the Site for any revenue-generating endeavor
• Decipher, decompile, disassemble, or reverse engineer any of the software comprising the Site
• Harass, annoy, intimidate, or threaten any of our employees or agents
• Delete the copyright or other proprietary rights notice from any Content
• Upload or transmit viruses, Trojan horses, or other material that interferes with any party's use of the Site
• Upload or transmit any material that acts as a passive or active information collection mechanism
• Except as may be the result of standard search engine or Internet browser usage, use any manual process to monitor or copy any of the material on the Site
• Use the Site in a manner inconsistent with any applicable laws or regulations`,
        },
        {
            title: "6. Purchases and Payment",
            content: `We accept the following forms of payment:
• Visa
• Mastercard
• American Express
• Discover
• PayPal
• Apple Pay
• Google Pay

You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed.

We reserve the right to refuse any order placed through the Site. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. These restrictions may include orders placed by or under the same customer account, the same payment method, and/or orders that use the same billing or shipping address.

Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. All payments shall be in U.S. dollars.`,
        },
        {
            title: "7. Return and Refund Policy",
            content: `Please review our Return and Refund Policy posted on the Site prior to making any purchases. Our return policy is designed to ensure customer satisfaction while protecting against abuse.

All sales are final unless otherwise stated. Returns must be requested within 30 days of delivery. Items must be unused, in original packaging, and with all tags attached. We reserve the right to refuse returns that do not meet our return policy requirements.

Refunds will be processed within 5-7 business days after we receive and inspect the returned item. Refunds will be issued to the original payment method. Shipping costs are non-refundable unless the return is due to our error.`,
        },
        {
            title: "8. Shipping and Delivery",
            content: `We ship to addresses within the United States and internationally to select countries. Shipping costs are calculated based on the weight of your order and your shipping address.

Standard shipping takes 5-7 business days, Express shipping takes 2-3 business days, and Overnight shipping delivers the next business day. International shipping times vary by destination and typically take 10-15 business days.

We are not responsible for delays caused by the shipping carrier, customs clearance, or events beyond our control. Risk of loss and title for items purchased from the Site pass to you upon delivery to the carrier.`,
        },
        {
            title: "9. User Data",
            content: `We will maintain certain data that you transmit to the Site for the purpose of managing the performance of the Site, as well as data relating to your use of the Site. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Site.

You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption of such data.`,
        },
        {
            title: "10. Electronic Communications and Signatures",
            content: `Visiting the Site, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Site, satisfy any legal requirement that such communication be in writing.

You hereby agree to the use of electronic signatures, contracts, orders, and other records, and to electronic delivery of notices, policies, and records of transactions initiated or completed by us or via the Site.`,
        },
        {
            title: "11. Disclaimer of Warranties",
            content: `THE SITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SITE AND OUR SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SITE AND YOUR USE THEREOF.

WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SITE'S CONTENT OR THE CONTENT OF ANY WEBSITES LINKED TO THE SITE AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY:
• ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS
• PERSONAL INJURY OR PROPERTY DAMAGE RESULTING FROM YOUR ACCESS TO AND USE OF THE SITE
• ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS
• ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SITE
• ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE SITE
• ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS`,
        },
        {
            title: "12. Limitation of Liability",
            content: `IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SITE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO US DURING THE SIX (6) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION ARISING.`,
        },
        {
            title: "13. Indemnification",
            content: `You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys' fees and expenses, made by any third party due to or arising out of:
• Your contributions
• Use of the Site
• Breach of these Terms and Conditions
• Any breach of your representations and warranties set forth in these Terms and Conditions
• Your violation of the rights of a third party, including but not limited to intellectual property rights
• Any overt harmful act toward any other user of the Site with whom you connected via the Site`,
        },
        {
            title: "14. Governing Law and Dispute Resolution",
            content: `These Terms and Conditions and your use of the Site are governed by and construed in accordance with the laws of the State of New York applicable to agreements made and to be entirely performed within the State of New York, without regard to its conflict of law principles.

Any legal action of whatever nature brought by either you or us shall be commenced or prosecuted in the state and federal courts located in New York County, New York, and the parties hereby consent to, and waive all defenses of lack of personal jurisdiction and forum non conveniens with respect to venue and jurisdiction in such state and federal courts.

We will try to resolve disputes amicably. If we cannot resolve a dispute within 30 days, either party may initiate formal proceedings.`,
        },
        {
            title: "15. Modifications and Interruptions",
            content: `We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We also reserve the right to modify or discontinue all or part of the Site without notice at any time.

We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Site. We cannot guarantee the Site will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Site, resulting in interruptions, delays, or errors.

We reserve the right to change, revise, update, suspend, discontinue, or otherwise modify the Site at any time or for any reason without notice to you. You agree that we have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the Site during any downtime or discontinuance of the Site.`,
        },
        {
            title: "16. Term and Termination",
            content: `These Terms and Conditions shall remain in full force and effect while you use the Site. WITHOUT LIMITING ANY OTHER PROVISION OF THESE TERMS AND CONDITIONS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SITE TO ANY PERSON FOR ANY REASON OR FOR NO REASON.

If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party.

In addition to terminating or suspending your account, we reserve the right to take appropriate legal action, including without limitation pursuing civil, criminal, and injunctive redress.`,
        },
        {
            title: "17. Contact Information",
            content: `In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:

Email: legal@store.com
Phone: +1 (234) 567-8900
Address: 123 Commerce Street, New York, NY 10013, United States

We will respond to all inquiries within 5 business days.`,
        },
    ];

    const toggleSection = (index) => {
        if (expandedSections.includes(index)) {
            setExpandedSections(expandedSections.filter((i) => i !== index));
        } else {
            setExpandedSections([...expandedSections, index]);
        }
    };

    const keyPoints = [
        "You must be 18+ to use our services",
        "All content is protected by copyright",
        "Account security is your responsibility",
        "We reserve the right to modify terms",
        "Purchases are subject to our refund policy",
        "You agree to use the site lawfully",
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#EFE9E3] ">
                <div className="max-w-7xl mx-auto px-4 py-24 ">
                    <div className="flex items-center gap-3 mb-6">
                        <Settings className="w-6 h-6 text-gray-700" />
                        <h2 className="text-2xl font-light text-gray-900">
                            Manage Cookie Preferences
                        </h2>
                    </div>
                    {/* Key Points */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <h2 className="text-xl font-medium text-gray-900 mb-6">
                            Key Points
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {keyPoints.map((point, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3"
                                >
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">
                                        {point}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Terms Sections */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
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

                    {/* Acceptance Notice */}
                    <div className="mt-8 bg-white rounded-2xl p-8 border-l-4 border-gray-900">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">
                            Acceptance of Terms
                        </h3>
                        <p className="text-gray-700 mb-4">
                            By using our website and services, you acknowledge
                            that you have read, understood, and agree to be
                            bound by these Terms and Conditions. If you do not
                            agree to these terms, please discontinue use of our
                            services immediately.
                        </p>
                        <p className="text-sm text-gray-600">
                            These terms were last updated on November 12, 2025.
                            We reserve the right to modify these terms at any
                            time. Continued use of our services after changes
                            constitutes acceptance of the modified terms.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TermsandConditions;
