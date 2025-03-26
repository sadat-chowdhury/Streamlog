import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import  "../css/login.css";


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
    <div className="auth-container">
        <div className="auth-card">
        <div className="auth-header">
            <Link to="/" className="">
            <span>Streamlog</span>
            </Link>
            <h1>Welcome Back</h1>
            <p>Log in to access your account</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <div className="form-options">
            <div className="remember-me">
                <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                />
                <label htmlFor="rememberMe">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
            </div>
            
            <button type="submit" className="auth-button">Log In</button>
            
            <div className="auth-divider">
            <span>OR</span>
            </div>
            
            <div className="social-login">
            <button type="button" className="social-button google">
                <i className="fab fa-google"></i> Continue with Google
            </button>
            </div>
        </form>
        
        <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
        </div>
    </div>
    );
};
export default Login;