import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Dashboard/Admindashboard.css';
import '../Superadmindashboard/superadmin.css'
import Layout from '../../Components/Layout/Layout';
import Admindashboard from '../Dashboard/Admindashboard';


const Superadmin = () => {
  const location = useLocation();
  const { tokenid, username } = location.state || {};
  const [token, setToken] = useState(tokenid || '');
  const [user, setUsername] = useState(username || '');
  const [openModal, setOpenModal] = useState(false);
  const [newuser, setNewuser] = useState('');
  const [password, setPassword] = useState('');
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

  const navigate = useNavigate();

  // Handle adding a new user
  const handleSubmit = async (e) => {
    if (newuser === "" && password === "") {
      setshowerr(true);
      return false;
    } else {
      setshowerr(false);
      e.preventDefault();
      setUseraddloading(true);
      const formData = new FormData();
      formData.append('username', user);
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
        }

        if (data.Status === false) setUserExist(true);
        console.log(data);
        setOpenModal(false);
        setNewuser('');
        setPassword('');
        setSelectedRole('emp');
      } catch (error) {
        console.error('Error submitting data:', error);
        alert('Error: ' + error.message);
      }
    }
  };

  const fetchData = async (hotel_id) => {
    setLoadingUsers(true);
    const formData = new FormData();
    formData.append('username', user);
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
      if (data.Status === false) setUserExist(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error: ' + error.message);
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
    const formData = new FormData();
    formData.append('username', user);
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
      fetchData(selectedHotel_id);
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error: ' + error.message);
    }
  };


  const addEmpUser = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    const fetchHotels = async () => {
      if (user && token) {
        const formData = new FormData();
        formData.append('username', user);
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
  }, [user, token]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

  const filtered = hotels.filter((hotel) =>
    hotel.Hotel_Name.toLowerCase().includes(query)
  );
  setFilteredHotels(filtered);
};

  return (
    <Layout>
      <Admindashboard />
      <div className="dashboard-container mt-5">
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
              <div className="loader-overlay">
                <div class="spinner-border text-primary" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            </>
          )
        }
        <div className="employee-manage">
          <div className="addbtn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="mt-4" onClick={addEmpUser}>Add User</button>
            <div className="row mt-4">
            <input type="text"
              placeholder='Search Hotels' 
              style={{marginBottom:'10px', boxShadow:'0px 0px 5px solid', outline:'none', padding:'4px'}}
              onChange={handleSearchChange}
              className='form-control'
              />
              <label htmlFor="role" className="col-5 col-form-label text-start"><strong>Hotel-Id</strong></label>
              <div className="col-7">
              <div>
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
                    filteredHotels.length > 0 ? (
                      filteredHotels.map((hotel, index) => (
                        <option key={index} value={hotel.Hotel_ID}>
                          {hotel.Hotel_Name}
                        </option>
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
            <div className="user-details-card text-center">
              <form>
                <h3>superadmin</h3>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setOpenModal(false)}
                  style={{ border: 'none', background: 'none', fontSize: '1.2rem', color: 'red', cursor: 'pointer', outline: 'none' }}
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
                      value={newuser}
                      onChange={(e) => setNewuser(e.target.value)}
                      required
                    />
                  </div>
                  {showerr &&
                    <div>
                      <span style={{ color: 'red', marginLeft: '10px', fontSize: '15px' }}>username is required</span>
                    </div>
                  }
                </div>
                <div className="row mt-4">
                  <label htmlFor="contact" className="col-5 col-form-label text-start">Password</label>
                  <div className="col-7">
                    <input
                      type="text"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {showerr ?
                    <div>
                      <span style={{ color: 'red', marginLeft: '80px', fontSize: '15px' }}>password is required</span>
                    </div>
                    : ""
                  }
                </div>
                <div className="row mt-4">
                  <label htmlFor="role" className="col-4 col-form-label text-start">Role</label>
                  <div className="col-8">
                    <select
                      className="form-control"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="emp">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="row mt-4">
                  <label htmlFor="role" className="col-4 col-form-label text-start">Hotel-Id</label>
                  <div className="col-8">
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
                        hotels.map((hotel, index) => (
                          <option key={index} value={hotel.Hotel_ID}>
                            {hotel.Hotel_Name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
                <hr />
                <div className="input-group row mb-3">
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
          {/* User Exists Error Message */}
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
          {/* User List */}
          <div className="employee-table">
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr style={{ backgroundColor: 'black', color: 'white' }}>
                    <th style={{ padding: '10px' }}>Sr. No</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingUsers ? (
                    <tr>
                      <td colSpan="4" style={{textAlign: 'center'}}>
                        Loading Users...
                      </td>
                    </tr>
                  ) : allUserdata ? (
                    allUserdata.map((emp, index) => (
                      <tr key={index} style={{ cursor: 'pointer' }}>
                        <td>{index + 1}</td>
                        <td>{emp.Username}</td>
                        <td>{emp.Role}</td>
                        <td>
                          <span
                            className="data-bs-toggle"
                            data-bs-target="#exampleModal"
                            onClick={() => userlogoutpopbox(emp.Username)}
                          >
                            <i className="fa-solid fa-trash text-danger"></i>
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center' }}>
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Superadmin;
