import React, { useEffect, useState } from 'react';
import './Admindashboard.css';
import { Navigate, useLocation } from 'react-router-dom';
import Layout from '../../Components/Layout/Layout';
import { useNavigate } from 'react-router-dom';


const Admindashboard = () => {
  const location = useLocation();
  const { tokenid, username } = location.state || {};
  const [token, setToken] = useState(tokenid || '');
  const [user, setUsername] = useState(username || '');
  const [openmoadl, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const handlelogout = () => {
    localStorage.removeItem('isLoggedIn',);
    navigate('/');
  }

  const addEmpUser = () => {
    console.log("add");
    setOpenModal(true);
  }

  const opentable = () => {
    navigate('/Table_dashboard');
  }

  // useEffect(() => {
  //   if (token && user) {
  //     navigate('/Hotel_dashboard', {
  //       state: { tokenid: token, username: user }
  //     });
  //   }
  // }, [token, user, navigate]);
  
  const openhoteldashboard = () => {
    navigate('/Superadmin', {
      state: { tokenid: token, username: user }
    });
  }

  const openemployeedashboard = () => {
    navigate('/Usermanage', {
      state: { tokenid: token, username: user }
    });
  }
 
  return (
    <Layout>
      {/* <div className="admin-dashboard"> */}
        <div className='sidebar-container'>
          <div className="sidebar">
            <div className="middle">
              <a href="" style={{ textAlign: 'center' }}>Company</a>
              <ul>
                <li><a onClick={(e) => {openhoteldashboard(e) }}>USer Manage</a></li>
                <li><a onClick={(e) => {openemployeedashboard(e) }}>Hotel Manage</a></li>
                {/* <li><a onClick={(e) => {opentable(e)}}>Table Managment</a></li>
                <li><a >Home</a></li> */}
                <div style={{ marginTop: '150px' }}>
                  <li><a>Setting</a></li>
                  <li><a onClick={handlelogout} >Logout</a></li>
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
