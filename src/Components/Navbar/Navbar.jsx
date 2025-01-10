import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { useDispatch, useSelector } from 'react-redux';
import { dark, white } from '../../Features/Themeslice';
import zeallogo from '../../assets/Zeal_Logo_2.png'

const Navbar = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const bgcolor = useSelector((state) => state.theme.navbar);
    const textcolor = useSelector((state) => state.theme.textcolor);

    const dispatch = useDispatch()

    const toggleTheme = () => {
        if (bgcolor == '#04293A') {
            dispatch(white());
            localStorage.removeItem('theme');
            setChangeicon(false)
          }
          else {
            dispatch(dark())
            setChangeicon(true)
          }
    };

    return (
        <div>
            <header>
                <div className='navbar' style={{backgroundColor: bgcolor}}>
                    <div className="leftnavbar">
                        {/* <a href="" className='ml-4'>Zeal Intereactive Services</a> */}
                        <img src={zeallogo} style={{width:'30px', height:'30px', marginLeft:'40px'}} alt="" />

                    </div>
                            <>
                                <div className="rightnavbar" style={{color:textcolor}}>
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
