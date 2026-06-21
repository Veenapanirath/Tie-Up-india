import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Hero } from "../Home/Hero";
import Footer from "../footer/Footer";
import { useToast } from "@/hooks/use-toast";
import { contactService } from "@/services/contactService";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    email: "",
    purpose: "",
    city: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send email via API
      await contactService.sendContactEmail(formData);

      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        contactNumber: "",
        email: "",
        purpose: "",
        city: "",
        description: ""
      });
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img src="/Tie-UP-India.png" alt="Logo" className="w-12 h-12" />
              <span className="text-2xl font-bold">
                <span className="text-orange-500">Tie</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">
                  Up
                </span>
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

      <Hero />

      <div className="bg-white text-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-600 mb-4">Contact Us</h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Get in touch with us. We'd love to hear from you and help you with your business needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-indigo-600 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="contactNumber" className="text-sm font-medium text-gray-700">
                    Contact Number *
                  </Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    required
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Your contact number"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email ID *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="purpose" className="text-sm font-medium text-gray-700">
                    Purpose *
                  </Label>
                  <select
                    id="purpose"
                    name="purpose"
                    required
                    value={formData.purpose}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select purpose</option>
                    <option value="general-inquiry">General Inquiry</option>
                    <option value="business-partnership">Business Partnership</option>
                    <option value="vendor-registration">Vendor Registration</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="job">Job</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                    City *
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Your city"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description (200 words max) *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Please describe your inquiry in detail..."
                    rows={6}
                    maxLength={2000}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/2000 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-indigo-600 mb-6">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Phone Numbers</h3>
                      <p className="text-gray-600 mt-1">
                        <a href="tel:+917992423595" className="hover:text-indigo-600">+91 7992423595</a>
                      </p>
                      <p className="text-gray-600">
                        <a href="tel:+91 72580 71299‬ " className="hover:text-indigo-600">+91 72580 71299‬ </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600 mt-1">
                        <a href="mailto:support@tieupindia.com" className="hover:text-indigo-600">support@tieupindia.com</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                      <p className="text-gray-600 mt-1">
                        Mandar Hill, Bounsi<br />
                        Banka, Bihar, India 813104
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-green-600 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Why Choose Tie Up India?</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Trusted B2B marketplace</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>24/7 customer support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Secure payment processing</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    <span>Verified suppliers and buyers</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactUs;
