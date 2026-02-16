import React , {useState, useEffect} from "react";
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom'
import API_URL from "../api";

const ChangePassword = () => {

    const userId=localStorage.getItem('userId')
     const navigate=useNavigate();

    useEffect(()=>{
        if(!userId){
            navigate('/login')
        }

    },[userId, navigate])

   

    const[formData,setFormData]=useState({
        currentPassword:'',
        newPassword:'',
        confirmPassword:'',
    });

    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value});

    }

    const handleSubmit=async(e)=>{
        e.preventDefault();

        if(formData.newPassword !== formData.confirmPassword){
            toast.error('New passwords do not match');
            return;
        }
        try{
            const response=await fetch(`${API_URL}/api/change_password/${userId}/`,{
            method:'POST',
            headers:{'Content-Type' : 'application/json'},
            body:JSON.stringify({
                currentPassword:formData.currentPassword,
                newPassword:formData.newPassword,
            }),
        });
        const data=await response.json();
        if(response.status===200){
           
            toast.success(data.message)
            setFormData({currentPassword:'',newPassword:'',confirmPassword:''})
        }
        else{
            toast.error(data.message)
        }

        }
        catch(error){
            console.log('Error in changing password:',error);
            toast.error('Something went wrong! Try again');
        }
    }
  return (
    <div className="container mt-5">
            <div className="text-center mb-4">
                <h2> <i className="fas fa-key me-2"></i>Change Password</h2>
                <p className="text-muted">Secure your account with a new password</p>
            </div>
            <form className="p-4 rounded shadow mx-auto" style={{maxWidth:'400px'}} onSubmit={handleSubmit} >
                <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fas fa-lock"></i>
                        </span>
                        <input type="password" name="currentPassword" className="form-control" value={formData.currentPassword} onChange={handleChange} required placeholder='Enter your current password'></input>
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fas fa-lock-open"></i>
                        </span>
                        <input type="password" name="newPassword" className="form-control" value={formData.newPassword} onChange={handleChange} required placeholder='Enter your new password'></input>
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Confirm new password</label>
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fas fa-lock"></i>
                        </span>
                        <input type="password" name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange} required placeholder='confirm your new password'></input>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-3"><i className="fas fa-key"></i>Change Password</button>
            </form>
            <ToastContainer/>
        </div>
  )
}

export default ChangePassword
