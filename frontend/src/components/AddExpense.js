import React , {useState, useEffect} from "react";
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom'
import API_URL from "../api.js";


const AddExpense = () =>{
    const navigate=useNavigate()
    const [formData,setformData]=useState({
        ExpenseDate:'',
        ExpenseItem:'',
        ExpenseCost:'',
    })


    const userId=localStorage.getItem('userId')
    useEffect(()=>{
        if(!userId){
            navigate('/login')
        }
    },[userId, navigate])

    const handleChange=(e)=>{
        setformData({...formData,[e.target.name]:e.target.value});

    };

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try {
            const response=await fetch(`${API_URL}/api/add_expense/`,{
                method:'POST',
                headers:{'Content-Type' : 'application/json'},
                body:JSON.stringify({
                    ...formData,
                    UserId:userId

                })
            });
            const data=await response.json();
            if(response.status === 201){
                toast.success(data.message)
                setTimeout(()=>{
                    navigate('/dashboard');
                },1000);
            }
            else{
                toast.error(data.message)
            }
        } 
        catch (error) {
            console.error('Error:',error);
            toast.error('Something went wrong. Try again.')
            
        }
    }
    return(
        <div className="container mt-5">
            <div className="text-center mb-4">
                <h2> <i className="fas fa-plus-circle me-2"></i>Add Expense</h2>
                <p className="text-muted">Track your Expenditure</p>
            </div>

            <form className="p-4 rounded shadow mx-auto" style={{maxWidth:'400px'}}  onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Expense Date</label>
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fas fa-calendar-alt"></i>
                        </span>
                        <input type="date" name="ExpenseDate" className="form-control" value={formData.ExpenseDate} onChange={handleChange} required ></input>
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Expense Item</label>
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fas fa-envelope"></i>
                        </span>
                        <input type="text" name="ExpenseItem" className="form-control" value={formData.ExpenseItem} onChange={handleChange} required placeholder="Enter your expenses (e.g. Groceries,books,)"></input>
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Expense Cost</label>
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fas fa-inr"></i>
                        </span>
                        <input type="number" name="ExpenseCost" className="form-control" value={formData.ExpenseCost} onChange={handleChange} required placeholder="Enter amount (₹)"></input>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-3" > <i className="fas fa-plus-circle me-2"></i>Add Expense</button>
            </form>
            <ToastContainer/>
        </div>
    )
}
export default AddExpense;