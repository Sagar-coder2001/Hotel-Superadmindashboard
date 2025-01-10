import React from 'react'
import Layout from '../../Components/Layout/Layout'
import Admindashboard from '../Dashboard/Admindashboard'
import '../Dashboard/Admindashboard.css';
import { useNavigate } from 'react-router-dom';

const Pagenotfound = () => {
    const navigate = useNavigate();

  return (
    <div>
        <Layout>
            <Admindashboard/>
           <div className="dashboard-container">
            <div className="upper-dashboard mt-5" style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)'}}>
                <h1 className='text-danger'>404</h1>
               <h2>Page Not Found</h2>
               <div className="btn-container">
                <button className='btn btn-info' onClick={() => navigate('/Maindashboard') }>Go Home</button>
               </div>
            </div>
           </div>
        </Layout>
    </div>
  )
}

export default Pagenotfound
