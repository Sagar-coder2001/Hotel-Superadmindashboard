import React, { useEffect, useState } from 'react';
import './Admindashboard.css';
import { Navigate, useLocation } from 'react-router-dom';
import Layout from '../../Components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const Admindashboard = () => {
  const location = useLocation();
  const { tokenid, username } = location.state || {};
  const [openmoadl, setOpenModal] = useState(false);
  const [clickbar, setclickbar] = useState(false);
  const [opendelpop , setOpenDelPop] = useState(false);


  const bgcolor = useSelector((state) => state.theme.navbar)
  const textcolor = useSelector((state) => state.theme.textcolor);
  const modalbg = useSelector((state) => state.theme.modal);
  const hover = useSelector((state) => state.theme.hover);


  const navigate = useNavigate();

  const handlelogout = () => {
    setOpenDelPop(true);
  }

  const userlogout = () => {
    localStorage.removeItem('isLoggedIn',);
    navigate('/');
  }

  const handleConfirmDelete = () => {
    userlogout();
    setOpenDelPop(false);
    // setconfirmdel(null);
  };

  const handleCancelDelete = () => {
    setOpenDelPop(false);

    // setconfirmdel(null);
  };

  const addEmpUser = () => {
    console.log("add");
    setOpenModal(true);
  }

  const opentable = () => {
    navigate('/Maindashboard');
  }

  const openhoteldashboard = () => {
    navigate('/Superadmin');
  }

  const openemployeedashboard = () => {
    navigate('/Usermanage');
  }
  return (
    <Layout>
      {/* <div className="admin-dashboard"> */}
      <i className={clickbar ? "fa-solid fa-times" : "fa-solid fa-bars"} onClick={() => setclickbar(prevState => !prevState)} style={{ position: 'fixed', top: '25px', zIndex: 2000, left: '20px', cursor: 'pointer' }}></i>

      {opendelpop && (
            <div className="delpopup">
              <div className="popup-content">
                <p> <strong>Are you sure you want to Logout this user?</strong></p>
                <button onClick={handleConfirmDelete} className='okbtn'>OK</button>
                <button onClick={handleCancelDelete}>Cancel</button>
              </div>
            </div>
          )}

      <div className={`sidebar-container ${clickbar ? 'active-class' : 'inactive-class'}`} style={{ backgroundColor: modalbg}}>
        <div className="sidebar">
          <div className="middle">
            <a href="" style={{ textAlign: 'center', color: textcolor, textDecoration:'none', fontSize: '18px' }}>Zeal Interactive Services</a>
            <hr></hr>
            <ul style={{color: textcolor}}>
              <li><a onClick={(e) => { opentable(e) }} style={{backgroundColor : hover}}>Main Dashboard</a></li>
         
              <li><a onClick={(e) => { openhoteldashboard(e) }} style={{backgroundColor : hover}}>User Manage</a></li>
              <li><a onClick={(e) => { openemployeedashboard(e) }} style={{backgroundColor : hover}}>Hotel Manage</a></li>
              <div style={{ marginTop: '150px' }}>
                <li><a style={{backgroundColor : hover}}>Setting</a></li>
                <li><a onClick={handlelogout} style={{backgroundColor : hover}}>Logout</a></li>
              </div>
            </ul>
          </div>
        </div>
      </div>
      {/* </div> */}
    </Layout>
  );
};

export default Admindashboard;
