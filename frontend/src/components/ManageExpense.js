import React , {useState, useEffect} from "react";
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom'
import API_URL from "../api";


const ManageExpense = () => {
    const navigate=useNavigate()
    const[expenses,setExpenses]=useState([])

    const userId=localStorage.getItem('userId')
    useEffect(()=>{
        if(!userId){
            navigate('/login')
        }
        fetchExpenses(userId);
    },[userId, navigate])

    const [editExpense,setEditExpense]=useState(null);

    const handleEdit = (expense) => {
        setEditExpense(expense)
    }
    const handleChange=(e)=>{
        setEditExpense({...editExpense,[e.target.name]: e.target.value});
    }
    const handleClose=()=>{
        setEditExpense(null)
    }
    const fetchExpenses=async(userId)=>{
        try{
            const response= await fetch(`${API_URL}/api/manage_expense/${userId}`);
            const data = await response.json();
            setExpenses(data);
        }
        catch(error){
            console.log('Something went wrong',error);
        }
    }
    const handleUpdate=async()=>{
        try{
            const response= await fetch(`${API_URL}/api/update_expense/${editExpense.id}/`,{
                method:'PUT',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(editExpense)
            });
            const data=await response.json();
                if(response.status === 201){
                    toast.success(data.message)
                    fetchExpenses(userId)
                    setEditExpense(null)
                    
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

    const handleDelete=async(expenseId)=>{
        if(window.confirm("Are you sure you want to delete this expense?")) {   
            try{
                const response= await fetch(`${API_URL}/api/delete_expense/${expenseId}/`,{
                    method:'DELETE',
                });
                const data=await response.json();
                    if(response.status === 200){
                        toast.success(data.message)
                        fetchExpenses(userId)
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
    }        

  return (
   <div className="container mt-5">
            <div className="text-center mb-4">
                <h2> <i className="fas fa-tasks me-2"></i>Manage Expense</h2>
                <p className="text-muted">View, Edit, or delete your expenses </p>
            </div>

            <div>
                <table className="table  table-striped table-bordered">
                    <thead className="table-dark text-center">
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Date</th>
                        <th scope="col">Item</th>
                        <th scope="col">Cost (₹)</th>
                        <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {expenses.length > 0 ? (
                           expenses.map((exp,index) =>(
                            <tr>
                                <th scope="row">{index+1}</th>
                                <td>{new Date(exp.ExpenseDate + "T00:00:00").toLocaleDateString("en-IN")}</td>
                                <td>{exp.ExpenseItem}</td>
                                <td>{exp.ExpenseCost}</td>
                                <td>
                                    <button className="btn btn-sm btn-info me-2" onClick={()=>handleEdit(exp)}> <i className="fas fa-edit"></i> </button>
                                    <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(exp.id)}> <i className="fas fa-trash"></i> </button>

                                </td>
                            </tr>
                           ))

                        ):(
                            <tr> 
                                <td colspan="5" className="text-center text-muted">
                                <i className="fas fa-exclamation-circle me-3"></i>
                                No expenses found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        {editExpense && (
            <div className="modal show d-block" style={{background:'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title"> <i className="fas fa-pen me-2"></i> Edit Expense</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                        <label className="form-label">Expense Date</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fas fa-calendar"></i>
                            </span>
                            <input type="date" name="ExpenseDate" className="form-control" value={editExpense.ExpenseDate} onChange={handleChange} required ></input>
                        </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Expense Item</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fas fa-envelope"></i>
                                </span>
                                <input type="text" name="ExpenseItem" className="form-control" onChange={handleChange}  value={editExpense.ExpenseItem} required placeholder="Enter your expenses (e.g. Groceries,books,)"></input>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Expense Cost</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fas fa-inr"></i>
                                </span>
                                <input type="number" name="ExpenseCost" className="form-control" onChange={handleChange}  value={editExpense.ExpenseCost} required placeholder="Enter amount (₹)"></input>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose} >Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleUpdate}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
        )}    
       
        <ToastContainer/>
    </div>
  )
}

export default ManageExpense
