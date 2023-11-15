// frontend/src/App.js
import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import Home from './components/homePage';
import Login from './components/login';

function App() {

  const [isLoggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
    <div>
        <nav>
          <ul>
            {isLoggedIn ? (
              <li>
                <Link to="/home">Home</Link>
              </li>
            ) : null}
            {/* {!isLoggedIn ? (
              <li>
                <Link to="/">Login</Link>
              </li>
            ) : null} */}
            {isLoggedIn ? (
              <li>
              <Link to="/logout">Login</Link>
            </li>
            ) : null}
          </ul>
        </nav>

        <hr />
    <Routes>
    <Route
            path="/home"
            element={isLoggedIn ? <Home /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={<Login setLoggedIn={setLoggedIn} isLoggedIn={isLoggedIn} />}
          />
    </Routes>
    </div>
  </Router>
);
};


export default App;
