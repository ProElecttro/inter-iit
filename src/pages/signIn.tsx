import { useState, ChangeEvent } from "react";
import "../styles/signIn.css";
import Logo from "../assets/WeOneInfotech_Logo.png";

function signIn() {
  const initialFormData = {
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3002/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.result);
        console.log("Redirecting to payment page");
        window.location.href = "/admin";
      } else {
        const errorData = await response.json();
        if (errorData.error) {
          alert(errorData.error);
        } else {
          alert("An unexpected error occurred. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("A network error occurred. Please check your internet connection.");
    }
  };

  function signup() {
    window.open("/signup");
  }

  return (
    <div className="register">
      <div className="LogoContain">
        <img id="img" src={Logo} alt="Logo" />
        <p id="companyTitle">We One Infotech</p>
      </div>
      <div className="login">
        <p id="signIn">Sign in</p>
        <label htmlFor="email">Email address</label>
        <br />
        <input
          type="email"
          name="email"
          onChange={handleInputChange}
          className="input-Box"
          placeholder="Enter your email address"
        />

        <label htmlFor="password">Password</label>
        <br />
        <input
          type="password"
          name="password"
          onChange={handleInputChange}
          className="input-Box"
          placeholder="Enter your password"
        />

        <div className="signup">
          <button id="signin-btn" onClick={handleSubmit}>
            Continue
          </button>
          <p className="newID">New to weoneinfotech?</p>
          <button className="signup-btn" onClick={signup}>
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}

export default signIn;