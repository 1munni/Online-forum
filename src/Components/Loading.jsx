import React from 'react';

const Loading = () => {
    return (
           <div className='min-h-screen flex justify-center items-center'>
            <span className="loading loading-bars loading-xs"></span>
<span className="loading loading-bars loading-sm"></span>
<span className="loading loading-bars loading-md"></span>
<span className="loading loading-bars loading-lg"></span>
<span className="loading loading-bars loading-xl"></span>
            
        </div>
    );
};

export default Loading;