import { styled } from '@mui/material/styles';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, tableCellClasses } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";


const SoldCoolerInfo = ({model_name,setViewSoldCoolersInfo})=>{

    // const [customerDetailsList,setCustomerDetailsList] = useState([]);
    // const [vendorDetailsList,setVendorDetailsList] = useState([]);
    let customerDetailsList=[];
    let vendorDetailsList = [];
    const [finalList,setFinalList] = useState([]);
    const [soldCount,setSoldCount] = useState(0);
    const [boughtCount,setBoughtCount] = useState(0);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
          fontSize: 18,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 16,
          },
      }));
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
        }));

    const fetchCoolersDetails = async() =>{
        try {
            const customerResponse = await axios.get(`http://localhost:5000/api/customerDetails`);
            customerDetailsList = customerResponse.data; 
    
            const vendorResponse = await axios.get(`http://localhost:5000/api/vendorDetails`);
            vendorDetailsList = vendorResponse.data;
    
            // Call filterDetails after fetching all the details
            filterDetails();
        } catch (error) {
            console.error('Error fetching coolers details:', error);
        }
    }
    
    const filterDetails = () => {
        let tempFinalList = [];
        let tempSoldCount = 0;
        let tempBoughtCount = 0;

        for (let customerDetails = 0; customerDetails < customerDetailsList.length; customerDetails++) {
            const additionalDetails = JSON.parse(customerDetailsList[customerDetails].additional_details_json);
            const filteredDetails = additionalDetails.filter((additionalDetail) => additionalDetail.model_name === model_name);
            
            if(filteredDetails.length>0){
                tempFinalList.push({customer_name:customerDetailsList[customerDetails].customer_name,date:customerDetailsList[customerDetails].date,quantity:filteredDetails[0].quantity,color:'red',model_name:filteredDetails[0].model_name});
            }
        }

        for (let vendorDetails = 0; vendorDetails < vendorDetailsList.length; vendorDetails++) {
            const additionalDetails = JSON.parse(vendorDetailsList[vendorDetails].additional_details_json);
            const filteredDetails = additionalDetails.filter((additionalDetail) => additionalDetail.model_name === model_name);

            if(filteredDetails.length>0){
                tempFinalList.push({customer_name:vendorDetailsList[vendorDetails].customer_name,date:vendorDetailsList[vendorDetails].date,quantity:filteredDetails[0].quantity,color:'green',model_name:filteredDetails[0].model_name});
            }
        }
        
        tempFinalList.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            
            return dateA - dateB;
        });
        setFinalList(tempFinalList);
        for(let finalList of tempFinalList){
            if(finalList.color === 'red')
                tempSoldCount+=parseInt(finalList.quantity);
            else 
                tempBoughtCount+=parseInt(finalList.quantity);
        }
        setSoldCount(tempSoldCount);
        setBoughtCount(tempBoughtCount);
    }
    
    useEffect(() => {
        fetchCoolersDetails();
    }, []);
    

    const handleBack = () =>{
        setViewSoldCoolersInfo(false)
    }
    return(
        <>
        <Button
        sx={{
            backgroundColor: '#1a75ff',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#0066ff',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            },
          }} 
        onClick={()=>handleBack()}>Back</Button>
        <div>
        <p>Model Name: {model_name}</p>
    <p>Total Sold: {soldCount}</p>
    <p>Total Bought: {boughtCount}</p>
            {finalList.length > 0 ? (
                <div>
                <Table>
                    <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">Name</StyledTableCell>
                        <StyledTableCell align="center">Date</StyledTableCell>
                        <StyledTableCell align="center">Quantity</StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {finalList.map((customer,index) => (
                        <StyledTableRow key={index} >
                        <StyledTableCell align="center" style={{color:customer.color}}>{customer.customer_name}</StyledTableCell>
                        <StyledTableCell align="center" style={{color:customer.color}}>{customer.date}</StyledTableCell>
                        <StyledTableCell align="center" style={{color:customer.color}}>{customer.quantity}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                    </TableBody>
                </Table>
                </div>
            ) : (
                <p>No Information available</p>
            )}
        </div>

        </>
    )
}
export default SoldCoolerInfo;