import React from 'react';
import './Home.css';
import logo from './trading.jpg'


function Home() {
    return (
        <div className="home-container">
            <div className="hero">
                <h1>Welcome to Trading Platform</h1>
                <p>Your Gateway to Successful Online Trading</p>
                <button className="cta-button">Get Started</button>
            </div>
            
            <div className="image-container">
                <img
                    src={logo}
                    alt="Trading Image"
                    className="home-image"
                />
            </div>
        </div>
    );
}

export default Home;
