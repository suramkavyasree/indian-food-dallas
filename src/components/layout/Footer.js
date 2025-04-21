// /src/components/layout/Footer.js
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import Link from 'next/link';
import './Footer.css'; // Import external CSS for styling

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" className="text-gray-300 hover:text-white">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" className="text-gray-300 hover:text-white">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" className="text-gray-300 hover:text-white">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <p className="text-gray-300">1234 Food St, Dallas, TX 12345</p>
            <p className="text-gray-300">Phone: (123) 456-7890</p>
          </div>

          {/* Newsletter */}
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
