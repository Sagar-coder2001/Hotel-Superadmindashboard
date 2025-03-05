import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Dashboard/Admindashboard.css';
import '../Superadmindashboard/superadmin.css'
import Layout from '../../Components/Layout/Layout';
import Admindashboard from '../Dashboard/Admindashboard';
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Select from 'react-select/base';

const Superadmin = () => {
  const [openModal, setOpenModal] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [allUserdata, setAllUserdata] = useState([]);
  const [selectedRole, setSelectedRole] = useState('emp');
  const [selectedHotel_id, setSelectedHotel_Id] = useState('HOT000001');
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [delpopbox, setdelpopbox] = useState(false);
  const [confirmdel, setconfirmdel] = useState(false);
  const [useraddloading, setUseraddloading] = useState(false);
  const [showerr, setshowerr] = useState(false);

  const [filteredHotels, setFilteredHotels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const bgcolor = useSelector((state) => state.theme.navbar)
  const textcolor = useSelector((state) => state.theme.textcolor);
  const modalbg = useSelector((state) => state.theme.modal);
  const { isLoggedIn, token, username } = useSelector((state) => state.loggedin);



  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Handle adding a new user
  const handleUserSubmit = async (data) => {
    setUseraddloading(true);
    const { newuser, password } = data;
    if (!newuser || !password) {
      setshowerr(true);
      return;
    }

    else {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('token', token);
      formData.append('new_user', newuser);
      formData.append('password', password);
      formData.append('role', selectedRole);
      formData.append('hotel_id', selectedHotel_id);

      try {
        const response = await fetch('http://192.168.1.25/Queue/Super_Admin/hotel.php?for=addUser', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to submit the data');

        const data = await response.json();
        if (data.Status === true) {
          setUseraddloading(false);
          window.location.reload();
        }

        if (data.Status === false)
          setUserExist(true);
        setUseraddloading(false);
        console.log(data);
        setOpenModal(false);
        // newuser('');
        // password('');
        setSelectedRole('emp');
      } catch (error) {
        console.error('Error submitting data:', error);
      }
    }
  };

  const fetchData = async (hotel_id) => {
    setLoadingUsers(true);
    const formData = new FormData();
    formData.append('username', username);
    formData.append('token', token);
    formData.append('hotel_id', hotel_id);


    try {
      const response = await fetch('http://192.168.1.25/Queue/Super_Admin/hotel.php?for=getUser', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();
      setAllUserdata(data.User);
      console.log(data)
      if (data.Status === false) {
        setUserExist(true);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      // alert('Error: ' + error.message);
    } finally {
      setLoadingUsers(false);
    }
  };


  useEffect(() => {
    if (selectedHotel_id) {
      fetchData(selectedHotel_id);
    }
  }, []);


  const userlogoutpopbox = (delete_user) => {
    setdelpopbox(true);
    setconfirmdel(delete_user);
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

  const userlogout = async (delete_user) => {
    setUseraddloading(true)
    const formData = new FormData();
    formData.append('username', username);
    formData.append('token', token);
    formData.append('delete_user', delete_user);
    formData.append('hotel_id', selectedHotel_id);

    try {
      const response = await fetch('http://192.168.1.25/Queue/Super_Admin/hotel.php?for=removeUser', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to delete the user');
      const data = await response.json();
      console.log('User removed successfully:', data);
      if (data.Status === true) {
        window.location.reload();
      }
      fetchData(selectedHotel_id);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
    finally {
      setUseraddloading(false)
    }
  };

  const addEmpUser = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    const fetchHotels = async () => {
      if (username && token) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('token', token);

        try {
          const response = await fetch('http://192.168.1.25/Queue/Super_Admin/hotel.php?for=getHotelDetails', {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();
          setHotels(data.Hotel);
          console.log(data.Hotel[0].Hotel_ID);
          setFilteredHotels(data.Hotel)
        } catch (error) {
          console.error('Error fetching hotels:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchHotels();
  }, [username, token]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = hotels.filter((hotel) =>
      hotel.Hotel_Name.toLowerCase().includes(query)
    );
    setFilteredHotels(filtered);
  };

  const columns = [
    {
      name: <div className='heading'>Sr. No</div>,
      selector: (row, index) => <><div className='srno'>{index + 1}</div></>,
      sortable: true,
    },
    {
      name: <div className='heading'>Username</div>,
      selector: row => <><div className='srno'>{row.Username}</div></>,
      sortable: true,
    },
    {
      name: <div className='heading'>Role</div>,
      selector: row => <><div className='srno'>{row.Role}</div></>,
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
            onClick={() => userlogoutpopbox(row.Username)} // Function for delete
            style={{ marginRight: '20px' }}
          >
            <button className='btn btn-danger'>Delete</button>
          </span>

          {/* Edit Icon */}
          <span
            className="data-bs-toggle srno"
            data-bs-target="#exampleModal"
            onClick={addEmpUser} // Function for edit
          >
            <button className='btn btn-warning'>Edit</button>
          </span>
        </div>
      ),
    },
  ];

  console.log(hotels);

  return (
    <Layout>
      <Admindashboard />
      <div className="dashboard-container mt-19">
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

        {
          userExist && (
            <>
              <div class="alert alert-danger alert-dismissible fade show mt-4" role="alert">
                <strong>Error!</strong> User already Exist.
                <button type="button" class=" close mx-5 p-1 " data-dismiss="alert" aria-label="Close"
                onClick={() => setUserExist(false)} >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </>
          )
        }

        {/*
         {userExist && (
          <div className="user-details-card">
            <div className="card" style={{ padding: '10px', marginTop: '20px' }}>
              Username already exists
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setUserExist(false)}
              style={{ top: '0', right: '0', border: 'none', background: 'none', fontSize: '1rem', color: 'red', cursor: 'pointer', outline: 'none' }}
            >
              &#10006;
            </button>
          </div>
        )} 
         */}

        <div className="employee-manage">
          <div className="addbtn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="mt-4" onClick={addEmpUser}>Add User</button>

            <div className="row mt-4">

              <label htmlFor="role" className="col-4 col-form-label text-start"><strong>Hotel-Id</strong></label>
              <div className="col-8">
                <div>
                  <input type="text"
                    placeholder='Search Hotels'
                    style={{ marginBottom: '10px', boxShadow: '0px 0px 19px solid', outline: 'none', padding: '4px' }}
                    onChange={handleSearchChange}
                    className='form-control'
                  />
                  <select
                    className="form-control"
                    value={selectedHotel_id}
                    onChange={(e) => {
                      const newSelectedValue = e.target.value;
                      setSelectedHotel_Id(newSelectedValue);
                      fetchData(newSelectedValue);
                    }}
                  >

                    {loading ? (
                      <option>Loading...</option>
                    ) : (
                      filteredHotels.length ? (

                        filteredHotels.map((hotel, index) => (
                          <>
                            <option key={index} value={hotel.Hotel_ID}>
                              {hotel.Hotel_Name}
                            </option>
                          </>
                        ))
                      ) : (
                        <option>No hotels found</option>
                      )
                    )}
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* Modal for Adding User */}
          {openModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="user-details-card text-center"
              style={{ backgroundColor: modalbg, color: textcolor }}
            >
              <form onSubmit={handleSubmit(handleUserSubmit)}>
                <h3>superadmin</h3>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setOpenModal(false)}
                  style={{ border: 'none', position: 'absolute', right: '0', background: 'none', fontSize: '1.2rem', color: 'red', cursor: 'pointer', outline: 'none' }}
                >
                  &#10006;
                </button>
                {/* User form inputs */}
                <div className="row mt-4">
                  <label htmlFor="username" className="col-4 col-form-label text-start">Username:</label>
                  <div className="col-8">
                    <input
                      type="text"
                      className="form-control"
                      {...register('newuser', { required: 'Username is required' })}
                    />
                    {errors.newuser && <span style={{ color: 'red' }}>{errors.newuser.message}</span>}
                  </div>
                </div>
                <div className="row mt-4">
                  <label htmlFor="contact" className="col-4 col-form-label text-start">Password:</label>
                  <div className="col-8">
                    <input
                      type="text"
                      className="form-control"
                      {...register('password', { required: 'Password is required' })}
                    />
                    {errors.password && <span style={{ color: 'red' }}>{errors.password.message}</span>}
                  </div>
                </div>
                <div className="row mt-4">
                  <label htmlFor="role" className="col-4 col-form-label text-start">Role:</label>
                  <div className="col-8">
                    <select
                      className="form-control"
                      onChange={(e) => setSelectedRole(e.target.value)}
                    // {...register('role', { required: 'Role is required' })}
                    >
                      <option value="emp">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                    {errors.role && <span style={{ color: 'red' }}>{errors.role.message}</span>}
                  </div>
                </div>
                <div className="row mt-4">
                  <label htmlFor="hotel_id" className="col-4 col-form-label text-start">Hotel-Id:</label>
                  <div className="col-8">
                    <select
                      className="form-control"
                      onChange={(e) => {
                        const newSelectedValue = e.target.value;
                        setSelectedHotel_Id(newSelectedValue);
                        fetchData(newSelectedValue);
                      }}
                    // {...register('hotel_id', { required: 'Hotel is required' })}
                    >
                      {/* Map over hotels to create options */}
                      {hotels.map((item) => (
                        <option key={item.Hotel_ID} value={item.Hotel_ID}>
                          {item.Hotel_ID} {/* You can display the hotel name here */}
                        </option>
                      ))}
                    </select>
                    {errors.hotel_id && <span style={{ color: 'red' }}>{errors.hotel_id.message}</span>}
                  </div>
                </div>

                <div className="row mt-4">
                  <button type="submit" className="btn btn-primary">Add User</button>
                </div>
              </form>
            </motion.div>
          )}
          {/* User Exists Error Message */}

          {/* User List */}

          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="employee-table" style={{ backgroundColor: modalbg, color: textcolor, width: '100%', height: 'auto', marginTop: '20px', borderRadius: '6px' }}>
            <div className="table-container" style={{ padding: '19px 0px' }} >
              <DataTable
                title={<span style={{ fontSize: '24px', fontWeight: 'bold' }}>Employee List</span>}
                columns={columns}
                data={allUserdata}
                pagination
                paginationPerPage={10}
                striped
                responsive
                highlightOnHover
              />
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Superadmin;
