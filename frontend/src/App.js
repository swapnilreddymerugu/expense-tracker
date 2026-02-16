import Signup from "./components/signup";
import Login from "./components/login";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Dashboard from "./components/Dashboard";
import AddExpense from "./components/AddExpense";
import ManageExpense from "./components/ManageExpense";
import ExpenseReport from "./components/ExpenseReport";
import ChangePassword from "./components/ChangePassword";
import SalarySheet from "./components/SalarySheet";

function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/add-expense" element={<AddExpense/>}></Route>
        <Route path="/manage-expense" element={<ManageExpense/>}></Route>
        <Route path="/expense-report" element={<ExpenseReport/>}></Route>
        <Route path="/change-password" element={<ChangePassword/>}></Route>
        <Route path="/salary-sheet" element={<SalarySheet/>}></Route>

      </Routes>
      
      
      </BrowserRouter>

    </div>
  );

}

export default App;
