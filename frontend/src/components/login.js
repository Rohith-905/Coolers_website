// frontend/src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import {  Navigate } from 'react-router-dom';
import './login.css'; // Import the CSS file

const Login = ({ setLoggedIn, isLoggedIn  }) => {
  // const[data,setData] = useState('');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // useEffect(() => {
  //   // Fetch data from the server when the component mounts
  //   axios.get('http://localhost:5000/api/data')
  //     .then(response => {
  //       setData(response.data.message);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching data:', error);
  //     });
  // }, []);

  const HandleLogin = async (e) => {
    e.preventDefault();
  
    try {
      
      // Send a request to the server for authentication
        await axios.post('http://localhost:5000/api/login', formData);
        // setError('Successful login');
        // Store the JWT token in local storage upon successful login
        // localStorage.setItem('token', response.data.token);
      
      // Redirect to a protected route or perform other actions as needed
      // For example, you can use React Router to navigate to a different page
      // history.push('/dashboard');
      // Set isLoggedIn to true upon successful login
        setLoggedIn(true);
        if (isLoggedIn) {
          return <Navigate to="/home" />;
        }

        // Navigate to the homePage route
        // navigateToHomePage();
    } catch (err) {
      // Handle login error
      setError('Invalid username or password');
    }
  };

  return (
    // <div>
    //     <h2>Login</h2>
    //     <form onSubmit={HandleLogin}>
    //     <input
    //         type="text"
    //         name="username"
    //         placeholder="Username"
    //         value={formData.username}
    //         onChange={handleInputChange}
    //     />
    //     <input
    //         type="password"
    //         name="password"
    //         placeholder="Password"
    //         value={formData.password}
    //         onChange={handleInputChange}
    //     />
    //     <button type="submit">Login</button>
    //     </form>
    //     {error && <p>{error}</p>}
    // </div>
    <div className="login-container">
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
        <input
          type="password"
          name="password"
          className="login-input"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <button type="submit" className="login-button">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;

