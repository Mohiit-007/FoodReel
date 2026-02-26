import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserLogin() {
  const navigate = useNavigate();
  const [error,setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await axios.post(
        "http://localhost:8000/user/login",
        { email, password },
        { withCredentials: true }
      );
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("fullname", res.data.user.fullname);

      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Top Switch */}
        <div className="auth-top">
          <span>Are you a partner?</span>
          <NavLink to="/partner/login">Partner login</NavLink>
        </div>

        <h1>Welcome back</h1>
        <p className="subtitle">Log in to your customer account</p>

        {error && (
          <div className="login-error">
          {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="email" name="email" placeholder="you@example.com" />
          </div>
          <p></p>
          <div className="input-group">
            <input type="password" name="password" placeholder="Your password" />
          </div>
          <p></p>
          <button type="submit" className="primary-btn">
            Sign in
          </button>
        </form>

        <div className="bottom-text">
          Don’t have an account?
          <NavLink to="/user/register"> Register</NavLink>
        </div>

      </div>
    </div>
  );
}