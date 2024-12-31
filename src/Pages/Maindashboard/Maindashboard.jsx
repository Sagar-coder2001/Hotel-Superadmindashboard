import React, { useEffect } from 'react'
import Admindashboard from '../Dashboard/Admindashboard'
import Layout from '../../Components/Layout/Layout'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const Maindashboard = () => {
  const location = useLocation();

  // const { tokenid, username } = location.state || {};
  // const [token, setToken] = useState(tokenid || '');
  // const [user, setUsername] = useState(username || '');

  const { isLoggedIn, token, username } = useSelector((state) => state.loggedin);


useEffect(() => {
  const submitDetails = async (e) => {
    e.preventDefault();
    try {
        const formdata = new FormData();
        formdata.append('username', username);
        formdata.append('token', token);
        
        const response = await fetch('http://192.168.1.25/Queue/Super_Admin/log.php?do=login', {
            method: 'POST',
            body: formdata,
        });
        const data = await response.json();
        console.log(data);
        if (data.Status === true) {
        }
    } catch (err) {
        console.log(err);
    }
};
submitDetails();
},[])

  return (
    <div>
        <Layout>
        <Admindashboard />
        <div className="dashboard-container mt-5">
            Main Dashboard
        </div>
        </Layout>
    </div>
  )
}

export default Maindashboard
