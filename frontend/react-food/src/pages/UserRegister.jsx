import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserRegister() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await axios.post(
        "http://localhost:8000/user/register",
        { fullname: name, email, password },
        { withCredentials: true }
      );
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("fullname", res.data.user.fullname);

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-top">
          <span>Are you a partner?</span>
          <NavLink to="/partner/register">Register here</NavLink>
        </div>

        <h1>Create account</h1>
        <p className="subtitle">Sign up as a food customer</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="text" name="name" placeholder="Your full name" />
          </div>
          <p></p>
          <div className="input-group">
            <input type="email" name="email" placeholder="you@example.com" />
          </div>
          <p></p>
          <div className="input-group">
            <input type="password" name="password" placeholder="Create a password" />
          </div>
          <p></p>
          <button type="submit" className="primary-btn">
            Create account
          </button>
        </form>

        <div className="bottom-text">
          Already have an Account?
          <NavLink to="/user/login"> Login</NavLink>
        </div>

      </div>
    </div>
  );
}