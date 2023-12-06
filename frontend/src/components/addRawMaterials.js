import React, { useState } from "react";
import AppBarPage from "./appBarPage";

const AddRawMaterials = () => {
    const [formData, setFormData] = useState({
        Material_name: "",
        quantity: "",
    
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
    
      try {
        console.log(JSON.stringify(formData));
        const response = await fetch("http://localhost:5000/api/add-rawmaterial", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData)
        });
  
        if (response.status===200) {
          window.alert("Data successfully stored in the database!");
          console.log("Data successfully stored in the database!");
        } else if(response.status===500) {
          window.alert("Failed to store data in the database");
          console.error("Failed to store data in the database");
        }
      } catch (error) {
        window.alert("Error");
        console.error("Error:", error);
      }
  
      console.log("Form submitted with data:", formData);
      // Clear the form after submission
      setFormData({
        Material_name: "",
        quantity: "",
       
      });
    };

    return (
        <AppBarPage >
          <div className="AddCustomer">
          <h2>Add Raw Materials</h2>
          <form onSubmit={handleSubmit}>
          <table>
              <tbody>
                <tr>
                  <td>
                    <label>Material Name:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      name="Material_name"
                      value={formData.Materialname}
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
              </tbody>
          </table>
          <button className="glow-on-hover"  type="submit">Submit</button>
        </form>
        </div>
      </AppBarPage>
  );


};

export default AddRawMaterials;