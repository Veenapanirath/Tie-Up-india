import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Hero } from "../Home/Hero";

const TermsAndConditions = () => {
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
                  Terms & Conditions
              </h1>

              {/* Business Owners Section */}
              <section className="mb-10">
                  <h2 className="text-2xl font-semibold text-indigo-500 mb-4">
                      Terms and Conditions for Listed Business Owners
                  </h2>

                  <div className="space-y-6 text-gray-700 text-base leading-relaxed">
                      <div>
                          <h3 className="font-semibold mb-2">1. Business Information and Accuracy</h3>
                          <p>1.1 You agree to provide accurate and complete information about your business, including but not limited to business name, address, contact details, and product/service offerings.</p>
                          <p>1.2 You agree to update your business information promptly in the event of any changes.</p>
                      </div>

                      <div>
                          <h3 className="font-semibold mb-2">2. Content Ownership and License</h3>
                          <p>2.1 You retain ownership of all content, including but not limited to text, images, and logos, that you upload to the Website.</p>
                          <p>2.2 By uploading content, you grant tieupindia.com a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, modify, and display such content.</p>
                      </div>

                      <div>
                          <h3 className="font-semibold mb-2">3. Prohibited Activities</h3>
                          <ul className="list-disc pl-6">
                              <li>Posting false or misleading information</li>
                              <li>Spamming or phishing</li>
                              <li>Infringing on intellectual property rights</li>
                              <li>Engaging in any unlawful or unethical activities</li>
                          </ul>
                      </div>

                      <div>
                          <h3 className="font-semibold mb-2">4. Termination</h3>
                          <p>Tie Up India reserves the right to terminate or suspend your business listing at any time, without notice, if you fail to comply with these Terms and Conditions.</p>
                      </div>

                      <div>
                          <h3 className="font-semibold mb-2">5. Listing and Subscription</h3>
                          <p>5.1 By listing your business, you agree to pay subscription charges as specified.</p>
                          <p>5.2 All subscription charges are non-refundable.</p>
                          <p>5.3 Your business listing will remain live during the subscription period.</p>
                      </div>
                  </div>
              </section>

              {/* Buyers Section */}
              <section className="mb-10">
                  <h2 className="text-2xl font-semibold text-indigo-500 mb-4">
                      Terms and Conditions for Buyers
                  </h2>

                  <div className="space-y-6 text-gray-700 text-base leading-relaxed">
                      <div>
                          <h3 className="font-semibold mb-2">1. Use of the Website</h3>
                          <p>1.1 You agree to comply with these Terms and Conditions.</p>
                          <p>1.2 Use the website lawfully and avoid infringing on others’ rights.</p>
                      </div>

                      <div>
                          <h3 className="font-semibold mb-2">2. Business Transactions</h3>
                          <p>2.1 All transactions are between buyers and sellers.</p>
                          <p>2.2 Tie Up India is not responsible for product quality, safety, or legality.</p>
                      </div>

                      <div>
                          <h3 className="font-semibold mb-2">3. Payment and Refunds</h3>
                          <p>3.1 Payments must be made via Tie Up India accepted methods.</p>
                          <p>3.2 All payments are final unless otherwise agreed upon by both parties.</p>
                      </div>

                      <div>
                          <h3 className="font-semibold mb-2">4. Intellectual Property</h3>
                          <p>4.1 All content on the website belongs to Tie Up India or its licensors.</p>
                          <p>4.2 You may not copy or distribute without written permission.</p>
                      </div>

                      <div>
                          <h3 className="font-semibold mb-2">5. Disclaimers and Limitations</h3>
                          <p>5.1 Tie Up India disclaims all warranties including merchantability or fitness for a particular purpose.</p>
                          <p>5.2 We are not liable for any damages from using the site.</p>
                      </div>
                  </div>
              </section>

              {/* Common Terms */}
              <section className="mb-10">
                  <h2 className="text-2xl font-semibold text-indigo-500 mb-4">
                      Common Terms and Conditions
                  </h2>

                  <div className="space-y-6 text-gray-700 text-base leading-relaxed">
                      <div>
                          <h3 className="font-semibold mb-2">1. Governing Law</h3>
                          <p>These Terms shall be governed by the laws of India.</p>
                      </div>

                      <div>
                          <h3 className="font-semibold mb-2">2. Dispute Resolution</h3>
                          <p>Disputes will be settled through arbitration per the Arbitration and Conciliation Act, 1996.</p>
                      </div>

                      <div>
                          <h3 className="font-semibold mb-2">3. Changes to Terms</h3>
                          <p>Tie Up India may update these Terms at any time. Continued use implies agreement.</p>
                      </div>
                  </div>
              </section>

              <p className="text-center text-sm text-gray-500 mt-10">
                  By using this Website, you confirm you have read and agree to these Terms and Conditions.
              </p>
          </div></>
  );
};

export default TermsAndConditions;
