import React, { useEffect } from 'react'
import Admindashboard from '../Dashboard/Admindashboard'
import Layout from '../../Components/Layout/Layout'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';


const Maindashboard = () => {
  const location = useLocation();

  const { isLoggedIn, token, username } = useSelector((state) => state.loggedin);

  const data = [
    { x: 1, y: 2 },
    { x: 2, y: 5.5 },
    { x: 3, y: 2 },
    { x: 5, y: 8.5 },
    { x: 8, y: 1.5 },
    { x: 10, y: 5 },
  ];

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
  }, [])

  return (
    <div>
      <Layout>
        <Admindashboard />
        <div className="dashboard-container mt-5">
          <div className="upper">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="col4">Orders<br /> $200</motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="col4">Total Played Game<br /> $200</motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="col4">Orders<br /> $200</motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="col4">Orders<br /> $200</motion.div>
          </div>
          <div className="dated mt-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="col4">
              <input type="date" />
            </motion.div>

          </div>

          <div className="dashboard mt-5">
            <div className='border border-primary mb-5'>

              <LineChart width={500} height={300} data={data}>
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.5} 
                />
              </LineChart>
            </div>

          </div>
        </div>
      </Layout>
    </div>
  )
}

export default Maindashboard
