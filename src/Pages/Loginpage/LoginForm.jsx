import React, { useState, useEffect } from 'react';
import './LoginForm.css';
import Layout from '../../Components/Layout/Layout';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userlogin } from '../../Features/Superslice';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

const LoginForm = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors
    } = useForm();

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            setIsDarkTheme(true);
        } else {
            setIsDarkTheme(false);
        }
    }, []);

    const onSubmit = async (data) => {
        try {
            const formdata = new FormData();
            formdata.append('username', data.username);
            formdata.append('password', data.password);

            const response = await fetch('http://192.168.1.25/Queue/Super_Admin/log.php?do=login', {
                method: 'POST',
                body: formdata,
            });

            const result = await response.json();

            if (result.Status === false) {
                setError("username", {
                    type: "manual",
                    message: "Invalid Username",
                });
                setError("password", {
                    type: "manual",
                    message: "Invalid Password",
                });
            }

            if (result.Status === true) {
                dispatch(userlogin({
                    token: result.Token,
                    username: data.username,
                    password: data.password,
                }));

                navigate('/Maindashboard', { state: { tokenid: result.Token, username: data.username } });
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
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className={`login-container ${isDarkTheme ? 'dark' : 'light'}`}>
                    <div className="card-container">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <h4 className="text-center fs-2">Superadmin Login</h4>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    {...register('username', { required: "Username is required" })}
                                />
                                <span className='text-danger'>
                                    {errors.username && errors.username.message}
                                    {/* {showerror && 'Invalid Username'} */}
                                </span>
                            </div>

                            <div className="mb-3" style={{ position: 'relative' }}>
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    {...register('password', { required: "Password is required" })}
                                />
                                <i className="fa-solid fa-eye"
                                    style={{ position: 'absolute', cursor: 'pointer', top: '40px', right: '10px', color: 'black' }}
                                    onClick={() => { togglePass('password') }}
                                ></i>
                                <span className='text-danger'>
                                    {errors.password && errors.password.message}
                                    {/* {showerror && 'Invalid Username'} */}
                                </span>
                            </div>

                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                <label htmlFor="form-check-label">Check me out</label>
                            </div>

                            <button type="submit" className="btn mt-2">
                                <strong>Submit</strong>
                            </button>
                        </form>
                    </div>
                </motion.div>
            </Layout>
        </div>
    );
};

export default LoginForm;
