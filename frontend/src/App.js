// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './styles.css';
import { Grid } from '@mui/material';

import Home from './components/homePage';
import Login from './components/login';
import Register from './components/register';
import AddCustomers from './components/addCustomers';
import CustomerCard from './components/customerCard';
import BillingPage from './components/billingPage';
import InvoiceDetailsByNumber from './components/invoiceDetails';

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <Grid padding='20px'>
        <Grid container spacing={2} className='nav-list'>
          <Grid item xs={10} />
          <Grid item xs={1}>
            {!isLoggedIn ? (
              <li align='right'>
                <Link to="/" className="nav-link" >
                  Login
                </Link>
              </li>
            ) : null}
          </Grid>
          <Grid item xs={1}>
            {!isLoggedIn ? (
              <li>
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </li>
            ) : null}
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
            path="/register"
            element={!isLoggedIn ? <Register /> : <Navigate to="/" />}
          />
          <Route
            path="/home"
            element={isLoggedIn ? <Home /> : <Navigate to="/" />}
          />
          <Route
            path="/addCustomers"
            element={isLoggedIn ? <AddCustomers /> : <Navigate to="/" />}
          />
          <Route
            path="/customerCard"
            element={isLoggedIn ? <CustomerCard /> : <Navigate to="/" />}
          />
          <Route
            path="/logout"
            element={<Navigate to="/"/>}
          />
          < Route
            path="/billingPage"
            element =  { isLoggedIn ? <BillingPage /> : <Navigate to="/" />}
          />
          < Route
            path="/invoiceDetails"
            element =  { isLoggedIn ? <InvoiceDetailsByNumber /> : <Navigate to="/" />}
          />
        </Routes>
      </Grid>
    </Router>
  );
}

export default App;
