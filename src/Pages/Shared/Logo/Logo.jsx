import React from 'react';
import { Link } from 'react-router';

const Logo = () => {
    return (
         <div className="flex-1">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4228/4228733.png"
            alt="Forum Logo"
            className="w-8 h-8"
          />
          <span className="text-xl font-bold text-primary">ForumVerse</span>
        </Link>
      </div>
    );
};

export default Logo;