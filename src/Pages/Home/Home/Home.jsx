import React from 'react';
import AllPosts from '../AllPost/AllPost';
import Announcement from '../Anouncement/Anouncemnt';

const Home = () => {
    return (
        <div>
        <Announcement></Announcement>
       <AllPosts></AllPosts>
        </div>
    );
};

export default Home;