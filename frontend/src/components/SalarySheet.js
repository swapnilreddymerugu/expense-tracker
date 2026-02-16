import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from "../api";


const SalarySheet = () => {
  const userName = localStorage.getItem("userName");

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [salary, setSalary] = useState(0);

  const [expenses, setExpenses] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [yesterdayTotal, setYesterdayTotal] = useState(0);
  const [last7daysTotal, setLast7daysTotal] = useState(0);
  const [last30daysTotal, setLast30daysTotal] = useState(0);


  const[editSalary,setEditSalary]=useState(null)

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
    fetchExpenses(userId);
    fetchSalary(userId);
  }, [userId, navigate]);

  const fetchExpenses = async (userId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/manage_expense/${userId}`,
      );
      const data = await response.json();
      setExpenses(data);
      calculateTotals(data);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  const calculateTotals = (data) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const last7days = new Date();
    last7days.setDate(today.getDate() - 6);
    const last30days = new Date();
    last30days.setDate(today.getDate() - 30);
    

    let todaySum = 0,
      yesterdaySum = 0,
      last7Sum = 0,
      last30Sum = 0
      

    data.forEach((item) => {
      const expenseDate = new Date(item.ExpenseDate);

      const amount = parseFloat(item.ExpenseCost) || 0;

      if (expenseDate.toDateString() === today.toDateString()) {
        todaySum += amount;
      }
      if (expenseDate.toDateString() === yesterday.toDateString()) {
        yesterdaySum += amount;
      }
      if (expenseDate >= last7days) {
        last7Sum += amount;
      }
      if (expenseDate >= last30days) {
        last30Sum += amount;
      }
    });

    setTodayTotal(todaySum);
    setYesterdayTotal(yesterdaySum);
    setLast7daysTotal(last7Sum);
    setLast30daysTotal(last30Sum);
  };
  const fetchSalary = async (userId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/salary/${userId}`,
      );
      const data = await response.json();
      setSalary(data.salary);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

   const handleEdit = () => {
        setEditSalary({ salary: salary })
    }

   const handleUpdate=async()=>{
          try{
              const response= await fetch(`${API_URL}/api/update_salary/${userId}/`,{
                  method:'PUT',
                  headers:{'Content-Type':'application/json'},
                  body:JSON.stringify({
                    salary:Number(editSalary.salary)
                  })
              });
              const data=await response.json();
                  if(response.status === 200){
                      toast.success(data.message)
                      fetchSalary(userId);
                      setEditSalary(null)
                      
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
    const[totalSavings,setTotalSavings]=useState(0)

    useEffect(()=>{
        if(salary>0){
            saveMonthlySalary();
        }
    },[salary, last30daysTotal])

    const saveMonthlySalary = async () => {
        try {
            if (!userId) return;

            const res = await fetch(`${API_URL}/api/savings/${userId}/`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ salary }),
            }
            );

            const data = await res.json();
            setTotalSavings(data.total_savings);

        } catch (error) {
            console.log("Fetch Error:", error);
        }
    };

const Balance=salary-last30daysTotal;
const progressPercentage=salary>0?Math.min((Balance/salary)*100,100) : 0;
      

  return (
   
    <div className=" container ">
      <h1 className="text-center mb-4   p-5 ">💰 My Salary Sheet</h1>
      <div className="card p-4 shadow mb-4 bg-white text-dark">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">My Salary : ₹{salary}</h3>

          <button className="btn btn-md btn-primary" onClick={handleEdit}>
            <i className="fas fa-edit"></i> Edit
          </button>
        </div>
      </div>

      <div className="row text-center g-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary p-3">
            <h5>Salary</h5>
            <h3> ₹ {salary || 0}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-danger p-3">
            <h5>Current Month Expenses</h5>
            <h3> ₹ {last30daysTotal || 0}</h3>
          </div>
        </div>

        <div className="col-md-4 mb-5">
          <div className="card text-white bg-secondary p-3">
            <h5>Balance</h5>
            <h3> ₹ {salary - last30daysTotal || 0}</h3>
          </div>
        </div>
      </div>
      <div className="row g-5 text-center  justify-content-center">
        <div className="col-md-4 ">
          <div className="card bg-success  text-white p-4 shadow rounded-4">
            <h5>My Savings</h5>
            <h3>₹ {totalSavings}</h3>
          </div>
        </div>

        <div className="col-md-4 ms-5">
            <div className="card bg-white p-4 shadow rounded-4">
                <h5>This Month Savings Progress</h5>

                <div className="mt-3" style={{ width: 120, margin: "auto" }}>
                <CircularProgressbar
                    value={progressPercentage}
                    text={`${Math.round(progressPercentage)}%`}
                />
                </div>

                <p className="mt-3 text-muted">
                Balance: ₹{Balance}
                </p>
            </div>
            </div>
        </div>

      {salary-last30daysTotal<0 && (
        <div className="alert alert-warning mt-5 mb-0 text-center">
        ⚠️ You are overspending this month!
      </div>
      )}

    {editSalary &&(
        <div className="modal show d-block" style={{background:'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title"> <i className="fas fa-pen me-2"></i> Edit Expense</h5>
                        <button type="button" className="btn-close"  onClick={()=>setEditSalary(null)} ></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">My Salary</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fas fa-inr"></i>
                                </span>
                                <input type="number" name="ExpenseCost" className="form-control" value={editSalary.salary} onChange={(e) =>
                                    setEditSalary({ ...editSalary, salary: e.target.value })
                                }  required placeholder="Enter Salary (₹)"></input>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={()=>setEditSalary(null)}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleUpdate} >Save changes</button>
                    </div>
                </div>
           </div>
        </div>
    )}


    <ToastContainer/>
</div>

  );
};

export default SalarySheet;
