import React, { useState } from "react";
import AppBarPage from "./appBarPage";
import "./addCustomers.css"; // Import your CSS file
import { Button, Fab } from "@mui/material";
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

  const validateFeilds = () =>{
    // Validate form fields
    const fieldsToValidate = ['customer_name', 'shop_address', 'vehicle_number', 'date', 'model_name', 'amount', 'quantity'];
    const isFormValid = fieldsToValidate.every(field => formData[field]);

    if (!isFormValid) {
      // Display an error message or perform any other action
      alert('Please fill in all fields before submitting.');
      return 0;
    }
    return 1;
  }
  const handleAddDetails =  async (e) => {
    e.preventDefault();

    let bool = validateFeilds();

    if(bool){
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
        // console.log("in add details",formData);
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
    }
    
  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let bool = validateFeilds();
    if(bool){
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
    }
  };
  
  
  return (
    <AppBarPage>
      <h2>Add Customer Details</h2>
      {/* Main Customer and Address Details */}
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
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

              <td style={{paddingLeft: '100px' }}>
                <label>Address:</label>
                <input
                  type="text"
                  name="shop_address"
                  value={formData.shop_address}
                  onChange={handleInputChange}
                  required
                />
              </td>
            
              <td style={{paddingLeft: '100px' }}>
                <label>Vehicle Number:</label>
                <input
                  type="text"
                  name="vehicle_number"
                  value={formData.vehicle_number}
                  onChange={handleInputChange}
                  required
                />
              </td>

              <td style={{paddingLeft: '100px' }}>
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
            <tr>
              <td>
                <label>Model Name:</label>
                <input
                  type="text"
                  name="model_name"
                  value={formData.model_name}
                  onChange={handleInputChange}
                  required
                />
              </td>
              <td style={{paddingLeft: '100px' }}>
                <label>Amount:</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </td>
              <td style={{paddingLeft: '100px' }}>
                <label>Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                />
              </td>
              <td style={{paddingLeft: '100px' }}> 
                <Fab color="primary" aria-label="add" onClick={handleAddDetails}>
                  <AddIcon />
                </Fab>
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
                <td>Model Name:</td>
                <td style={{paddingLeft: '100px' }}>Amount:</td>
                <td style={{paddingLeft: '100px' }}>Quantity:</td>
              </tr>
            {additionalDetails.map((detail, index) => (
              <tr key={index}>
                <td >{detail.model_name}</td>
                <td style={{paddingLeft: '100px' }}>{detail.amount}</td>
                <td style={{paddingLeft: '100px' }}>{detail.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>

      {/* Form for Incrementing Details
      <h3>Increment Details</h3>
      <form>
        <table>
          <tbody>
            <tr>
              <td>
                <label>Model Name:</label>
                <input
                  type="text"
                  name="model_name"
                  value={formData.model_name}
                  onChange={handleInputChange}
                  required
                />
              </td>
              <td style={{paddingLeft: '100px' }}>
                <label>Amount:</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </td>
              <td style={{paddingLeft: '100px' }}>
                <label>Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                />
              </td>
              <td style={{paddingLeft: '100px' }}> 
                <Fab color="primary" aria-label="add" onClick={handleAddDetails}>
                  <AddIcon />
                </Fab>
              </td>
            </tr>
          </tbody>
        </table>
      </form> */}

      {/* Submit Button */}
      <Button sx={{ backgroundColor: '#1a75ff',color: '#fff',
                '&:hover': {
                  backgroundColor: '#0066ff', // Keep the same color on hover
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Add shadow on hover
                },}}  type="submit" onClick={handleSubmit}>
        Submit
      </Button>
    </AppBarPage>
  );
};

export default AddCustomers;
