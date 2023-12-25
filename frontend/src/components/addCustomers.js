import React, { useEffect, useState } from "react";
import AppBarPage from "./appBarPage";
import "./addCustomers.css"; // Import your CSS file
import { Autocomplete, Button, Dialog, DialogActions, DialogTitle, Fab, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField, tableCellClasses } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import { styled } from '@mui/material/styles';

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
    total_amount: "",
  });
  const [additionalDetails, setAdditionalDetails] = useState({
    model_name: "",
    amount: "",
    quantity: "",
    total_amount: "",
  });

  const [additionalDetailsList, setAdditionalDetailsList] = useState([]);
  const [modelNameSuggestions, setModelNameSuggestions] = useState([]);
  const [customerNameSuggestions, setCustomerNameSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editedQuantity, setEditedQuantity] = useState('');
  const [editedAmount, setEditedAmount] = useState('');
  
  const navigate = useNavigate();

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      fontSize: 18,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  useEffect(() => {
    const fetchModelDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/allModelNames`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Server error");
        }
        const modelNames = await response.json();
        console.log(modelNames);
        setModelNameSuggestions(modelNames);
      } catch (error) {
        console.error("Error fetching model details:", error);
      }
      
    };
    const fetchCustomerNames = async()=>{
      try{
        const response = await fetch(`http://localhost:5000/api/customerDetails`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Server error");
        }
        const customerDetails = await response.json();
        const customerNames = new Set(customerDetails.map((customer) => customer.customer_name));
        setCustomerNameSuggestions(customerNames);
      } catch (error) {
        console.error("Error fetching model details:", error);
      }
    };
    fetchCustomerNames();
    fetchModelDetails();
  }, []);

  

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedQuantity(additionalDetailsList[index].quantity.toString());
    setEditedAmount(additionalDetailsList[index].amount.toString())
  };

  const handleSaveEdit = () => {
    setAdditionalDetailsList((prevList) => {
      const updatedList = [...prevList];
      const editedItem = updatedList[editIndex];
      editedItem.quantity = parseFloat(editedQuantity);
      editedItem.amount = parseFloat(editedAmount);
      editedItem.total_amount = editedItem.amount * editedItem.quantity;
      return updatedList;
    });
    setEditIndex(null);
  };
  
  const handleInputChange = async (e, name, value) => {

    if (name === "model_name" || name === "amount" || name === "quantity" || name === "total_amount")
    setAdditionalDetails((prevData) =>{
      const newData ={
        ...prevData,
        [name]:value,
      }
      // Update total amount based on the latest quantity and amount
      if (name === "quantity" || name === "amount") {
        newData.total_amount = newData.quantity * newData.amount;
      }
      return newData;
    })
    // Update total amount when quantity or amount changes
    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [name]: value,
      };
  
      // Update total amount based on the latest quantity and amount
      if (name === "quantity" || name === "amount") {
        newData.total_amount = newData.quantity * newData.amount;
      }
  
      return newData;
    });
  
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

  const handleSubmit = async () => {

    if ((additionalDetails.length!==0) || validateFields()) {
      try {
        // console.log(formDataList);
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
        }
        else{
          window.alert("Successfully saved");
        }
      } catch (error) {
        console.error("Error:", error);
        window.alert("Error");
      }
    }
  };

  const handlePrintReceipt = () =>{
    handleClose();
    return navigate("/billingPage" ,{ state: { formData, additionalDetailsList } });
  }

  const handleOpen = () => {
    if((additionalDetails.length!==0) || validateFields() ){
      setOpen(true);
    };
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (index) => {
    setAdditionalDetailsList((prevList) => {
      const updatedList = [...prevList];
      updatedList.splice(index, 1); // Remove the item at the specified index
      return updatedList;
    });
  };

  const handleRest = () =>{
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
    setAdditionalDetailsList([]);
    setFormDataList([]);
  }

  return (

      <AppBarPage className="add-customers-container">
        <h2>Add Customer Details</h2>
        <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
            <td>
                <label>Customer Name:</label>
                <Autocomplete
                  value={formData.customer_name}
                  onChange={(e, value) => handleInputChange(e, "customer_name",value)}
                  options={customerNameSuggestions}
                  renderInput={(params) => <TextField {...params} />}
                />
              </td>
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
                <label>Total Amount:</label>
                <input
                  type="text"
                  name="total_amount"
                  value={formData.total_amount}
                  readOnly
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

    <Grid container spacing={2}>
      <Grid item xs={9}>
      <h3>Additional Details</h3>
      <form>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Model Name:</StyledTableCell>
              <StyledTableCell align="center">Amount:</StyledTableCell>
              <StyledTableCell align="center">Quantity:</StyledTableCell>
              <StyledTableCell align="center">Total Amount:</StyledTableCell>
              <StyledTableCell align="center"></StyledTableCell>
              <StyledTableCell align="center"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {additionalDetailsList.map((detail, index) => (
              <TableRow key={index}>
                <td align="center">{detail.model_name}</td>
                <td align="center">
                  {editIndex === index ? (
                    <input
                      type="number"
                      value={editedAmount}
                      onChange={(e) => setEditedAmount(e.target.value)}
                      style={{ width: '100px' }}
                    />
                  ) : (
                    <span>{detail.amount}</span>
                  )}
                </td>
                <td align="center">
                {editIndex === index ? (
                  <>
                    <input
                      type="number"
                      value={editedQuantity}
                      onChange={(e) => setEditedQuantity(e.target.value)}
                      style={{ width: '100px' }}
                    />
                  </>
                ) : (
                  <span>{detail.quantity}</span>
                )}
              </td>
              <td align="center">{detail.total_amount}</td>
              <td align="center">
                {editIndex !== index ? (
                  <EditIcon onClick={() => handleEdit(index)} />
                ):<DoneIcon onClick={handleSaveEdit}>Save</DoneIcon>}
              </td>
              <td style={{ paddingLeft: '50px' }}>
                <DeleteIcon onClick={() => handleDelete(index)} />
              </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </form>
      </Grid>
      <Grid item xs={3}/>
    </Grid>
      <div style={{display:"flex", justifyContent: "space-between", marginTop: '20px'}}>
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
        onClick={handleOpen}
      >
        Print Receipt
      </Button>
      </div>
    </AppBarPage>
  );
};

export default AddCustomers;
