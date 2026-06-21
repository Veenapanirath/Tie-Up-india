import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Hero } from "../Home/Hero";
import Footer from "../footer/Footer";

const PrivacyPolicy = () => {
  return (
       <><header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/Tie-UP-India.png" alt="Logo" className="w-12 h-12" />
            <span className="text-2xl font-bold">
              <span className="text-orange-500">Tie</span>
              {/* <span className="text-gray-700">-</span> */}
              {/* <span className="text-blue-200 text-stroke-sm">Up</span> */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">
                  Up
                </span>
              {/* <span className="text-gray-700">-</span> */}
              <span className="text-green-600">India</span>
            </span>
          </Link>


                  <nav className="hidden md:flex items-center space-x-8">
                      <Link to="/" className="text-gray-700 hover:text-primary">Home</Link>
                      <Link to="/products" className="text-gray-700 hover:text-primary">Shop</Link>
                      <Link to="/about" className="text-gray-700 hover:text-primary">About</Link>
                      <Link to="/privacy" className="text-gray-700 hover:text-primary">Privacy</Link>
                      <Link to="/contact" className="text-gray-700 hover:text-primary">Contact</Link>
                      <Link to="/signup/vendor" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
                          Become a Seller
                      </Link>
                  </nav>

                  <div className="flex items-center space-x-4">
                      <Link to="/products">
                          <Button variant="ghost" size="sm">
                              🔍
                          </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                          🛒
                      </Button>
                      <Link to="/login">
                          <Button variant="ghost" size="sm">
                              👤
                          </Button>
                      </Link>
                  </div>
              </div>
          </div>
      </header>
      {/* <Hero /> */}
      <div className="bg-white text-gray-800 px-4 sm:px-6 lg:px-8 py-12 max-w-5xl mx-auto">
              <h1 className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-8 text-center">
                  Privacy Policy
              </h1>

              <section className="space-y-6 text-gray-700 text-base leading-relaxed">
                  <p>
                      Tie Up India respects your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our platform.
                  </p>

                  <div>
                      <h2 className="text-xl font-semibold text-indigo-500 mb-2">Information We Collect</h2>
                      <ul className="list-disc pl-6 space-y-1">
                          <li>Contact information (name, email, phone number)</li>
                          <li>Business information (company name, industry)</li>
                          <li>Payment information (for subscription charges)</li>
                      </ul>
                  </div>

                  <div>
                      <h2 className="text-xl font-semibold text-indigo-500 mb-2">How We Use Your Information</h2>
                      <ul className="list-disc pl-6 space-y-1">
                          <li>To provide and improve our services</li>
                          <li>To facilitate connections between buyers and listed businesses</li>
                          <li>To send notifications and updates about our platform</li>
                      </ul>
                  </div>

                  <div>
                      <h2 className="text-xl font-semibold text-indigo-500 mb-2">Sharing Your Information</h2>
                      <ul className="list-disc pl-6 space-y-1">
                          <li>We do not sell or rent your personal information to third parties.</li>
                          <li>We may share your information with listed businesses or buyers to facilitate transactions.</li>
                      </ul>
                  </div>

                  <div>
                      <h2 className="text-xl font-semibold text-indigo-500 mb-2">Security Measures</h2>
                      <p>
                          We implement industry-standard security measures to protect your personal information from unauthorized access or disclosure.
                      </p>
                  </div>

                  <div>
                      <h2 className="text-xl font-semibold text-indigo-500 mb-2">Your Rights</h2>
                      <p>
                          You have the right to access, modify, or delete your personal information. You can request this by contacting us using the details provided below.
                      </p>
                  </div>

                  <div>
                      <h2 className="text-xl font-semibold text-indigo-500 mb-2">Changes to This Policy</h2>
                      <p>
                          We reserve the right to update this Privacy Policy at any time. We recommend reviewing it regularly to stay informed of any changes.
                      </p>
                  </div>

                  <div>
                      <h2 className="text-xl font-semibold text-indigo-500 mb-2">Contact Us</h2>
                      <p>
                          If you have any questions or concerns regarding this Privacy Policy, please contact us at:
                          <br />
                          <strong>Email:</strong> <a href="mailto:support@tieupindia.com" className="text-indigo-600 hover:underline">support@tieupindia.com</a>
                      </p>
                  </div>
              </section>

              <p className="text-center text-sm text-gray-500 mt-10">
                  By using our platform, you acknowledge that you have read and understood this Privacy Policy.
              </p>
          </div>
          
          <Footer/>
          </>
  );
};

export default PrivacyPolicy;
