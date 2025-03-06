import React, { useEffect, useState } from 'react';
import Layout from '../../Components/Layout/Layout';
import Admindashboard from '../Dashboard/Admindashboard';
import '../Usermanagedashboard/Usermanage.css';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { motion } from 'framer-motion';

const Usermanage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [openmodel, setOpenModal] = useState(false);
  // const [hotelname, setHotelname] = useState('')
  // const [hotelcontact, setHotelContact] = useState('');
  const [showerr, setshowerr] = useState(false);
  const [delpopbox, setdelpopbox] = useState(false);
  const [confirmdel, setconfirmdel] = useState(false);
  const [openadd, setopenadd] = useState(false)
  // const [accountnumber, setaccountnumber] = useState(null)
  // const [ifsccode, setifsccodenumber] = useState(null);
  // const [pincode, setPinCode] = useState('')
  // const [City, setCity] = useState('')
  // const [Address, setAddress] = useState('')

  const [hotelsetails, setHotelDetails] = useState({
    hotelname: '',
    hotelcontact: '',
    accountnumber: '',
    ifsccode: '',
    pincode: '',
    City: '',
    Address: ''
  })

  const [resetdetails, setHotelResetdetails] = useState({
    hotelname: '',
    hotelcontact: '',
    accountnumber: '',
    ifsccode: '',
    pincode: '',
    City: '',
    Address: ''
  })

  const [useraddloading, setUseraddloading] = useState(false)

  const bgcolor = useSelector((state) => state.theme.navbar)
  const textcolor = useSelector((state) => state.theme.textcolor);
  const modalbg = useSelector((state) => state.theme.modal)


  const { isLoggedIn, token, username } = useSelector((state) => state.loggedin);

  useEffect(() => {
    if (username && token) {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('token', token);
      fetch('http://192.168.1.25/Queue/Super_Admin/hotel.php?for=getHotelDetails', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setHotels(data.Hotel);
          console.log(data);
        })

        .catch((error) => {
          console.error('Error fetching hotels:', error);
        })
        .finally(() => {
        });
    }
  }, [username, token]);

  // Handle row click to open the modal and set the selected hotel data
  const openHotelpopup = (hotel) => {
    // e.stoppropogation();
    setSelectedHotel(hotel);
    setModalOpen(true); // Open the modal
    setOpenModal(false);
  };

  // Close the modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedHotel(null); // Clear selected hotel data
  };

  const addEmpUser = () => {
    setOpenModal(true);
    setModalOpen(false);
  };

  const hotelchange = (e) => {
    const { name, value } = e.target;
    setHotelDetails({ ...hotelsetails, [name]: value });

    // if (value.trim() !== '') {
    //   setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    // }
  }

  const hotelresetchange = (e) => {
    const { name, value } = e.target;
    setHotelResetdetails({ ...resetdetails, [name]: value });

    // if (value.trim() !== '') {
    //   setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    // }
  }


  // add hotel details
  const handleSubmit = async (e) => {
    if (!hotelsetails.hotelname || !hotelsetails.hotelcontact) {
      setshowerr(true);
      return false;
    } else {
      // setshowerr(false);
      setUseraddloading(true)
      e.preventDefault();
      // setUseraddloading(true);
      const formData = new FormData();
      formData.append('username', username);
      formData.append('token', token);
      formData.append('hotel_name', hotelsetails.hotelname);
      formData.append('hotel_contact', hotelsetails.hotelcontact);
      // formData.append('hotel_id', selectedHotel.Hotel_ID);
      formData.append('hotel_account_number', hotelsetails.accountnumber);
      formData.append('hotel_ifsc_code', hotelsetails.ifsccode);
      formData.append('hotel_pincode', hotelsetails.pincode);
      formData.append('hotel_state', hotelsetails.City);
      formData.append('hotel_address', hotelsetails.Address);
      // formData.append('lat', 232);
      // formData.append('long', 23443.4343);

      try {
        const response = await fetch('http://192.168.1.25/Queue/Super_Admin/hotel.php?for=addHotelDetails', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error('Failed to submit the data');
        const data = await response.json();
        if (data.Status === true) {
          setopenadd(true);
          window.location.reload();
        }
        if (data.Status === false);
        console.log(data);
        setOpenModal(false);
        // setHotelname('');
        // setHotelContact('');
      } catch (error) {
        console.error('Error submitting data:', error);
        alert('Error: ' + error.message);
      }
      finally {
        setUseraddloading(false)
      }
    }
  };

  setTimeout(() => {
    setshowerr(false);
  }, 5000);

  setTimeout(() => {
    setopenadd(false);
  }, 6000);

  const userlogoutpopbox = (hotel_id) => {
    console.log(hotel_id)
    setdelpopbox(true);
    setconfirmdel(hotel_id);
  };

  const handleConfirmDelete = () => {
    userlogout(confirmdel);
    setdelpopbox(false);
    setconfirmdel(null);
  };

  const handleCancelDelete = () => {
    setdelpopbox(false);
    setconfirmdel(null);
  };

  const userlogout = async (confirmdel) => {
    setUseraddloading(true)
    const formData = new FormData();
    formData.append('username', username);
    formData.append('token', token);
    formData.append('hotel_id', confirmdel);

    try {
      const response = await fetch('http://192.168.1.25/Queue/Super_Admin/hotel.php?for=deleteHotelDetails', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to delete the user');

      const data = await response.json();
      if (data.Status === true) {
        window.location.reload();
      }
      console.log('User removed successfully:', data);
      setHotels(prevHotels => prevHotels.filter(hotel => hotel.Hotel_ID !== confirmdel));

    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error: ' + error.message);
    }
    finally {
      setUseraddloading(false)
    }
  };

  // edit the hotel Details of the 
  const resethoteldetails = async (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setUseraddloading(true);

    const formData = new FormData();
    formData.append('username', username);
    formData.append('token', token);
    formData.append('hotel_name', hotelresetchange.hotelname);
      formData.append('hotel_contact', hotelresetchange.hotelcontact);
      formData.append('hotel_account', hotelresetchange.accountnumber);
      formData.append('hotel_ifsc', hotelresetchange.ifsccode);
      formData.append('hotel_pincode', hotelresetchange.pincode);
      formData.append('hotel_city', hotelresetchange.City);
      formData.append('hotel_address', hotelresetchange.Address);
      formData.append('lat', 232);
      formData.append('long', 23443.4343);

    try {
      const response = await fetch('http://192.168.1.25/Queue/Super_Admin/hotel.php?for=addHotelAccountDetails', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.Status === true) {
        console.log('Hotel account details added successfully:', data);
        // Optionally, clear input fields or update UI after successful submission
        setModalOpen(false)
      } else {
        console.error('Error adding hotel details:', data);
        alert('Failed to add hotel account details. Please try again.');
      }

    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error: ' + error.message);
    }
    finally {
      setUseraddloading(false)
    }
  };


  const RemoveDetails = async (e) => {
    setUseraddloading(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('token', token);
    formData.append('hotel_id', selectedHotel.Hotel_ID);

    try {
      const response = await fetch('http://192.168.1.25/Queue/Super_Admin/hotel.php?for=deleteHotelAccountDetails', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.Status === true) {
        console.log('Hotel account details deleted successfully:', data);
        // Optionally, clear input fields or update UI after successful submission
        setModalOpen(false);
      } else {
        console.error('Error adding hotel details:', data);
        alert('Failed to add hotel account details. Please try again.');
      }

    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error: ' + error.message);
    }
    finally {
      setUseraddloading(false)
    }
  };

  const columns = [
    {
      name: <div className='heading'>Sr. No</div>,
      selector: (row, index) => <><div className='srno'>{index + 1}</div></>,
      sortable: true,
      width: '100px'
    },
    {
      name: <div className='heading'>Hotel Name</div>,
      selector: row => <><div className='srno'>{row.Hotel_Name}</div></>,
      sortable: true,
    },
    {
      name: <div className='heading'>Hotel Id</div>,
      selector: row => <><div className='srno'>{row.Hotel_ID}</div></>,
      sortable: true,
    },
    {
      name: <div className='heading'>Hotel Contact</div>,
      selector: row => <><div className='srno'>{row.Hotel_Contact}</div></>,
      sortable: true,
    },
    // {
    //   name: <div className='heading'>Account Details Status</div>,
    //   selector: row => <><div className='srno'>{row.Hotel_Account_Details_Status ? 'Active' : 'Inactive'}</div></>,
    //   sortable: true,
    // },
    {
      name: <div className='heading'>Action</div>,
      cell: (row) => (
        <div style={{ display: 'flex', justifyContent: 'space-around', cursor: 'pointer' }}>
          {/* Delete Icon */}
          <span
            className="data-bs-toggle srno"
            data-bs-target="#exampleModal"
            onClick={() => userlogoutpopbox(row.Hotel_ID)} // Function for delete
            style={{ marginRight: '20px' }}
          >
            <button className='btn btn-danger'>Delete</button>
          </span>

          {/* Edit Icon */}
          <span
            className="data-bs-toggle srno"
            data-bs-target="#exampleModal"
            onClick={() => openHotelpopup(row)} // Function for edit
          >
            <button className='btn btn-warning'>Edit</button>
          </span>
        </div>
      ),
    },
  ];

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal'
  ];

  return (
    <div>
      <Layout>
        <Admindashboard />
        <div className="dashboard-container mt-19">
          <div className="hotelnamecontainer mt-4">
            <h3>Hotel Details</h3>

            {delpopbox && (
              <div className="delpopup">
                <div className="popup-content">
                  <p> <strong>Are you sure you want to delete this user?</strong></p>
                  <button onClick={handleConfirmDelete} className='okbtn'>OK</button>
                  <button onClick={handleCancelDelete}>Cancel</button>
                </div>
              </div>
            )}
            {
              openadd && (
                <>
                  <div class="alert alert-primary" role="alert">
                    Hotel addedd successfully
                  </div>
                </>
              )
            }

            {
              useraddloading && (
                <>
                  <div className="loader-overlay delpopup">
                    <div class="spinner-border text-primary" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                </>
              )
            }

            <div className="addbtn">
              <button className="mt-4 " onClick={addEmpUser}>Add Hotel</button>
            </div>

            {openmodel && (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mt-5 p-2" style={{ backgroundColor: modalbg, color: textcolor, borderRadius: '10px' }}>
                <form>
                  <h3>Add Hotel</h3>
                  <form>
                    <div className="row text-start" >
                      <div className="form-group col-lg-6 mt-3">
                        <label><strong>Hotel Name:</strong></label>
                        <input type="text" className="form-control mt-2" name='hotelname' onChange={hotelchange} value={hotelsetails.hotelname}
                        />
                        {showerr && <div className='text-danger'>Error Invalid Hotel name</div>}
                      </div>
                      <div className="form-group col-lg-5 mt-3">
                        <label><strong>Hotel Contact:</strong></label>
                        <input type="text" className="form-control mt-2" name='hotelcontact'
                          value={hotelsetails.hotelcontact}
                          onChange={hotelchange}
                        />
                        {showerr && <div className='text-danger'>Error Invalid Contact Number</div>}
                      </div>
                    </div>

                    {/* <div className="row text-start">
                      <div className="form-group col-lg-6 mt-3">
                        <label><strong>Hotel Contact:</strong></label>
                        <input type="text" className="form-control mt-2" name='hotelcontact'
                          value={hotelsetails.hotelcontact}
                          onChange={hotelchange}
                        />
                        {showerr && <div className='text-danger'>Error Invalid Contact Number</div>}
                      </div>
                      <div className="form-group col-lg-5 mt-3">
                        <label><strong>Account Details Status:</strong></label>
                        <input type="text"
                          className="form-control mt-2"
                          value={'Inactive'}

                        />
                      </div>
                    </div> */}

                    <div className="row text-start">
                      <div className="form-group col-md-11  mt-3">
                        <label><strong>Account Number:</strong></label>
                        <input
                          type="text"
                          className="form-control mt-2"
                          value={hotelsetails.accountnumber}
                          name='accountnumber'

                          onChange={hotelchange}
                        />
                        {showerr && <div className='text-danger'>Error Invalid Account Number</div>}
                      </div>
                    </div>
                    <div className="row text-start">
                      <div className="form-group col-lg-6  mt-3">
                        <label className='ml-5'><strong>IFSC Code:</strong></label>
                        <input
                          type="text"
                          className="form-control mt-2"
                          value={hotelsetails.ifsccode}
                          name='ifsccode'
                          onChange={hotelchange}
                        />
                        {showerr && <div className='text-danger'>Error Invalid IFSC Number</div>}
                      </div>

                      <div className="form-group col-lg-5  mt-3">
                        <label><strong>Pin Code:</strong></label>
                        <input
                          type="text"
                          className="form-control mt-2"
                          value={hotelsetails.pincode}
                          name='pincode'

                          onChange={hotelchange}
                        />
                        {showerr && <div className='text-danger'>Error Invalid Pin code</div>}
                      </div>
                    </div>
                    <div className="row text-start">
                      <div className="form-group col-lg-8">
                        <label><strong>State:</strong></label>
                        <select
                          className="form-control mt-2 select"
                          name='City'
                          value={hotelsetails.City}
                          onChange={hotelchange}
                        >
                          <option value= "" disabled >Select a State</option> {/* Placeholder option */}
                          {states.map((state, index) => (
                            <option key={index} value={state}>{state}</option>
                          ))}
                        </select>
                        {showerr && <div className="text-danger">Please select a valid state.</div>}
                      </div>
                    </div>

                    <div className="row text-start">
                      <div className="form-group col-md-12 mt-3">
                        <label><strong>Address:</strong></label>
                        <textarea
                          type="text"
                          className="form-control mt-2"
                          value={hotelsetails.Address}
                          name='Address'

                          onChange={hotelchange}
                        />
                        {showerr && <div className='text-danger'>Error Invalid Addreess </div>}
                      </div>
                    </div>

                    <div className="form-group text-center mt-4">
                      <button type="button" className="btn btn-primary" onClick={handleSubmit} style={{ marginRight: '10px' }}>
                        Add Details
                      </button>
                      <button type="button" className="btn btn-danger" onClick={() => setOpenModal(false)}>
                        Remove Details
                      </button>
                    </div>
                  </form>

                </form>
              </motion.div>
            )}

            {/* Edit the hotel details  */}
            {modalOpen && selectedHotel && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="modal-overlay" style={{ backgroundColor: modalbg, color: textcolor }}>
                <div className="modal-content">
                  <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Reset Details</h4>

                  <form>
                    <div className="row text-start" >
                      <div className="form-group col-lg-6">
                        <label><strong>Hotel Name:</strong></label>
                        <input type="text" className="form-control mt-2" name='hotelname' onChange={hotelresetchange} value={selectedHotel.Hotel_Name}
                        //  readOnly 
                        />
                        {
                          console.log(selectedHotel)
                        }
                      </div>
                      <div className="form-group col-lg-5">
                        <label><strong>Hotel Contact:</strong></label>
                        <input type="text" className="form-control mt-2" name='hotelcontact' onChange={hotelresetchange} value={selectedHotel.Hotel_Contact} readOnly />
                      </div>
                      {/* <div className="form-group col-lg-6">
                        <label><strong>Account Details Status:</strong></label>
                        <input type="text"
                          className="form-control mt-2"
                          value={'selectedHotel.Hotel_Account_Details_Status'}
                        // readOnly 
                        onChange={hotelchange}
                        />
                      </div> */}
                    </div>

                    {/* <div className="row text-start">
                      <div className="form-group col-lg-6">
                        <label><strong>Hotel Contact:</strong></label>
                        <input type="text" className="form-control mt-2" name='hotelcontact' onChange={hotelchange} value={selectedHotel.Hotel_Contact} readOnly />
                      </div>
                      <div className="form-group col-lg-6">
                        <label><strong>Account Details Status:</strong></label>
                        <input type="text"
                          className="form-control mt-2"
                          value={'selectedHotel.Hotel_Account_Details_Status'}
                        // readOnly 
                        onChange={hotelchange}
                        />
                      </div>
                    </div> */}

                    <div className="row text-start">
                      <div className="form-group col-md-12">
                        <label><strong>Account Number:</strong></label>
                        <input
                          type="text"
                          className="form-control mt-2"
                          value={selectedHotel.Hotel_Account_Details.Account_Number}
                          onChange={hotelresetchange}
                          name='accountnumber'
                        // readOnly={selectedHotel.Hotel_Account_Details_Status && selectedHotel.Hotel_Account_Details.Account_Number !== ''}
                        />
                        {showerr && <div className='text-danger'>Error Invalid Account Number</div>}
                      </div>
                    </div>
                    <div className="row text-start">
                      <div className="form-group col-lg-6">
                        <label><strong>IFSC Code:</strong></label>
                        <input
                          type="text"
                          className="form-control mt-2"
                          name='ifsccode'
                          value={selectedHotel.Hotel_Account_Details.IFSC_Code}
                          onChange={hotelresetchange}
                        // readOnly={selectedHotel.Hotel_Account_Details_Status && selectedHotel.Hotel_Account_Details.IFSC_Code !== ''}
                        />
                        {showerr && <div className='text-danger'>Error Invalid IFSC Number</div>}
                      </div>

                      <div className="form-group col-lg-6">
                        <label><strong>Pin Code:</strong></label>
                        <input
                          type="text"
                          className="form-control mt-2"
                          name='pincode'
                          value={selectedHotel.Hotel_Pincode}
                          onChange={hotelresetchange}
                        // readOnly={selectedHotel.Hotel_Account_Details_Status && selectedHotel.Hotel_Account_Details.pincode !== ''}
                        />
                        {showerr && <div className='text-danger'>Error Invalid Pin code</div>}
                      </div>
                    </div>
                    <div className="row text-start">
                      <div className="form-group col-lg-8">
                        <label><strong>State:</strong></label>
                        <select
                          className="form-control mt-2 select"
                          value={selectedHotel.Hotel_State}
                          name='City'
                          onChange={hotelresetchange}
                        >
                          <option value="">Select a State</option> {/* Placeholder option */}
                          {states.map((state, index) => (
                            <option key={index} value={state}>{state}</option>
                          ))}
                        </select>
                        {showerr && <div className="text-danger">Please select a valid state.</div>}
                      </div>
                    </div>
                    
                    <div className="row text-start">
                      <div className="form-group col-md-12">
                        <label><strong>Address:</strong></label>
                        <textarea
                          type="text"
                          name='Address'
                          className="form-control mt-2"
                          onChange={hotelresetchange}
                          value={selectedHotel.Hotel_Address}
                        // readOnly={selectedHotel.Hotel_Account_Details_Status && selectedHotel.Hotel_Account_Details.Address !== ''}
                        />
                        {showerr && <div className='text-danger'>Error Invalid Addreess </div>}
                      </div>
                    </div>

                    <div className="form-group text-center">
                      <button type="button" className="btn btn-primary" onClick={resethoteldetails} style={{ marginRight: '10px' }}>
                        Reset Details
                      </button>
                      <button type="button" className="btn btn-danger" onClick={() => setOpenModal(false)}>
                        Remove Details
                      </button>
                    </div>
                  </form>

                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="employee-table" style={{ backgroundColor: modalbg, color: textcolor, width: '100%', height: 'auto', marginTop: '20px', borderRadius: '6px' }}>
              <div className="table-container" style={{ padding: '30px 0px' }} >


                <DataTable
                  title={<span style={{ fontSize: '24px', fontWeight: 'bold' }}>Hotel List</span>}
                  columns={columns}
                  data={hotels}
                  pagination
                  paginationPerPage={10}
                  striped
                  responsive
                  highlightOnHover
                />


              </div>
            </motion.div>
          </div>


          {/* add hotels */}

        </div>

      </Layout>
    </div>
  );
};

export default Usermanage;
