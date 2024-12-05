import React, { useEffect, useState } from 'react';
import Layout from '../../Components/Layout/Layout';
import Admindashboard from '../Dashboard/Admindashboard';
import '../Usermanagedashboard/Usermanage.css';
import { useLocation } from 'react-router-dom';

const Usermanage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false); // State to manage modal visibility
  const [selectedHotel, setSelectedHotel] = useState(null); // Store selected hotel data

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(5); // Number of hotels per page

  const location = useLocation();
  const { tokenid, username } = location.state || {};
  const [token, setToken] = useState(tokenid || '');
  const [user, setUsername] = useState(username || '');
  const [openmodel , setOpenModal] = useState(false);
  const [hotelname , setHotelname] = useState('')
  const [hotelcontact , setHotelContact] = useState('');
  const [showerr, setshowerr] = useState(false);


  // Fetch hotels from the API
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
        })
        .catch((error) => {
          console.error('Error fetching hotels:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, token]);

  // Handle row click to open the modal and set the selected hotel data
  const openHotelpopup = (hotel) => {
    setSelectedHotel(hotel);
    setModalOpen(true); // Open the modal
  };

  // Close the modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedHotel(null); // Clear selected hotel data
  };

  // Pagination Logic
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(hotels.length / hotelsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const addEmpUser = () => {
    setOpenModal(true);
  };




  const handleSubmit = async (e) => {
    if (hotelname === "" && hotelcontact === "") {
      setshowerr(true);
      return false;
    } else {
      // setshowerr(false);
      e.preventDefault();
      // setUseraddloading(true);
      const formData = new FormData();
      formData.append('username', user);
      formData.append('token', token);
      formData.append('hotel_name', hotelname);
      formData.append('hotel_contact', hotelcontact);

      try {
        const response = await fetch('http://192.168.1.25/Queue/Super_Admin/hotel.php?for=addHotelDetails', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to submit the data');

        const data = await response.json();

        // if (data.Status === true) {
        //   setUseraddloading(false);
        // }

        if (data.Status === false);
        console.log(data);
        setOpenModal(false);
        setHotelname('');
        setHotelContact('');
      } catch (error) {
        console.error('Error submitting data:', error);
        alert('Error: ' + error.message);
      }
    }
  };

  return (
    <div>
      <Layout>
        <Admindashboard />
        <div className="dashboard-container mt-5">
          <div className="hotelnamecontainer mt-4">
            <h3>Hotel Details</h3>
            <div className="addbtn">
            <button className="mt-4 "onClick={addEmpUser}>Add User</button>
            </div>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr style={{ backgroundColor: 'black', color: 'white' }}>
                    <th style={{ padding: '10px' }}>Hotel Name</th>
                    <th>Hotel ID</th>
                    <th>Hotel Contact</th>
                    <th>Account Details Status</th>
                    {/* <th>Account Number</th> */}
                    <th>IFSC Code</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center' }}>
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    currentHotels.map((hotel, index) => (
                      <tr key={index} onClick={() => openHotelpopup(hotel)} style={{cursor:'pointer'}}>
                        <td>{hotel.Hotel_Name}</td>
                        <td>{hotel.Hotel_ID}</td>
                        <td>{hotel.Hotel_Contact}</td>
                        <td>{hotel.Hotel_Account_Details_Status ? 'Active' : 'Inactive'}</td>
                        {/* <td>
                          {hotel.Hotel_Account_Details_Status ? hotel.Hotel_Account_Details.Account_Number : '-'}
                        </td> */}
                        <td>
                          {hotel.Hotel_Account_Details_Status ? hotel.Hotel_Account_Details.IFSC_Code : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <nav>
                <ul className="pagination">
                  {pageNumbers.map((number) => (
                    <li key={number} className="page-item">
                      <button onClick={() => paginate(number)} className="page-link">
                        {number}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>


        {/* add hotels */}

        {openmodel && (
            <div className="user-details-card text-center">
              <form>
                <h3>Add Hotel</h3>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setOpenModal(false)}
                  style={{ border: 'none', background: 'none', fontSize: '1.2rem', color: 'red', cursor: 'pointer', outline: 'none' }}
                >
                  &#10006;
                </button>

                <div className="row mt-4">
                  <label htmlFor="username" className="col-4 col-form-label text-start">Hotel Name</label>
                  <div className="col-8">
                    <input
                      type="text"
                      className="form-control"
                      value={hotelname}
                      onChange={(e) => setHotelname(e.target.value)}
                      required
                    />
                  </div>
                  {showerr &&
                    <div>
                      <span style={{ color: 'red', marginLeft: '10px', fontSize: '15px' }}>hotelname is required</span>
                    </div>
                  }
                </div>

                <div className="row mt-4">
                  <label htmlFor="contact" className="col-5 col-form-label text-start">Hotel Contact</label>
                  <div className="col-7">
                    <input
                      type="text"
                      className="form-control"
                      maxLength={10}
                      value={hotelcontact}
                      onChange={(e) => setHotelContact(e.target.value)}
                      required
                    />
                  </div>
                  {showerr ?
                    <div>
                      <span style={{ color: 'red', marginLeft: '80px', fontSize: '15px' }}>Hotel Contact is required</span>
                    </div>
                    : ""
                  }

                </div>
              
                <div className="input-group row mt-3">
                  <span
                    className="queuefetchbtn col-4 m-auto"
                    style={{ margin: '0px 5px', borderRadius: '4px', cursor: 'pointer' }}
                    onClick={handleSubmit}
                  >
                    Submit
                  </span>
                </div>
              </form>
            </div>
          )}

        {/* Modal Popup */}
        {modalOpen && selectedHotel && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Hotel Details</h4>
              <span className="close-btn" onClick={closeModal}>
                &#10006;
              </span>
              <form>
                <div className="form-group">
                  <label><strong>Hotel Name:</strong></label>
                  <input type="text" value={selectedHotel.Hotel_Name} readOnly style={{border:'none', outline:'none', borderBottom:'1px solid'}}/>
                </div>
                <div className="form-group">
                  <label><strong>Hotel ID:</strong></label>
                  <input type="text" value={selectedHotel.Hotel_ID} readOnly  style={{border:'none', outline:'none', borderBottom:'1px solid'}}/>
                </div>
                <div className="form-group">
                  <label><strong>Hotel Contact:</strong></label>
                  <input type="text" value={selectedHotel.Hotel_Contact} readOnly style={{border:'none', outline:'none', borderBottom:'1px solid'}} />
                </div>
                <div className="form-group">
                  <label><strong>Account Details Status:</strong></label>
                  <input type="text" value={selectedHotel.Hotel_Account_Details_Status ? 'Active' : 'Inactive'} readOnly style={{border:'none', outline:'none', borderBottom:'1px solid'}} />
                </div>
                <div className="form-group">
                  <label><strong>Account Number:</strong></label>
                  <input type="text" value={selectedHotel.Hotel_Account_Details_Status ? selectedHotel.Hotel_Account_Details.Account_Number : '-'} readOnly style={{border:'none', outline:'none', borderBottom:'1px solid'}} />
                </div>
                <div className="form-group">
                  <label><strong>IFSC Code:</strong></label>
                  <input type="text" value={selectedHotel.Hotel_Account_Details_Status ? selectedHotel.Hotel_Account_Details.IFSC_Code : '-'} readOnly  style={{border:'none', outline:'none', borderBottom:'1px solid'}}/>
                </div>
              </form>
            </div>
          </div>
        )}
      </Layout>
    </div>
  );
};

export default Usermanage;
