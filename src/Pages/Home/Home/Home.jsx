import React from 'react';
import AllPosts from '../AllPost/AllPost';
import Announcement from '../Anouncement/Anouncemnt';
import BrowseTags from '../BrowseTags/BrowseTags';
import BannerWithSearch from '../Banner/BannerWithSearch';

const Home = () => {
    return (
        <div>
            <BannerWithSearch></BannerWithSearch>
        <BrowseTags></BrowseTags>
          <Announcement></Announcement>
       <AllPosts></AllPosts>
        </div>
    );
};

export default Home;