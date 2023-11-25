// frontend/src/App.js
import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './styles.css';
import { Grid } from '@mui/material';

import Home from './components/homePage';
import Login from './components/login';
import Register from './components/register';

function App() {

  const [isLoggedIn, setLoggedIn] = useState(false);

  const handleLogout = () => {
    // Add any additional logic for logging out (e.g., clearing localStorage)
    setLoggedIn(false);
  };

  return (
    <Router>
    <Grid padding='20px'>
      <Grid container spacing={2} className='nav-list'>
      <Grid item xs={10}/>
      <Grid item xs={1}>
        {!isLoggedIn ? (
          <li align='right'> 
            <Link to="/" className="nav-link" >
              Login
            </Link>
          </li>
        ):null}
      </Grid>
      <Grid item xs={1}>
      {!isLoggedIn ? (
            <li>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </li>
          ):
          <li align='right'>
            <Link to="/" className="nav-link" onClick={handleLogout}>
              Logout
            </Link>
          </li>
          }
      </Grid>
      <Grid item xs={4}>
      </Grid>
    </Grid>
      <Routes>
        <Route
          path="/"
          element={<Login setLoggedIn={setLoggedIn} isLoggedIn={isLoggedIn} />}
        />
        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!isLoggedIn ? <Register /> : <Navigate to="/" />}
        />
      </Routes>
    </Grid>
  </Router>
);
};


export default App;
