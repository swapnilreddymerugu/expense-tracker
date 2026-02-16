import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";



const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Password: "",
    MySalary: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 201) {
        toast.success("Signup Successful 🎉");

        setTimeout(() => {
          navigate("/login");
        }, 800);
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2>Signup</h2>
        <p className="text-muted">Create your Expense Tracker account</p>
      </div>

      <form
        className="p-4 rounded shadow mx-auto"
        style={{ maxWidth: "450px" }}
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="FullName"
            className="form-control"
            value={formData.FullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="Email"
            className="form-control"
            value={formData.Email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="Password"
            className="form-control"
            value={formData.Password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Monthly Salary</label>
          <input
            type="number"
            name="MySalary"
            className="form-control"
            value={formData.MySalary}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Signup
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default Signup;
