"use client"

import { Header } from "@/components/Header"
import { Hero } from "@/components/Home/Hero"
import { TrendingProducts } from "@/components/HomeNew/TrendingProducts"
import { TrendingCategories } from "@/components/HomeNew/TrendingCategories"
import { NewArrivals } from "@/components/HomeNew/NewArrivals"
import { CategorySections } from "@/components/HomeNew/CategorySections"
import { BestSellers } from "@/components/HomeNew/BestSellers"
import { TrustedBrands } from "@/components/HomeNew/TrustedBrands"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { AdBanner } from "@/components/HomeNew/AdBanner"
import Footer from "@/components/footer/Footer"

export default function Homepage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section with Auto-scrolling Ads */}
        <Hero />

        
        {/* Advertisement Banner */}
        <AdBanner />

        {/* Trending Products */}
        <TrendingProducts />

        {/* Trending Categories */}
        <TrendingCategories />

        {/* New Arrivals */}
        <NewArrivals />

        {/* Category-wise Product Sections */}
        {/* <CategorySections /> */}

        {/* Best Sellers */}
        <BestSellers />

        {/* Trusted Brands */}
        <TrustedBrands />

        {/* Vendor CTA Section */}
        <section className="py-16 px-6 bg-gradient-to-r from-orange-100 via-white to-green-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Start Selling?</h2>
            <p className="text-xl text-gray-700 mb-8 opacity-90">
              Join thousands of successful vendors on our platform. Start your business journey today!
            </p>
            <Link to="/signup/vendor">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold shadow-xl transition-all duration-200 hover:scale-105 border-2 border-orange-200"
              >
                Register as Vendor
              </Button>
            </Link>
          </div>
        </section>
        
      </main>

      {/* Footer */}
      {/* <footer className="bg-gradient-to-t from-green-600 to-white text-white py-12 px-6">
  <div className="max-w-7xl mx-auto">
    <div className="grid md:grid-cols-4 gap-8"> */}
      {/* Logo + Info */}
      {/* <div>
        <div className="flex items-center space-x-2 mb-4"> */}
       {/* Logo */}

            {/* <img src="/Tie-UP-India.png" alt="Logo" className="w-12 h-12" />
            <span className="text-2xl font-bold">
              <span className="text-orange-500">Tie</span> */}
              {/* <span className="text-gray-700">-</span> */}
              {/* <span className="text-blue-200 text-stroke-sm">Up</span> */}
              {/* <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">
                  Up
                </span> */}
              {/* <span className="text-gray-700">-</span> */}
              {/* <span className="text-green-600">India</span>
            </span> */}
       

        {/* </div>
        <p className="text-gray-700">
          India's Premier B2B Marketplace connecting businesses across the nation.
        </p>
      </div> */}

      {/* Quick Links */}
      {/* <div>
        <h4 className="font-semibold mb-4 text-gray-900">Quick Links</h4>
        <div className="space-y-2">
          <Link to="/about" className="block text-gray-700 hover:text-green-700 transition-colors">
            About Us
          </Link>
          <Link to="/products" className="block text-gray-700 hover:text-green-700 transition-colors">
            Products
          </Link>
          <Link to="/signup/vendor" className="block text-gray-700 hover:text-green-700 transition-colors">
            Become a Seller
          </Link>
        </div>
      </div> */}

      {/* Connect */}
      {/* <div>
        <h4 className="font-semibold mb-4 text-gray-900">Connect</h4>
        <div className="space-y-2">
          <a href="#" className="block text-gray-700 hover:text-green-700 transition-colors">Facebook</a>
          <a href="#" className="block text-gray-700 hover:text-green-700 transition-colors">Twitter</a>
          <a href="#" className="block text-gray-700 hover:text-green-700 transition-colors">LinkedIn</a>
        </div>
      </div> */}

      {/* Contact Developer */}
      {/* <div>
        <h4 className="font-semibold mb-4 text-gray-900">Contact Developer</h4>
        <p className="text-gray-700 mb-2">Need help with this platform?</p>
        <a
          href="https://www.linkedin.com/in/prakhar-madharia-864969215/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-300 transition"
        >
          Connect on LinkedIn
        </a>
      </div>
    </div>

    <div className="border-t border-gray-300 mt-8 pt-8 text-center text-gray-600">
      <p>&copy; 2025 Tie-Up-India. All rights reserved.</p>
    </div>
  </div>
      </footer> */}
    <Footer/>
    </div>
  )
}
