// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { Grid, Checkbox } from '@mui/material';
import '../styles.css';
import AppBarPage from './appBarPage';

const Login = ({ setLoggedIn, isLoggedIn }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [logIn, setLogIn] = useState(false);
  const [savePassword, setSavePassword] = useState(false);

  useEffect(() => {
    // Load saved username and password from localStorage
    const savedUsername = localStorage.getItem('savedUsername');
    const savedPassword = localStorage.getItem('savedPassword');

    if (savedUsername && savedPassword) {
      setFormData({ username: savedUsername, password: savedPassword });
      setSavePassword(true);
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSavePassword = () => {
    if (savePassword) {
      localStorage.removeItem('savedUsername');
      localStorage.removeItem('savedPassword');
    } else {
      localStorage.setItem('savedUsername', formData.username);
      localStorage.setItem('savedPassword', formData.password);
    }

    setSavePassword(!savePassword);
  };

  const HandleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/login', formData);
      setError(res.data.message);
      setLoggedIn(true);
      setLogIn(true);

      if (savePassword) {
        // Save username and password in localStorage
        localStorage.setItem('savedUsername', formData.username);
        localStorage.setItem('savedPassword', formData.password);
      }

    } catch (err) {
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
        <div style={{display:'flex',alignItems:'center'}}>
          <Checkbox
            checked={savePassword}
            onChange={handleSavePassword}
            color="primary"
          />
          <label>Save Password</label>
        </div>
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
