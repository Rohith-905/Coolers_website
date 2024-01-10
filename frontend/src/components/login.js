// frontend/src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import {  Navigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import '../styles.css';
import AppBarPage from './appBarPage';

const Login = ({ setLoggedIn, isLoggedIn  }) => {
  // const[data,setData] = useState('');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [logIn,setLogIn] = useState(false);
  

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const HandleLogin = async (e) => {
    e.preventDefault();
  
    try {
      
      // Send a request to the server for authentication
        const res = await axios.post('http://localhost:5000/api/login', formData);
        // setError('Successful login');
        // Store the JWT token in local storage upon successful login
        // localStorage.setItem('token', response.data.token);
      
      // Redirect to a protected route or perform other actions as needed
      // For example, you can use React Router to navigate to a different page
      // history.push('/dashboard');
      // Set isLoggedIn to true upon successful login
      setError(res.data.message);
        setLoggedIn(true);
        setLogIn(true);
        
        // Navigate to the homePage route
        // navigateToHomePage();
    } catch (err) {
      // Handle login error
      setError('Invalid username or password');
    }
  };
  if (logIn) {
    return <Navigate to="/home" />;
  }

  return (
    <AppBarPage loggedIn={false}>
      <Grid className="login-container">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={HandleLogin}>
          <input
            type="text"
            name="username"
            className="login-input"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
          />
          <Grid style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="login-input"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              style={{ flex: 1 }}
            />
            <p
              className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
              style={{
                marginLeft: '-26px',
                cursor: 'pointer',
              }}
              onClick={togglePasswordVisibility}
            ></p>
          </Grid>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        {error && <p>{error}</p>}
      </Grid>
    </AppBarPage>
  );
};

export default Login;

