import Footer from "@/ContentWrapper/Footer";
import Navbar from "@/ContentWrapper/Navbar";
import ReviewNotification from "@/ContentWrapper/ReviewNotification";
import ToptoBottom from "@/ContentWrapper/ToptoBottom";
import Blog from "@/MainComponents/Blog";
import Category from "@/MainComponents/Category";
import DiscountedProducts from "@/MainComponents/DiscountedProducts";
import Fashion from "@/MainComponents/Fashion";
import Hero from "@/MainComponents/Hero";
import LatestProducts from "@/MainComponents/LatestProducts";
import PopularProducts from "@/MainComponents/PopularProducts";
import Testimonial from "@/MainComponents/Testimonial";
import React from "react";

const Home = () => {
    return (
        <div>
            <Navbar />
            <Hero />
            <Category/>
            <PopularProducts/>
            <Fashion/>
            <DiscountedProducts/>
            <LatestProducts/>
            <Testimonial />
             <Blog />
             <ToptoBottom/>
             <ReviewNotification/>
            <Footer />
        </div>
    );
};

export default Home;
