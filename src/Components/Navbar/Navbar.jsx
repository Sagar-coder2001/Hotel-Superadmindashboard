import React, { useState, useEffect } from 'react';
import './Navbar.css';
// import { useSelector } from 'react-redux';

const Navbar = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    // const loggedin = useSelector((state) => state.loggedin.isLoggedIn);
    // console.log(loggedin);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setIsDarkTheme(storedTheme === 'dark');
        } else {
            setIsDarkTheme(false); 
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDarkTheme ? 'dark' : 'light';
        setIsDarkTheme(!isDarkTheme);

        localStorage.setItem('theme', newTheme);

        document.body.setAttribute('data-theme', newTheme);
    };

    useEffect(() => {
        const theme = isDarkTheme ? 'dark' : '#aed3d0';
        document.body.setAttribute('data-theme', theme); 
    }, [isDarkTheme]);

    return (
        <div>
            <header>
                <div className={`navbar ${isDarkTheme ? 'dark' : '#aed3d0'}`}>
                    <div className="leftnavbar">
                        <a href="" className='ml-4'>Hotel Super-Admin</a>
                    </div>
                            <>
                                <div className="rightnavbar">
                                    <i className="fa-solid fa-bell"></i>
                                    <i className="fa-solid fa-moon" onClick={toggleTheme} style={{ cursor: 'pointer' }}></i>
                                    <i className="fa-solid fa-user"></i>
                                </div>
                            </>
                </div>
            </header>
        </div>
    );
};

export default Navbar;
