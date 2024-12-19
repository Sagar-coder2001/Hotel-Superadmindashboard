import React, { useEffect, useState } from 'react';
import './Footer.css';
import { useSelector } from 'react-redux';

const Footer = () => {
  const bgcolor = useSelector((state) => state.theme.navbar)

  return (
    <div>
      <div className='footer-container' style={{backgroundColor : bgcolor}}>
        <div className="footer">
        Copy & Copyright 2024
        </div>
      </div>
    </div>
  );
}

export default Footer;
