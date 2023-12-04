import React, { useState } from "react";
import AppBarPage from "./appBarPage";
import "./addCustomers.css"; // Import your CSS file
import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

const AddCustomers = () => {
  const [formData, setFormData] = useState({
    customer_name: "",
    shop_address: "",
    model_name: "",
    amount: "",
    quantity: "",
    vehicle_number: "",
    date: "",
  });

  const [additionalDetails, setAdditionalDetails] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddDetails =  async (e) => {
    e.preventDefault();

    setFormData({
      customer_name: formData.customer_name,
      shop_address: formData.shop_address,
      model_name: "",
      amount: "",
      quantity: "",
      vehicle_number: formData.vehicle_number,
      date: formData.date,
    });
    try {
      console.log(JSON.stringify(formData));
      // Make a POST request to your backend API endpoint
      await fetch("http://localhost:5000/api/add-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then(response => {
          if (response.ok) {
            console.log("Data successfully stored in the database!");
          } else {
            alert("No sufficeint quantity");
          }
        })
        .catch(error => {
          alert(error);
        });      
    } catch (error) {
      console.error("Error:", error);
      window.alert("Error");
    }
  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Make a POST request to your backend API endpoint for additional details
      const response = await fetch("http://localhost:5000/api/add-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: formData.customer_name,
          shop_address: formData.shop_address,
          model_name: formData.model_name,
          amount: formData.amount,
          quantity: formData.quantity,
          vehicle_number: formData.vehicle_number,
          date: formData.date,
          total_amount: formData.amount*formData.quantity,
        }),
      });
      if (!response.ok) {
        // If the response status is not in the range of 200 to 299, handle the error
        const errorData = await response.json(); // Assuming your server sends details about the error in JSON format
        throw new Error(errorData.message || "Server error");
      }
      else{
        setAdditionalDetails([...additionalDetails, { ...formData }]);
      }
  
      // ... (handle the response as needed)
    } catch (error) {
      console.error("Error:", error);
      window.alert("Error");
    }
  
    // Clear the form after submission
    setFormData({
      customer_name: "",
      shop_address: "",
      model_name: "",
      amount: "",
      quantity: "",
      vehicle_number: "",
      date: "",
      total_amount: "", // Clear the total_amount field too
    });
    setAdditionalDetails([]);
  };
  
  
  return (

      <AppBarPage className="add-customers-container">
        <h2>Add Customer Details</h2>
        <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tc>
              <td>
                <label>Customer Name:</label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  required
                />
              </td>
            </tc>
            <tr>
              <tc>
                <label>Address:</label>
                <input
                  type="text"
                  name="shop_address"
                  value={formData.shop_address}
                  onChange={handleInputChange}
                  required
                />
              </tc>
            </tr>
            <tr>
              <td>
                <label>Vehicle Number:</label>
                <input
                  type="text"
                  name="vehicle_number"
                  value={formData.vehicle_number}
                  onChange={handleInputChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      {/* Additional Details Section */}
      <h3>Additional Details</h3>
      <form>
        <table>
          <tbody>
            {/* Map through additional details and display in the table */}
            <tr>
                <td>Model Name</td>
                <td>Amount</td>
                <td>Quantity</td>
              </tr>
            {additionalDetails.map((detail, index) => (
              <tr key={index}>
                <td>{detail.model_name}</td>
                <td>{detail.amount}</td>
                <td>{detail.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>

      {/* Form for Incrementing Details */}
      <h3>Increment Details</h3>
      <form>
        <table>
          <tbody>
            <tr>
              <td>
                <label>Model Name:</label>
              </td>
              <td>
                <input
                  type="text"
                  name="model_name"
                  value={formData.model_name}
                  onChange={handleInputChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Amount:</label>
              </td>
              <td>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Quantity:</label>
              </td>
              <td>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <Fab color="primary" aria-label="add" onClick={handleAddDetails}>
                  <AddIcon />
                </Fab>
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      {/* Submit Button */}
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
    </AppBarPage>
  );
};

export default AddCustomers;
