import React , {useState, useEffect} from "react";
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom'
import API_URL from "../api";


const ExpenseReport = () => {

    const navigate=useNavigate()

    const[fromDate,setFromDate]=useState('');
    const[toDate,setToDate]=useState('');
    const[expenses,setExpenses]=useState([]);
    const[grandTotal,setGrandTotal]=useState([]);

    const userId=localStorage.getItem('userId')
    useEffect(()=>{
        if(!userId){
            navigate('/login')
        }
    },[userId, navigate])

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const response=await fetch(`${API_URL}/api/search_expense/${userId}/?from=${fromDate}&to=${toDate}`)
            const data=await response.json()
            setExpenses(data.expenses)
            setGrandTotal(data.grandTotal)
            console.log("From:", fromDate);
            console.log("To:", toDate);

        }
        catch(error){
            console.log('error fetching expenses',error)
            toast.error('Something went wrong!')

        }
    }

    

  return (
     <div className="container mt-5">
            <div className="text-center mb-4">
                <h2> <i className="fas fa-file-invoice-dollar me-2"></i>Expense Report</h2>
                <p className="text-muted">Search and Analyze your expenditure</p>
            </div>

            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-4">
                    {/* <label className="form-label">From Date</label> */}
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fas fa-calendar-alt"></i>
                        </span>
                        <input type="date" name="FromDate" className="form-control" value={fromDate} onChange={(e)=>setFromDate(e.target.value)} required ></input>
                    </div>
                </div>

                <div className="col-md-4">
                    {/* <label className="form-label">To Date</label> */}
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fas fa-calendar-alt"></i>
                        </span>
                        <input type="date" name="ToDate" className="form-control" value={toDate} onChange={(e)=>setToDate(e.target.value)} required ></input>
                    </div>
                </div>
                <div className='col-md-4'>

                    <button type="submit" className="btn btn-primary w-100" > <i className="fas fa-search me-2"></i>Search
                    </button>

                </div>
            </form>

            <div className="mt-5">
                <table className="table  table-striped table-bordered">
                    <thead className="table-dark text-center">
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Date</th>
                        <th scope="col">Item</th>
                        <th scope="col">Cost (₹)</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {expenses.length > 0 ? (
                           expenses.map((exp,index) =>(
                            <tr>
                                <th scope="row">{index+1}</th>
                                <td>{exp.ExpenseDate}</td>
                                <td>{exp.ExpenseItem}</td>
                                <td>{exp.ExpenseCost}</td>
                                
                            </tr>
                           ))

                        ):(
                            <tr> 
                                <td colSpan="5" className="text-center text-muted">
                                <i className="fas fa-exclamation-circle me-3"></i>
                                No expenses found</td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot className="table-secondary">
                        <tr >
                            <td colSpan='3' className="text-end fw-bold">Grand Total:</td>
                            <td className="fw-bold text-success">₹ {grandTotal}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>




            <ToastContainer/>
        </div>
  )
}

export default ExpenseReport
