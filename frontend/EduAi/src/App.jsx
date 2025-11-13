import './App.css';
import { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css"; 

function App() {
  // ✅ Manage input states
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  // ✅ UI panel toggle animation
  useEffect(() => {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");

    signUpButton.addEventListener("click", () => {
      container.classList.add("right-panel-active");
    });

    signInButton.addEventListener("click", () => {
      container.classList.remove("right-panel-active");
    });
  }, []);

  // ✅ Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("Creating account...");

    try {
      const res = await fetch("https://eduai-zy69.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupData.name, // backend expects 'username'
          email: signupData.email,
          password: signupData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Signup successful! Please login now.");
        setSignupData({ name: "", email: "", password: "" });
      } else {
        setMessage(`❌ ${data.error || data.message || "Signup failed."}`);
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setMessage("⚠️ Server connection error.");
    }
  };

  // ✅ Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const res = await fetch("https://eduai-zy69.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMessage("✅ Login successful! Token saved.");
        setLoginData({ email: "", password: "" });
        console.log("JWT Token:", data.token);
      } else {
        setMessage(`❌ ${data.error || data.message || "Invalid credentials."}`);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setMessage("⚠️ Server connection error.");
    }
  };

  return (
    <>
      <div className="container" id="container">
        {/* SIGN UP FORM */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignup}>
            <h1 className='hello'>Create Account</h1>
            <span>or use your email for registration</span>

            <input
              type="text"
              placeholder="Username"
              value={signupData.name}
              onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* SIGN IN FORM */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h1 className='hello'>Sign in</h1>
            <span>or use your account</span>

            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
            <a href="#">Forgot your password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* PANEL ANIMATION */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" id="signIn">Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" id="signUp">Sign Up</button>
            </div>
          </div>
        </div>
      </div>

      {/* STATUS MESSAGE */}
      <p style={{
        textAlign: "center",
        color: message.includes("✅") ? "green" :
               message.includes("❌") ? "red" :
               message.includes("⚠️") ? "orange" : "black",
        marginTop: "20px",
        fontWeight: "bold"
      }}>
        {message}
      </p>
    </>
  );
}

export default App;
