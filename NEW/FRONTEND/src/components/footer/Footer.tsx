import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-green-600 to-white text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo + Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {/* Logo */}
              <img src="/Tie-UP-India.png" alt="Logo" className="w-12 h-12" />
              <span className="text-2xl font-bold">
                <span className="text-orange-500">Tie</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">
                  Up
                </span>
                <span className="text-green-600">India</span>
              </span>
            </div>
            <p className="text-gray-700">
              India's Premier B2B Marketplace connecting businesses across the nation.
            </p>
            <p className="text-sm text-gray-600 mt-3">
              <strong>Address:</strong><br />
              Mandar Hill,<br />
              Banka, Bihar, India 813104
            </p>
          </div>

          {/* Quick Links */}
          <div>
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
              <Link to="/termsandcondition" className="block text-gray-700 hover:text-green-700 transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="block text-gray-700 hover:text-green-700 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Connect</h4>
            <div className="space-y-2">
              <a 
                href="https://www.facebook.com/profile.php?id=61574843125940"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-700 hover:text-green-700 transition-colors"
              >
                Facebook
              </a>
              <a 
                href="https://www.instagram.com/tie_up_india/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-700 hover:text-green-700 transition-colors"
              >
                Instagram
              </a>
              <a 
                href="https://wa.me/+917992423595"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-700 hover:text-green-700 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>

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
          </div> */}

            {/* Contact Information */}
            <div >
              <div >
    
                <div className="space-y-2">
                  <div className="flex items-start space-x-1">
                   
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Phone Numbers</h3>
                      <p className="text-gray-600 mt-1">
                        <a href="tel:+917992423595" className="hover:text-indigo-600">+91 7992423595</a>
                      </p>
                      <p className="text-gray-600">
                        <a href="tel:+91 72580 71299‬ " className="hover:text-indigo-600">+91 72580 71299‬ </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600 mt-1">
                        <a href="mailto:support@tieupindia.com" className="hover:text-indigo-600">support@tieupindia.com</a>
                      </p>
                    </div>
                  </div>

                 
                </div>
              </div>

             
            </div>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Tie-Up-India. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
