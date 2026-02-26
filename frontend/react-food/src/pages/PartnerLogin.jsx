import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PartnerLogin() {
  const navigate = useNavigate();
  const [error,setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const res = await axios.post(
        "http://localhost:8000/user/partner/login",
        data,
        { withCredentials: true }
      );

      localStorage.setItem("partnerId", res.data.Partner._id);
      localStorage.setItem("name", res.data.Partner.contactName);
      navigate(`/partner/${res.data.Partner._id}`);
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Switch to user login */}
        <div className="auth-top">
          <span>Are you a customer?</span>
          <NavLink to="/user/login">Login here</NavLink>
        </div>

        <h1>Partner Login</h1>
        <p className="subtitle">Access your business dashboard</p>

        {error && (
          <div className="login-error">
          {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="contact@example.com"
              required
            />
          </div>
          <p></p>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Your password"
              required
            />
          </div>

          <button type="submit" className="primary-btn">
            Sign in
          </button>

        </form>

        <div className="bottom-text">
          New here?
          <NavLink to="/partner/register"> Register</NavLink>
        </div>

      </div>
    </div>
  );
}