import React from 'react';
import { FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa'; // Importing React Icons
import Logo from '../Logo/Logo';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-base-200 p-6 rounded-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
                    {/* Company Info & Copyright */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <Logo />
                        <p className="mt-4 text-sm max-w-sm">
                            ACME Industries Ltd.
                            <br />
                            Providing reliable tech since 1992
                        </p>
                        <p className="mt-2 text-xs">
                            Copyright © {currentYear} - All rights reserved
                        </p>
                    </div>

                    {/* Social Media Links */}
                    <div className="flex flex-col items-center md:items-end">
                        <span className="text-indigo-800 hover text-lg font-semibold mb-3">Follow Us</span>
                        <div className="flex gap-4">
                            <a href="#" className="text-indigo-800 hover:text-blue-500 transition-colors duration-300" aria-label="Facebook">
                                <FaFacebook className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-indigo-800 hover hover:text-cyan-400 transition-colors duration-300" aria-label="Twitter">
                                <FaTwitter className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-indigo-800 hover hover:text-red-600 transition-colors duration-300" aria-label="YouTube">
                                <FaYoutube className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;