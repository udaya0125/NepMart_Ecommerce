import Navbar from "@/ContentWrapper/Navbar";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1525612/pexels-photo-1525612.jpeg"
          alt="Privacy policy hero"
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-2xl max-w-2xl">
            Learn how we collect, use, and protect your personal information.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 text-gray-800 leading-relaxed">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="mb-6">
          We value your privacy and are committed to protecting your personal
          information. This Privacy Policy outlines how we handle data when you
          use our services or visit our website.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
        <p className="mb-6">
          We may collect personal details such as your name, email address, and
          contact information when you interact with our website, make
          purchases, or subscribe to our newsletter. We also collect
          non-personal information such as browser type, IP address, and device
          details for analytics purposes.
        </p>

        <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
        <p className="mb-6">
          Your data is used to improve our services, process transactions,
          communicate updates, and personalize your experience. We do not sell
          or share your personal information with third parties except as
          required by law.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
        <p className="mb-6">
          We use industry-standard security measures to protect your personal
          data from unauthorized access, alteration, or disclosure.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
        <p className="mb-6">
          Our website may use cookies to enhance your browsing experience. You
          can disable cookies through your browser settings if you prefer.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
        <p className="mb-6">
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with an updated revision date.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact
          us at{" "}
          <a
            href="mailto:support@example.com"
            className="text-blue-600 hover:underline"
          >
            support@example.com
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
