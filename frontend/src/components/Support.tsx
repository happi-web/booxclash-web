import React from "react";
import "./css/support.css";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Support: React.FC = () => {
  return (
    <>
    <NavBar/>
      <div className="support-container">
      <h1 className="support-title">Contact Us</h1>
      <p className="support-description">
        We're here to help! Fill out the form below, and our team will get back to you as soon as possible.
      </p>
      <form className="support-form">
        <label htmlFor="name" className="form-label">Name</label>
        <input type="text" id="name" name="name" placeholder="Enter your name" className="form-input" />

        <label htmlFor="email" className="form-label">Email</label>
        <input type="email" id="email" name="email" placeholder="Enter your email" className="form-input" />

        <label htmlFor="message" className="form-label">Message</label>
        <textarea
          id="message"
          name="message"
          placeholder="Enter your message"
          className="form-textarea"
        ></textarea>

        <button type="submit" className="form-button">Submit</button>
      </form>
    </div>
    <Footer/>
    </>

  );
};

export default Support;
