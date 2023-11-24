// frontend/src/Home.js
import React, { useState } from 'react';
import axios from 'axios';


const Home = () => {
  const [coolers, setCoolers] = useState([]);
  const [error,setError] = useState(' ');
    try{
      // Fetch data from your API endpoint
      axios.get('http://localhost:5000/api/coolers_available') // Replace with your actual API endpoint
        .then(response => {
          setCoolers(response.data); // Assuming your API returns an array of user objects
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
    catch (err) {
      // Handle login error
      setError('Invalid username or password');
    }

  
  return (
    <div>
      <h2>Available Coolers</h2>

      {coolers.length > 0 ? (
        <div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity Available</th>
              </tr>
            </thead>
            <tbody>
              {coolers.map((cooler) => (
                <tr key={cooler.id}>
                  <td>{cooler.model_name}</td>
                  <td>{cooler.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No coolers available</p>
      )}

      {error && <p>{error}</p>}
    </div>
  );
};
export default Home;
