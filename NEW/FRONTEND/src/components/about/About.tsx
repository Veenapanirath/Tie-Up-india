import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Hero } from "../Home/Hero";
import Footer from "../footer/Footer";
// import icon from "/Tie-UP-India.png"

const AboutUs = () => {
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
      </header><Hero /><div className="bg-white text-gray-800">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                  {/* Hero Title */}
                  <div className="text-center mb-12">
                      <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-600 mb-4">Welcome to Tie Up India</h1>
                      <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                          A platform built by innovators, entrepreneurs, and problem-solvers to revolutionize Indian B2B trade.
                      </p>
                  </div>

                  {/* Introduction */}
                  <section className="mb-16">
                      <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
                          We're a team passionate about revolutionizing the way businesses connect and grow. Our mission is to build a comprehensive B2B marketplace where Indian manufacturers, traders, and entrepreneurs can thrive — faster, smarter, and more efficiently.
                      </p>
                  </section>

                  {/* Our Vision */}
                  <section className="mb-16">
                      <h2 className="text-2xl sm:text-3xl font-bold text-indigo-500 mb-4 text-center">Our Vision</h2>
                      <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto text-center">
                          We envision a future where every business — regardless of size or location — has equal access to growth. We bridge the gap between suppliers and buyers, streamline trade, and drive India's economic progress.
                      </p>
                  </section>

                  {/* Our Story */}
                  <section className="mb-16">
                      <h2 className="text-2xl sm:text-3xl font-bold text-indigo-500 mb-4 text-center">Our Story</h2>
                      <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto text-center">
                          Tie Up India was born from a simple idea — to simplify and accelerate B2B trade. Founders <strong>Muskan Kumar</strong> & <strong>Shivam Kumar Shrivastava</strong> saw the struggles of Indian businesses in finding reliable suppliers, handling logistics, and expanding into new markets. Our platform is their vision brought to life.
                      </p>
                  </section>

                  {/* Our Partners */}
                  <section className="mb-16">
                      <h2 className="text-2xl sm:text-3xl font-bold text-indigo-500 mb-8 text-center">Our Partners</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                          {/* Muskan Kumar */}
                          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                              <div className="bg-gradient-to-r from-orange-500 via-white to-green-500 h-2"></div>
                              <div className="p-8 text-center">
                                  <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-indigo-100 shadow-lg">
                                      <img 
                                          src="https://res.cloudinary.com/dh1wupvv5/image/upload/v1756536675/WhatsApp_Image_2025-08-26_at_12.08.53_7a28dabf_jtutkf.jpg" 
                                          alt="Muskan Kumar" 
                                          className="w-full h-full object-cover"
                                      />
                                  </div>
                                  <h3 className="text-2xl font-bold text-indigo-600 mb-2">Muskan Kumar</h3>
                                  <p className="text-lg font-semibold text-orange-600 mb-3">Partner</p>
                                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                      </svg>
                                      <span className="text-sm">muskan@tieupindia.com</span>
                                  </div>
                              </div>
                          </div>

                          {/* Shivam Shrivastava */}
                          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                              <div className="bg-gradient-to-r from-orange-500 via-white to-green-500 h-2"></div>
                              <div className="p-8 text-center">
                                  <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-indigo-100 shadow-lg">
                                      <img 
                                          src="/shivam.jpg" 
                                          alt="Shivam Shrivastava" 
                                          className="w-full h-full object-cover"
                                      />
                                  </div>
                                  <h3 className="text-2xl font-bold text-indigo-600 mb-2">Shivam Shrivastava</h3>
                                  <p className="text-lg font-semibold text-orange-600 mb-3">Partner</p>
                                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                      </svg>
                                      <span className="text-sm">shivam@tieupindia.com</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </section>

                  {/* Our Values */}
                  <section className="mb-16">
                      <h2 className="text-2xl sm:text-3xl font-bold text-indigo-500 mb-6 text-center">Our Values</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                          <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition">
                              <h3 className="text-xl font-semibold text-indigo-600 mb-2">Trust</h3>
                              <p className="text-gray-600">We build trust through transparency, accountability, and consistency.</p>
                          </div>
                          <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition">
                              <h3 className="text-xl font-semibold text-indigo-600 mb-2">Innovation</h3>
                              <p className="text-gray-600">We continuously improve our platform to stay ahead of evolving business needs.</p>
                          </div>
                          <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition">
                              <h3 className="text-xl font-semibold text-indigo-600 mb-2">Customer-Centricity</h3>
                              <p className="text-gray-600">We prioritize user experience, delivering exceptional support and service.</p>
                          </div>
                      </div>
                  </section>

                  {/* CTA */}
                  <section className="text-center">
                      <h2 className="text-2xl sm:text-3xl font-bold text-indigo-500 mb-4">Join Our Community</h2>
                      <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-xl mx-auto">
                          Be a part of India's fastest-growing B2B marketplace. Sign up today and unlock new opportunities for growth, networking, and success.
                      </p>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-base font-medium transition">
                          Register Now
                      </button>
                  </section>
              </div>
          </div>
          <Footer/>
          </>
  );
};

export default AboutUs;
