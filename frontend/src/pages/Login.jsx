import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import  "../css/login.css";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../services/firebase";
import Footer from "../components/Footer";


const Login = () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
      
      // Clear error when user edits the field
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: null
        });
      }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email address is invalid';
        }
        
        if (!formData.password) {
          newErrors.password = 'Password is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
          // Set authentication status in localStorage
          localStorage.setItem('isAuthenticated', 'true');
          
          // Navigate to home
          navigate('/home');
        }
      };

    return (
      <>
      <div className="auth-container">
          <div className="auth-card">
          <div className="auth-header">
              <Link to="/" className="">
              <span>StreamLog</span>
              </Link>
              <h1>Welcome!</h1>
              <p>Log in to access your account</p>
          </div>
          
          <form className="auth-form" onSubmit={handleSubmit}>
              <div className="social-login">
              <button 
                type="button" 
                className="social-button google"
                onClick={async () => {
                  try {
                    const result = await signInWithPopup(auth, provider);
                    const user = result.user;
                    console.log("Signed in user:", user);

                    // Save login state if you want
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('userEmail', user.email);
                    localStorage.setItem('uid', user.uid);

                    // Navigate to homepage
                    navigate("/home");
                  } catch (error) {
                    console.error("Google Sign-In failed", error);
                  }
                }}
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google logo"
                  style={{ width: "20px", height: "20px", marginRight: "10px", verticalAlign: "middle" }}
                />
                <i className="fab fa-google"></i> Continue with Google
              </button>
              </div>
          </form>
          </div>
      </div>
    </>
    );
};
export default Login;