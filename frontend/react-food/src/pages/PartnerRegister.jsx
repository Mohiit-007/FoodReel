import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PartnerRegister() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: e.target.name.value,
      contactName: e.target.contactName.value,
      phone: e.target.phone.value,
      address: e.target.address.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const res = await axios.post(
        "http://localhost:8000/user/partner/register",
        data,
        { withCredentials: true }
      );
      localStorage.setItem("partnerId", res.data.Partner._id);
      localStorage.setItem("name", res.data.Partner.contactName);
      navigate(`/partner/${res.data.Partner._id}`);

    } catch (err) {
      console.log("Registration error:", err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card partner-card">

        <div className="auth-top">
          <span>Registering as customer?</span>
          <NavLink to="/user/register">Switch here</NavLink>
        </div>

        <h1>Partner Sign Up</h1>
        <p className="subtitle">
          Register your restaurant or food business
        </p>

        <form className="form-class" onSubmit={handleSubmit}>

          <div className="input-group">
            <input name="name" placeholder="Restaurant name" required />
          </div>

          <div className="input-group">
            <input name="contactName" placeholder="Owner / Manager" required />
          </div>

          <div className="input-group">
            <input type="tel" name="phone" maxLength="10" placeholder="10 digit phone number" required />
          </div>

          <div className="input-group">
            <input name="address" placeholder="Full business address" required />
          </div>

          <div className="input-group">
            <input type="email" name="email" placeholder="contact@example.com" required />
          </div>

          <div className="input-group">
            <input type="password" name="password" minLength="6" placeholder="Create password" required />
          </div>

          <button type="submit" className="primary-btn">
            Register Business
          </button>

        </form>

        <div className="bottom-text">
          Already have an account?
          <NavLink to="/partner/login"> Login</NavLink>
        </div>

      </div>
    </div>
  );
}