import React from 'react';
import { Link } from 'react-router';
import { FaArrowLeft } from 'react-icons/fa';

const ErrorPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-lime-100 to-emerald-100 flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl md:text-7xl font-extrabold text-green-800 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
        Oops! Page not found
      </h2>
      <p className="text-md md:text-lg text-gray-600 max-w-md mb-6">
        The page you're looking for might have been removed or is temporarily unavailable.
        Let's get you back to where things grow 🌱
      </p>
      <Link
        to="/"
        className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all"
      >
        <FaArrowLeft className="mr-2" />
        Go Home
      </Link>
    </div>
    );
};

export default ErrorPage;