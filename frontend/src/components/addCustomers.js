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
  const [coolersWithQuantityList,setCoolersWithQuantityList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editedQuantity, setEditedQuantity] = useState(0);
  const [editedAmount, setEditedAmount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [error,setError] = useState('');
  const [dataSaved,setDataSaved] = useState(false);


  
  const navigate = useNavigate();

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#66a3ff',
      color: theme.palette.common.white,
      fontSize: 18,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const handleInputChange = async (e, name, value) => {
    // console.log("Called");

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
      console.log(value);
      fetchAddessDetails(value);
    }
  };
  
  const fetchModelDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/allModelNames`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Server error");
      }
      // console.log(response.json());
      const availableCoolersList = await response.json();
      setCoolersWithQuantityList(availableCoolersList);
      const modelNames = availableCoolersList.map((availableCooler) => availableCooler.model_name);
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
      const customerNamesList = [...customerNames];
      setCustomerNameSuggestions(customerNamesList);
    } catch (error) {
      console.error("Error fetching model details:", error);
    }
  };

  const isDueCheck = async() =>{
    try {
      const response = await fetch(`http://localhost:5000/api/get_amountDetails?name=${formData.customer_name}`);
      if (response.status === 200) {
        const amountDetails = await response.json();
        console.log(amountDetails.remaining);
        setDueAmount(amountDetails.remaining);
      } else {
        console.error('Failed to add coolers:', response.statusText);
        setError('Failed to add coolers');
      }
    } catch (error) {
      console.error('Error adding coolers:', error);
      setError('Error adding coolers');
    }
  };
  
  useEffect(() => {
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
    setFormDataList((prevList) =>{
      const updatedList = [...prevList];
      const editedItem = updatedList[editIndex];
      editedItem.quantity = parseFloat(editedQuantity);
      editedItem.amount = parseFloat(editedAmount);
      editedItem.total_amount = editedItem.amount * editedItem.quantity;
      return updatedList;
    });
    setEditIndex(null);
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
      else{
        setFormData((prevData) => ({
          ...prevData,
          shop_address: " ",
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
    return false;
  }
  return true;
  }

  const handleAddDetails = async (e) => {
    e.preventDefault();
    const model = formData.model_name;
    const quantityObject = coolersWithQuantityList.find((res) => res.model_name === model);
    const quantity = quantityObject ? quantityObject.quantity : null;
    // const quantity = coolersWithQuantityList.filter((res) => res.model_name === model).map((res) => res.quantity);
    if(formData.quantity > quantity){
      window.alert(`Available Quanitty of ${model} is ${quantity}`);
    }
    else{
      if (validateFields()) {
        isDueCheck();
        setFormData({
          customer_name: formData.customer_name,
          shop_address: formData.shop_address,
          model_name: "",
          amount: "",
          quantity: "",
          vehicle_number: formData.vehicle_number,
          date: formData.date,
          total_amount: "",
        });
        setFormDataList((prevList) => [...prevList, formData]);
        setAdditionalDetailsList([...additionalDetailsList, { ...additionalDetails }]);
      }
    }
    
  };

  const handleSubmit = async () => {

    if (formDataList.length!==0) {
      try {
        console.log(formDataList);
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
          setDataSaved(true);
        }
      } catch (error) {
        console.error("Error:", error);
        window.alert("Quantity is more than available");
      }
    }
    else{
      window.alert("please click on add Details button");
    }
  };

  const handlePrintReceipt = () =>{
    if(!dataSaved){
      handleSubmit();
    }
    handleClose();
    return navigate("/billingPage" ,{ state: { formData, additionalDetailsList,dueAmount } });
  }

  const handleOpen = () => {
    if(formDataList.length!==0 ){
      setOpen(true);
    }
    else{
      window.alert("please fill all the details");
    }
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
    setFormDataList((prevList) =>{
      const updatedList = [...prevList];
      updatedList.splice(index, 1);
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
    <AppBarPage>

    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Print Receipt</DialogTitle>
      <DialogActions>
          <Button onClick={handlePrintReceipt} autoFocus>
            Yes
          </Button>
          <Button onClick={handleClose}>No</Button>
        </DialogActions>
    </Dialog>
    <div style={{display:"flex", justifyContent: "space-between", marginTop: '20px'}}>
      <h3>Add Customer Details</h3>
      <Button
        sx={{
          backgroundColor: '#1a75ff',
          color: '#fff',
          paddingX: '30px', // Adjust the horizontal padding
          height: '30px',   // Adjust the height
          '&:hover': {
            backgroundColor: '#0066ff',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          },
        }}
        type="Reset"
        onClick={handleRest}
      >
        Reset
      </Button>

    </div>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td>
                <label>Customer Name:</label>
                <Autocomplete
                  value={formData.customer_name}
                  onChange={(e, value) => handleInputChange(e, "customer_name",value)}
                  onInputChange={(e, newInputValue) => handleInputChange(e, "customer_name", newInputValue)}
                  options={customerNameSuggestions}
                  freeSolo
                  renderInput={(params) => <TextField {...params}  style={{ width: '200px' }} />}
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
                  type="number"
                  name="total_amount"
                  value={formData.total_amount}
                  readOnly
                />
              </td>
              <td style={{ paddingLeft: '100px' }}>
                <Fab size="small" color="primary" aria-label="add" onClick={handleAddDetails}>
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
