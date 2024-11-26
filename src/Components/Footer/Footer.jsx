import React, { useEffect, useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Check the theme from localStorage when the component mounts
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkTheme(true);
    } else {
      setIsDarkTheme(false); // Default to light theme if not set
    }
  }, []);

  return (
    <div>
      <div className={`footer-container ${isDarkTheme ? 'dark' : 'light'}`}>
        <div className="footer">
        Copy & Copyright 2024
        </div>
      </div>
    </div>
  );
}

export default Footer;
