import React, { useState, useEffect } from 'react';
import './LoginForm.css'
import Layout from '../../Components/Layout/Layout';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userlogin } from '../../Features/Superslice';

const LoginForm = () => {
    const [userdetails, setUserDetails] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [showerror, setShowerr] = useState(false);


    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            setIsDarkTheme(true);
        } else {
            setIsDarkTheme(false);
        }
    }, []);

    // useEffect(() => {
    //     const isLoggedIn = localStorage.getItem('isLoggedIn');
    //     if (isLoggedIn === 'true') {
    //         localStorage.removeItem('isLoggedIn');
    //         navigate('/');
    //     }
    // }, [navigate]);

    const onchangetext = (e) => {
        setUserDetails((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const submitDetails = async (e) => {
        e.preventDefault();
        navigate('/Admindashboard');
        try {
            const formdata = new FormData();
            formdata.append('username', userdetails.username);
            formdata.append('password', userdetails.password);

            const response = await fetch('http://192.168.1.5/Queue/Super_Admin/log.php?do=login', {
                method: 'POST',
                body: formdata,
            });
            const data = await response.json();
            console.log(data);

            if (data.Status === false) {
                setShowerr(true);
            }

            if (data.Status === true) {
                dispatch(userlogin({
                    token: data.Token,
                    username: userdetails.username,
                    password : userdetails.password,
          
                  }));
                navigate('/Maindashboard', { state: { tokenid: data.Token, username: userdetails.username}});
            }

        } catch (err) {
            console.log(err);
        }
    };

    const togglePass = (id) => {
        const passwordInput = document.getElementById(id);
        passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    };

    return (
        <div>
            <Layout>

                <div className={`login-container ${isDarkTheme ? 'dark' : 'light'}`}>
                    <div className="card-container">
                    {
                                showerror ? (
                                    <>
                                        <div>
                                            <div className="showerror text-center">
                                                <strong className='text-danger fs-2'>Error! </strong><span style={{ fontSize: '18px' }}>Invalid Username and Password</span>
                                                <i class="fa-solid fa-xmark"onClick={() => setShowerr(false)} style={{marginLeft:'15px', fontSize:'25px', color:"red"}}></i> 
                                            </div>
                                        </div>
                                    </>
                                ) : ''
                            }
                        <form>
                            <h4 className="text-center fs-2">Superadmin Login</h4>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={userdetails.username}
                                    onChange={onchangetext}
                                    id="username"
                                    name="username"
                                />
                            </div>
                            <div className="mb-3" style={{position:'relative'}}>
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={userdetails.password}
                                    onChange={onchangetext}
                                    name="password"
                                    id="password"
                                />
                                <i class="fa-solid fa-eye" style={{position: 'absolute', cursor : 'pointer', top:'40px', right:'10px', color: 'black'}} onClick={() => {togglePass('password')}}></i>
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                <label htmlFor="form-check-label">Check me out</label>
                            </div>
                            <button
                                type="submit"
                                className="btn mt-2"
                                onClick={submitDetails}
                            >
                                <strong>Submit</strong>
                            </button>
                        </form>
                    </div>
                </div>
            </Layout>
        </div>
    );
};

export default LoginForm;
