import React, { useState } from "react";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import Footer from "@/ContentWrapper/Footer";
import Navbar from "@/ContentWrapper/Navbar";

const ContactUs = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const templateParams = {
                from_name: data.name,
                from_email: data.email,
                message: data.message,
                to_name: "Your Company", // You can customize this
            };

            await emailjs.send(
                import.meta.env.VITE_service_id,
                import.meta.env.VITE_template_id_contact,
                templateParams,
                import.meta.env.VITE_public_key
            );

            setSubmitStatus({
                type: "success",
                message: "Message sent successfully! We'll get back to you soon.",
            });
            reset();
        } catch (error) {
            console.error("EmailJS Error:", error);
            setSubmitStatus({
                type: "error",
                message: "Failed to send message. Please try again later.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="relative h-[550px] overflow-hidden">
                <img
                    src="https://images.pexels.com/photos/1525612/pexels-photo-1525612.jpeg"
                    alt="Products hero image"
                    className="w-full h-full object-cover"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Text Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                    <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
                        Contact Page
                    </h1>
                    <p className="text-xl md:text-2xl text-center max-w-2xl mb-8">
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Sed, eligendi quibusdam odio totam quod unde quae
                        suscipit doloremque itaque iure optio at cum corrupti
                        nesciunt vitae possimus porro ipsa excepturi?
                    </p>
                </div>
            </div>

            {/* Map Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 mt-4 px-6 md:px-12 mb-6 gap-8">
                <div className="w-full h-[450px] md:h-[500px] lg:h-[550px] overflow-hidden rounded-xl shadow-lg sticky top-32 self-start">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d1787.1372630750714!2d83.97662754194413!3d28.229288200915114!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2snp!4v1760679190550!5m2!1sen!2snp"
                        className="w-full h-full border-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

                {/* Contact Form */}
                <div className="bg-[#f4f3ef] rounded-xl shadow-lg p-6 md:p-8">
                    <div className="flex flex-col justify-center items-center">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                            Contact Us
                        </h2>
                        <p className="text-gray-600 mb-6">
                            We'd love to hear from you! Please fill out the form
                            below.
                        </p>
                    </div>

                    {/* Status Messages */}
                    {submitStatus && (
                        <div
                            className={`mb-4 p-4 rounded-lg ${
                                submitStatus.type === "success"
                                    ? "bg-green-100 text-green-700 border border-green-300"
                                    : "bg-red-100 text-red-700 border border-red-300"
                            }`}
                        >
                            {submitStatus.message}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        {/* Name */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                {...register("name", {
                                    required: "Name is required",
                                })}
                                placeholder="Enter your name"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                disabled={isSubmitting}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: "Invalid email address",
                                    },
                                })}
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                disabled={isSubmitting}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Your Message
                            </label>
                            <textarea
                                {...register("message", {
                                    required: "Message is required",
                                })}
                                rows="5"
                                placeholder="Write your message here..."
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                disabled={isSubmitting}
                            ></textarea>
                            {errors.message && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.message.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-300 ${
                                isSubmitting
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-blue-700"
                            }`}
                        >
                            {isSubmitting ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ContactUs;