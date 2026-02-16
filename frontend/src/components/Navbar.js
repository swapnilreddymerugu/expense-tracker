import React from 'react'
import {Link} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import API_URL from "../api.js";


function Navbar() {
    const navigate=useNavigate()
    const userId=localStorage.getItem('userId')

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/login')

    }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container-fluid">
   <Link className="navbar-brand" to="#"><i className='fas fa-wallet me-2'></i>Expense Tracker</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link " aria-current="page" to="/"> <i className='fas fa-home me-1'></i>Home</Link>
        </li>

        {userId ? (
            <>
                <li className="nav-item">
                <Link className="nav-link" to="/dashboard"> <i className='fas fa-tachometer-alt me-1'></i>Dashboard</Link>
                </li>
                <li className='nav-item'>
                  <Link  className='nav-link' to='/salary-sheet' > <i className='fas fa-receipt me-2'></i>My Salary Sheet</Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link" to="/add-expense"> <i className='fas fa-plus me-1'></i>Add Expense</Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link" to="/manage-expense"> <i className='fas fa-tasks me-1'></i>Manage Expense</Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link" to="/expense-report"> <i className='fas fa-file-alt me-1'></i>Expense Report</Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link" to="/change-password"> <i className='fas fa-key me-1'></i>Change Password</Link>
                </li>
                <button className="btn btn-danger btn-sm ms-2" onClick={handleLogout}>
                 <i className='fas fa-sign-out-alt me-1'></i>Logout
                </button>

            </>

        ) : (
            <>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup"> <i className='fas fa-user-plus me-1'></i> Signup</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login"> <i className='fas fa-sign-in-alt me-1'></i>Login</Link>
                </li>

            </>
        )}
      </ul>
    </div>
  </div>
</nav>
  )
}

export default Navbar;
