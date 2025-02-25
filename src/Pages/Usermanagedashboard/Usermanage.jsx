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
  const [hotelname, setHotelname] = useState('')
  const [hotelcontact, setHotelContact] = useState('');
  const [showerr, setshowerr] = useState(false);
  const [delpopbox, setdelpopbox] = useState(false);
  const [confirmdel, setconfirmdel] = useState(false);
  const [openadd, setopenadd] = useState(false)
  const [accountnumber, setaccountnumber] = useState(null)
  const [ifsccode, setifsccodenumber] = useState(null);
  const [pincode , setPinCode] = useState('')
  const [City , setCity] = useState('')
  const [Address , setAddress] = useState('')

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




  const handleSubmit = async (e) => {
    if (!hotelname || !hotelcontact) {
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
      formData.append('hotel_name', hotelname);
      formData.append('hotel_contact', hotelcontact);

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
        setHotelname('');
        setHotelContact('');
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
  }, 25000);

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


  // add Details of the user 
  const addDetails = async (e) => {

    e.preventDefault();
    // Validate the inputs to ensure no empty values
    if (!accountnumber || !ifsccode) {
      setshowerr(true);
      return; // Prevent submission if any field is empty
    }
    setUseraddloading(true);

    const formData = new FormData();
    formData.append('username', user);
    formData.append('token', token);
    formData.append('hotel_id', selectedHotel.Hotel_ID);
    formData.append('hotel_account', accountnumber);
    formData.append('hotel_ifsc', ifsccode);
    formData.append('hotel_pincode', pincode);
    formData.append('hotel_ifsc', City);
    formData.append('hotel_ifsc', Address);


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
    {
      name: <div className='heading'>Account Details Status</div>,
      selector: row => <><div className='srno'>{row.Hotel_Account_Details_Status ? 'Active' : 'Inactive'}</div></>,
      sortable: true,
    },
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
            <i className="fa-solid fa-trash text-danger"></i>
          </span>

          {/* Edit Icon */}
          <span
            className="data-bs-toggle srno"
            data-bs-target="#exampleModal"
            onClick={() => openHotelpopup(row)} // Function for edit
          >
            <i className="fa-solid fa-pen text-primary "></i>
          </span>
        </div>
      ),
    },
  ];



  return (
    <div>
      <Layout>
        <Admindashboard />
        <div className="dashboard-container mt-25">
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="user-details-card text-center" style={{ backgroundColor: modalbg, color: textcolor }}>
            <form>
              <h3>Add Hotel</h3>
              {
                showerr && (
                  <>
                    <div>
                      <strong className='text-danger fs-4'>Error</strong> <span>Invalid Credentials</span>
                    </div>
                  </>
                )
              }
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setOpenModal(false)}
                style={{ border: 'none', position:'absolute', right:'0', background: 'none', fontSize: '1.2rem', color: 'red', cursor: 'pointer', outline: 'none' }}
              >
                &#10006;
              </button>

              <div className="row mt-4">
                <label htmlFor="username" className="col-4 col-form-label text-start"><strong>Hotel Name</strong></label>
                <div className="col-8">
                  <input
                    type="text"
                    className="form-control"
                    value={hotelname}
                    onChange={(e) => setHotelname(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="row mt-3">
                <label htmlFor="contact" className="col-5 col-form-label text-start"><strong>Hotel Contact </strong></label>
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

              </div>

              <div className="input-group row mt-3">
                <span
                  className="queuefetchbtn col-4 m-auto"
                  style={{ margin: '0px 25px', borderRadius: '4px', cursor: 'pointer' }}
                  onClick={handleSubmit}
                >
                  Submit
                </span>
              </div>
            </form>
          </motion.div>
        )}

        {/* Modal Popup */}
        {modalOpen && selectedHotel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="modal-overlay" style={{ backgroundColor: modalbg, color: textcolor }}>
            <div className="modal-content">
              <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Hotel Details</h4>
              <span className="close-btn" style={{ cursor: 'pointer' }} onClick={closeModal}>
                &#10006;
              </span>
              <form>
                <div className="row text-start" >
                  <div className="form-group col-lg-6">
                    <label><strong>Hotel Name:</strong></label>
                    <input type="text" className="form-control mt-2" value={selectedHotel.Hotel_Name} readOnly />
                  </div>
                  <div className="form-group col-lg-6">
                    <label><strong>Hotel ID:</strong></label>
                    <input type="text" className="form-control mt-2" value={selectedHotel.Hotel_ID} readOnly />
                  </div>
                </div>

                <div className="row text-start">
                  <div className="form-group col-lg-6">
                    <label><strong>Hotel Contact:</strong></label>
                    <input type="text" className="form-control mt-2" value={selectedHotel.Hotel_Contact} readOnly />
                  </div>
                  <div className="form-group col-lg-6">
                    <label><strong>Account Details Status:</strong></label>
                    <input type="text"
                      className="form-control mt-2"
                      value={selectedHotel.Hotel_Account_Details_Status ? 'Active' : 'Inactive'}
                      readOnly />
                  </div>
                </div>

                <div className="row text-start">
                  <div className="form-group col-md-12">
                    <label><strong>Account Number:</strong></label>
                    <input
                      type="text"
                      className="form-control mt-2"
                      value={accountnumber || selectedHotel.Hotel_Account_Details_Status && selectedHotel.Hotel_Account_Details.Account_Number || ''}
                      readOnly={selectedHotel.Hotel_Account_Details_Status && selectedHotel.Hotel_Account_Details.Account_Number !== ''}
                      onChange={(e) => setaccountnumber(e.target.value)}
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
                      value={ifsccode || selectedHotel.Hotel_Account_Details_Status && selectedHotel.Hotel_Account_Details.IFSC_Code || ''}
                      readOnly={selectedHotel.Hotel_Account_Details_Status && selectedHotel.Hotel_Account_Details.IFSC_Code !== ''}
                      onChange={(e) => setifsccodenumber(e.target.value)}
                    />
                    {showerr && <div className='text-danger'>Error Invalid IFSC Number</div>}
                  </div>

                  <div className="form-group col-lg-6">
                    <label><strong>Pin Code:</strong></label>
                    <input
                      type="text"
                      className="form-control mt-2"
                      value={pincode || selectedHotel.Hotel_Account_Details_Status && selectedHotel.Hotel_Account_Details.pincode || ''}
                      readOnly={selectedHotel.Hotel_Account_Details_Status && selectedHotel.Hotel_Account_Details.pincode !== ''}
                      onChange={(e) => setPinCode(e.target.value)}
                    />
                    {showerr && <div className='text-danger'>Error Invalid Pin code</div>}
                  </div>
                  </div>
                  <div className="row text-start">
                  <div className="form-group col-lg-8">
                    <label><strong>State:</strong></label>
                    <input
                      type="text"
                      className="form-control mt-2"
                      value={City || selectedHotel.Hotel_Account_Details_Status && selectedHotel.Hotel_Account_Details.IFSC_Code || ''}
                      readOnly={selectedHotel.Hotel_Account_Details_Status && selectedHotel.Hotel_Account_Details.IFSC_Code !== ''}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    {showerr && <div className='text-danger'>Error Invalid City</div>}
                  </div>
                  </div>

                  <div className="row text-start">
                  <div className="form-group col-md-12">
                    <label><strong>Address:</strong></label>
                    <textarea
                      type="text"
                      className="form-control mt-2"
                      value={Address || selectedHotel.Hotel_Account_Details_Status && selectedHotel.Hotel_Account_Details.Address || ''}
                      readOnly={selectedHotel.Hotel_Account_Details_Status && selectedHotel.Hotel_Account_Details.Address !== ''}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    {showerr && <div className='text-danger'>Error Invalid Addreess </div>}
                  </div>
                  </div>

                  

                <div className="form-group text-center">
                  <button type="button" className="btn btn-primary" onClick={addDetails} style={{ marginRight: '10px' }}>
                    Add Details
                  </button>
                  <button type="button" className="btn btn-danger" onClick={RemoveDetails}>
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
