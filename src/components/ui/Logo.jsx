import React from 'react';
import SiteLogo from '../../assets/logo.png'
import { Link } from 'react-router-dom';

const Logo = () => {
    return (
        <div>
            <Link to={"/"}><img width={150} height={100} src={SiteLogo} alt="" /></Link>
        </div>
    );
};

export default Logo;