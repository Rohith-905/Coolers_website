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
import Switch from '@mui/material/Switch';

const AddCustomers = () => {

  const [formData, setFormData] = useState({
    customer_name: "",
    shop_address: "",
    vehicle_number: "",
    date: "",
  });
  const [additionalDetails, setAdditionalDetails] = useState({
    model_name: "",
    amount: "",
    quantity: "",
    total_amount: "",
  });

  const [customerDetails, setCustomerDetails] = useState();
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
  const [purchased, setPurchased] = useState(true);
  
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

  const handleChange = (event) => {
    setPurchased(event.target.checked);
  };
  
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
    else{
      setFormData((prevData) => {
        const newData = {
          ...prevData,
          [name]: value,
        };
        return newData;
    });
    };
    if (name === 'customer_name') {
      const selectedCustomer = customerDetails.find((customer) => customer.customer_name === value);
  
      if (selectedCustomer) {
        // If customer is found, set the address
        setFormData((prevData) => ({
          ...prevData,
          shop_address: selectedCustomer.shop_address,
        }));
      } else {
        // If customer is not found, set an empty address
        setFormData((prevData) => ({
          ...prevData,
          shop_address: '',
        }));
      }
    }
  
  };
  
  const fetchModelDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/coolers_available`);
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
      setCustomerDetails(customerDetails);
      const customerNames = new Set(customerDetails.map((customer) => customer.customer_name));
      const customerNamesList = [...customerNames];
      // console.log(customerNamesList);
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
        // console.log(amountDetails.amount);
        setDueAmount(amountDetails.amount);
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
    const editedItem = additionalDetailsList[editIndex];
  
    const availableQuantity = coolersWithQuantityList.find(cooler => cooler.model_name === editedItem.model_name)?.quantity;
    
    if (parseFloat(editedQuantity) > availableQuantity) {
      window.alert(`Available quantity of ${editedItem.model_name} is ${availableQuantity}`);
      return;
    }
  
    setAdditionalDetailsList(prevList => {
      const updatedList = [...prevList];
      updatedList[editIndex].quantity = parseFloat(editedQuantity);
      updatedList[editIndex].amount = parseFloat(editedAmount);
      updatedList[editIndex].total_amount = editedItem.amount * editedItem.quantity;
      return updatedList;
    });
    setEditIndex(null);
  };
  
  const validateFields = () =>{
  // Validate form fields
  const fieldsToValidate = ['customer_name', 'shop_address', 'vehicle_number', 'date', 'model_name', 'amount', 'quantity'];
  const isFormValid = fieldsToValidate.every(field => (additionalDetails[field] || formData[field]));

  if (!isFormValid) {
    // Display an error message or perform any other action
    alert('Please fill in all fields before submitting.');
    return false;
  }
  return true;
  }

  const handleAddDetails = async (e) => {
    e.preventDefault();
    const model = additionalDetails.model_name;
    const quantityObject = coolersWithQuantityList.find((res) => res.model_name === model);
    const quantity = quantityObject ? quantityObject.quantity : null;
    // console.log(additionalDetails);
    // const quantity = coolersWithQuantityList.filter((res) => res.model_name === model).map((res) => res.quantity);
    if(!purchased && additionalDetails.quantity > quantity){
      window.alert(`Available Quantity of ${model} is ${quantity}`);
    }
    else{
      if (validateFields()) {
        isDueCheck();
        setAdditionalDetails({
          model_name: "",
          amount: "",
          quantity: "",
          total_amount: "",
        });
        setAdditionalDetailsList([...additionalDetailsList, { ...additionalDetails }]);
      }
    }
    
  };

  // const handleSubmit = async () => {

  //   if (formDataList.length!==0) {
  //     try {
  //       console.log(formDataList);
  //       const response = await fetch("http://localhost:5000/api/add-customer", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(formDataList),
  //       });

  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         throw new Error(errorData.message || "Server error");
  //       }
  //       else{
  //         window.alert("Successfully saved");
  //         setDataSaved(true);
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //       window.alert("Quantity is more than available");
  //     }
  //   }
  //   else{
  //     window.alert("please click on add Details button");
  //   }
  // };

  const handlePrintReceipt = () =>{
    handleClose();
    return navigate("/billingPage" ,{ state: { formData, additionalDetailsList,dueAmount, purchased } });
  }

  const handleOpen = () => {
    if(additionalDetailsList.length!==0 ){
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
  };

  const handleRest = () =>{
    setFormData({
      customer_name: "",
      shop_address: "",
      vehicle_number: "",
      date: "",
    });
    setAdditionalDetailsList([]);
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
    <div style={{display:"flex", justifyContent: "space-between",alignItems:'center'}}>
      <Switch checked={purchased}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'controlled' }}
      />
      <h3>{purchased ?  'Add Purchase Details' : 'Add Customer Details' }</h3>
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
      <form>
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
                  value={additionalDetails.model_name}
                  onChange={(e, value) => handleInputChange(e, "model_name",value)}
                  onInputChange={(e, newInputValue) => handleInputChange(e, "model_name", newInputValue)}
                  options={modelNameSuggestions}
                  {...(purchased ? { freeSolo: true } : {})}
                  renderInput={(params) => <TextField {...params} />}
                />
              </td>
              <td style={{ paddingLeft: '100px' }}>
                <label>Amount:</label>
                <input
                  type="number"
                  name="amount"
                  value={additionalDetails.amount}
                  onChange={(e) => handleInputChange(e, e.target.name, e.target.value)}
                  required
                />
              </td>
              <td style={{ paddingLeft: '100px' }}>
                <label>Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  value={additionalDetails.quantity}
                  onChange={(e) => handleInputChange(e, e.target.name, e.target.value)}
                  required
                />
              </td>
              <td style={{ paddingLeft: '100px' }}>
                <label>Total Amount:</label>
                <input
                  type="number"
                  name="total_amount"
                  value={additionalDetails.total_amount}
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
      {/* <Button
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
      </Button> */}

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
