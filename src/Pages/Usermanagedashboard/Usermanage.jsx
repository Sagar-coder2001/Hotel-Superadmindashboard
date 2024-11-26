import React, { useEffect, useState } from 'react';
import Layout from '../../Components/Layout/Layout';
import Admindashboard from '../Dashboard/Admindashboard';
import '../Usermanagedashboard/Usermanage.css';
import { useLocation } from 'react-router-dom';

const Usermanage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading
  const location = useLocation();
  const { tokenid, username } = location.state || {};
  const [token, setToken] = useState(tokenid || '');
  const [user, setUsername] = useState(username || '');

  useEffect(() => {
    if (user && token) {
      const formData = new FormData();
      formData.append('username', user);
      formData.append('token', token);

      fetch('http://192.168.1.25/Queue/Super_Admin/hotel.php?for=getHotelDetails', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setHotels(data.Hotel);
          console.log(data.Hotel);
        })
        .catch((error) => {
          console.error('Error fetching hotels:', error);
        })
        .finally(() => {
          setLoading(false); 
        });
    }
  }, [user, token]); 

  return (
    <div>
      <Layout>
        <Admindashboard />
        <div className="dashboard-container mt-5">
          <div className="hotelnamecontainer mt-4">
            <form action="">
              <label htmlFor="hotelSelect"><strong>Hotel Name - </strong></label>
              <select name="hotel" id="hotelSelect">
                <option value="">Select a hotel</option>
                {loading ? (
                  <option>Loading...</option> // Show "Loading..." while fetching
                ) : (
                  hotels.map((hotel, index) => (
                    <option key={index} value={hotel.id} style={{ marginLeft: '10px' }}>
                      {hotel.Hotel_Name}
                    </option>
                  ))
                )}
              </select>
            </form>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Usermanage;
