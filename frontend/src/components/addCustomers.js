import React, { useEffect, useState } from "react";
import AppBarPage from "./appBarPage";
import "./addCustomers.css"; // Import your CSS file
import { Autocomplete, Button, Fab, TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";

const AddCustomers = () => {

  const [formDataList, setFormDataList] = useState([]);
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
  const [modelNameSuggestions, setModelNameSuggestions] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModelDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/allModelNames`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Server error");
        }
        const modelNames = await response.json();
        setModelNameSuggestions(modelNames);
      } catch (error) {
        console.error("Error fetching model details:", error);
      }
    };

    fetchModelDetails();
  }, []);
  
  const handleInputChange = async (e,name,value) => {

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Fetch customer details if the input field is 'customer_name'
    if (name === 'customer_name') {
      fetchAddessDetails(value);
    }
  };

  const fetchAddessDetails = async (customerName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/customerAddress?name=${customerName}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Server error");
      }

      const customerDetails = await response.json();
      if (customerDetails.length > 0) {
        setFormData((prevData) => ({
          ...prevData,
          shop_address: customerDetails[0].shop_address,
        }));
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

   const validateFields = () =>{
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

  const handleAddDetails = async (e) => {
    e.preventDefault();

    if (validateFields()) {
      setFormData({
        customer_name: formData.customer_name,
        shop_address: formData.shop_address,
        model_name: "",
        amount: "",
        quantity: "",
        vehicle_number: formData.vehicle_number,
        date: formData.date,
      });
      setFormDataList((prevList) => [...prevList, formData]);
      setAdditionalDetails([...additionalDetails, { ...formData }]);
      // try {
      //   const response = await fetch("http://localhost:5000/api/add-customer", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       customer_name: formData.customer_name.toLowerCase().trim(),
      //       shop_address: formData.shop_address,
      //       model_name: formData.model_name,
      //       amount: formData.amount,
      //       quantity: formData.quantity,
      //       vehicle_number: formData.vehicle_number,
      //       date: formData.date,
      //       total_amount: formData.amount * formData.quantity,
      //     }),
      //   });

      //   if (!response.ok) {
      //     const errorData = await response.json();
      //     throw new Error(errorData.message || "Server error");
      //   } else {
      //     setAdditionalDetails([...additionalDetails, { ...formData }]);
      //   }
      // } catch (error) {
      //   console.error("Error:", error);
      //   window.alert("Error");
      // }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
        const response = await fetch("http://localhost:5000/api/add-customer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataList),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Server error");
        } else {
          setAdditionalDetails([...additionalDetails, { ...formData }]);
        }
      } catch (error) {
        console.error("Error:", error);
        window.alert("Error");
      }

      setFormData({
        customer_name: "",
        shop_address: "",
        model_name: "",
        amount: "",
        quantity: "",
        vehicle_number: "",
        date: "",
        total_amount: "",
      });
      setAdditionalDetails([]);
  };

  const handlePrintReceipt = () =>{
    return navigate("/billingPage" ,{ state: { formData, additionalDetails } });
  }
  return (
    <AppBarPage>
      <h2>Add Customer Details</h2>
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
                  onChange={(e) => handleInputChange(e, e.target.name, e.target.value)}
                  required
                />
              </td>
              <td style={{ paddingLeft: '100px' }}>
                <label>Address:</label>
                <input
                  type="text"
                  name="shop_address"
                  value={formData.shop_address}
                  onChange={(e) => handleInputChange(e, e.target.name, e.target.value)}
                  required
                />
              </td>
              <td style={{ paddingLeft: '100px' }}>
                <label>Vehicle Number:</label>
                <input
                  type="text"
                  name="vehicle_number"
                  value={formData.vehicle_number}
                  onChange={(e) => handleInputChange(e, e.target.name, e.target.value)}
                  required
                />
              </td>
              <td style={{ paddingLeft: '100px' }}>
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange(e, e.target.name, e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Model Name:</label>
                <Autocomplete
                  value={formData.model_name}
                  onChange={(e, value) => handleInputChange(e, "model_name",value)}
                  options={modelNameSuggestions}
                  renderInput={(params) => <TextField {...params} />}
                />
              </td>
              <td style={{ paddingLeft: '100px' }}>
                <label>Amount:</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={(e) => handleInputChange(e, e.target.name, e.target.value)}
                  required
                />
              </td>
              <td style={{ paddingLeft: '100px' }}>
                <label>Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange(e, e.target.name, e.target.value)}
                  required
                />
              </td>
              <td style={{ paddingLeft: '100px' }}>
                <Fab color="primary" aria-label="add" onClick={handleAddDetails}>
                  <AddIcon />
                </Fab>
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      <h3>Additional Details</h3>
      <form>
        <table>
          <tbody>
            <tr>
              <td>Model Name:</td>
              <td style={{ paddingLeft: '100px' }}>Amount:</td>
              <td style={{ paddingLeft: '100px' }}>Quantity:</td>
            </tr>
            {additionalDetails.map((detail, index) => (
              <tr key={index}>
                <td >{detail.model_name}</td>
                <td style={{ paddingLeft: '100px' }}>{detail.amount}</td>
                <td style={{ paddingLeft: '100px' }}>{detail.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>

      <Button
        sx={{
          backgroundColor: '#1a75ff',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#0066ff',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          },
        }}
        type="submit" onClick={handleSubmit}>
        Submit
      </Button>

      <Button
        sx={{
          backgroundColor: '#1a75ff',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#0066ff',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          },
        }}
        onClick={handlePrintReceipt}
      >
        Print Receipt
      </Button>

    </AppBarPage>
  );
};

export default AddCustomers;
