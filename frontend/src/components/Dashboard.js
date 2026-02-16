import React ,{useEffect,useState} from 'react'
import {useNavigate} from 'react-router-dom'
import{Pie} from 'react-chartjs-2'
import {Chart, ArcElement,Tooltip,Legend} from 'chart.js'
import API_URL from "../api.js";




Chart.register(ArcElement,Tooltip,Legend)
function Dashboard() {
    const userName=localStorage.getItem('userName')
    const navigate=useNavigate()

    const userId=localStorage.getItem('userId')

    const [expenses,setExpenses]=useState([]);
    const[todayTotal,setTodayTotal]=useState(0);
    const[yesterdayTotal,setYesterdayTotal]=useState(0);
    const[last7daysTotal,setLast7daysTotal]=useState(0);
    const[last30daysTotal,setLast30daysTotal]=useState(0);
    const[currentYearTotal,setCurrentYearTotal]=useState(0);
    const[grandTotal,setGrandTotal]=useState(0);


    const pieData={
      labels: expenses.map(exp=>exp.ExpenseItem),
      datasets:[{
        label:'expenseCost',
        data:expenses.map(exp=>parseFloat(exp.ExpenseCost)),
        backgroundColor:['#d25454','#6c9ae4','#f08330','#b985ab'],
        borderWidth:1,
      } ,
      ],
    
    };
    

    useEffect(()=>{
        if(!userId){
            navigate('/login')
        }
        fetchExpenses(userId)
    },[userId, navigate])

    const fetchExpenses=async(userId)=>{
      try{
          const response= await fetch(`${API_URL}/api/manage_expense/${userId}`);
          const data = await response.json();
          setExpenses(data);
          calculateTotals(data)
      }
      catch(error){
          console.log('Something went wrong',error);
      }
    };

    const calculateTotals=(data)=>{
      const today=new Date();
      // today.setHours(0,0,0,0)
      const yesterday=new Date();
      yesterday.setDate(today.getDate()-1);
      const last7days=new Date();
      last7days.setDate(today.getDate()-6);
      const last30days=new Date();
      last30days.setDate(today.getDate()-30);
      const currentYear=today.getFullYear();

      let todaySum=0, yesterdaySum=0,last7Sum=0,last30Sum=0,yearSum=0,grandSum=0;

      data.forEach(item => {
        const expenseDate=new Date(item.ExpenseDate);
        // expenseDate.setHours(0,0,0,0);
        const amount=parseFloat(item.ExpenseCost) || 0;

        if(expenseDate.toDateString() === today.toDateString()) {todaySum+=amount}
        if(expenseDate.toDateString() === yesterday.toDateString()) { yesterdaySum+=amount}
        if(expenseDate >= last7days) { last7Sum+=amount}
        if(expenseDate >= last30days) {last30Sum+=amount}
         if(expenseDate.getFullYear() === currentYear) {yearSum+=amount}


        grandSum+=amount
      });

      setTodayTotal(todaySum)
      setYesterdayTotal(yesterdaySum)
      setLast7daysTotal(last7Sum)
      setLast30daysTotal(last30Sum)
      setCurrentYearTotal(yearSum)
      setGrandTotal(grandSum)


    }
     
  return (
    <div className='container mt-4'>
      <div className='text-center'>
        <h1>Welcome {userName}!</h1>
        <p className='text-muted'>Here's your expense overview</p>
      </div>

      <div className='row g-4'>
        <div className='col-md-4 mb-3'>
          <div className='card bg-primary text-white text-center' style={{height:'150px'}}>
            <div className='card-body'>
                <h5 className='card-title'><i className='fas fa-calendar-day me-2'></i>Today's Expense</h5>
                <p className='card-text fs-4' >₹ {todayTotal}</p>
            </div>
          </div>
        </div>

        <div className='col-md-4 mb-3'>
          <div className='card bg-success text-white text-center' style={{height:'150px'}}>
            <div className='card-body'>
                <h5 className='card-title'><i className='fas fa-calendar-minus me-2'></i>Yesterday's Expense</h5>
                <p className='card-text fs-4' >₹ {yesterdayTotal}</p>
            </div>
          </div>
        </div>

        <div className='col-md-4 mb-3'>
          <div className='card bg-secondary text-white text-center' style={{height:'150px'}}>
            <div className='card-body'>
                <h5 className='card-title'><i className='fas fa-calendar-week me-2'></i>Last 7 Days</h5>
                <p className='card-text fs-4' >₹ {last7daysTotal}</p>
            </div>
          </div>
        </div>

        <div className='col-md-4 mb-3'>
          <div className='card bg-warning text-white text-center' style={{height:'150px'}}>
            <div className='card-body'>
                <h5 className='card-title'><i className='fas fa-calendar-alt me-2'></i>Last 30 Days</h5>
                <p className='card-text fs-4' >₹ {last30daysTotal}</p>
            </div>
          </div>
        </div>

        <div className='col-md-4 mb-3'>
          <div className='card bg-danger text-white text-center' style={{height:'150px'}}>
            <div className='card-body'>
                <h5 className='card-title'><i className='fas fa-calendar me-2'></i>Current Year</h5>
                <p className='card-text fs-4' >₹ {currentYearTotal}</p>
            </div>
          </div>
        </div>

        <div className='col-md-4 mb-3'>
          <div className='card bg-dark text-white text-center' style={{height:'150px'}}>
            <div className='card-body'>
                <h5 className='card-title'><i className='fas fa-wallet me-2'></i>Total Expense</h5>
                <p className='card-text fs-4' >₹ {grandTotal}</p>
            </div>
          </div>
        </div>

      </div>

      <div className='my-5' style={{width:'400px',height:'400px',margin:'auto'}}>
        <h3 className='text-center'><i class="fas fa-pie-chart-alt"></i>Expense Distribution</h3>
        <Pie data={pieData}/>
      </div>
    </div>
  )
}

export default Dashboard
