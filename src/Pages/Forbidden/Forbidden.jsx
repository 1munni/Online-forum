import React from 'react';
import { Link } from 'react-router';
import { ShieldAlert } from 'lucide-react';

const Forbidden = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-base-200 m-10">
      <ShieldAlert className="w-20 h-20 text-red-500 mb-4" />
      <h1 className="text-6xl font-extrabold text-red-500">403</h1>
      <h2 className="text-3xl font-semibold mt-2 text-base-content">Access Forbidden</h2>
      <p className="mt-4 text-gray-500 max-w-md">
        You do not have permission to access this page. Please contact the administrator if you believe this is a mistake.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block bg-primary text-white px-6 py-2 rounded-xl shadow hover:bg-primary-focus transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default Forbidden;
