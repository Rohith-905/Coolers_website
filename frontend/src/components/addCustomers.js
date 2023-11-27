import React, { useState } from "react";
import AppBarPage from "./appBarPage";
import "./addCustomers.css"; // Import your CSS file

const AddCustomers = () => {
  const [formData, setFormData] = useState({
    custName: "",
    address: "",
    modelName: "",
    amount: "",
    quantity: "",
    vehicleNo: "",
    date: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle the form submission, e.g., send data to the server
    try {
      console.log(JSON.stringify(formData));
      // Make a POST request to your backend API endpoint
      const response = await fetch("http://localhost:5000/api/add-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log("Data successfully stored in the database!");
      } else {
        console.error("Failed to store data in the database");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    console.log("Form submitted with data:", formData);
    // Clear the form after submission
    setFormData({
      custName: "",
      address: "",
      modelName: "",
      amount: "",
      quantity: "",
      vehicleNo: "",
      date: "",
    });
  };

  return (
    <div className="add-customers-container">
      <AppBarPage>
        <h2>Add Customer Details</h2>
        <form onSubmit={handleSubmit}>
        <table>
            <tbody>
              <tr>
                <td>
                  <label>Customer Name:</label>
                </td>
                <td>
                  <input
                    type="text"
                    name="custName"
                    value={formData.custName}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Address:</label>
                </td>
                <td>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Model Name:</label>
                </td>
                <td>
                  <input
                    type="text"
                    name="modelName"
                    value={formData.modelName}
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
                     type="text"
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
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Vehicle Number:</label>
                </td>
                <td>
                  <input
                    type="text"
                    name="vehicleNo"
                    value={formData.vehicleNo}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Date :</label>
                </td>
                <td>
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button type="submit">Submit</button>
        </form>
      </AppBarPage>
    </div>
  );
};

export default AddCustomers;
