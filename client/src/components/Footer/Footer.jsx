import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white-800 text-red-500 ml-2 px-8 py-16 mb-20">
      <div className="container mx-auto px-6 text-center">
        <h4 className="text-lg font-semibold mb-4">Connect with Us</h4>
        <div className="flex justify-center space-x-6 mb-4">
          <FaFacebook className="text-2xl hover:text-white cursor-pointer" />
          <FaInstagram className="text-2xl hover:text-white cursor-pointer" />
          <FaTwitter className="text-2xl hover:text-white cursor-pointer" />
        </div>
        <div className="flex justify-center space-x-8 text-sm mb-4 gap-4">
          <a href="#" className="hover:underline hover:text-white">About</a>
          <a href="#" className="hover:underline hover:text-white">Jobs</a>
          <a href="#" className="hover:underline hover:text-white">Support</a>
          <a href="#" className="hover:underline hover:text-white">Privacy Policy</a>
        </div>
        <p className="text-xs text-red-300 ">
          &copy; {new Date().getFullYear()} RhythmNest. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
