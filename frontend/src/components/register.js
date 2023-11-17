// Registration.js
import React, { useState } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';

const Registration = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      // Send a request to the server for user registration
      await axios.post('http://localhost:5000/api/register', formData);

      // Registration successful, you can redirect or show a success message
      console.log('Registration successful!');
    } catch (error) {
        setError('Invalid username or password');
        console.error('Registration failed:', error.response.data.error);
    }
  };

  return (
    <Grid className="login-container">
      <h2 className="login-title">Register</h2>
      <form className="login-form" onSubmit={handleRegistration}>
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
          Register
        </button>
      </form>
      {error && <p>{error}</p>}
    </Grid>
  );
};

export default Registration;
