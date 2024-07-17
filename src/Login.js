import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Add Bootstrap CSS
import loginstyle from './style.module.css';

const Login = ({ setUserState }) => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    email: '',
    password: '',
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    setUserDetails({
      ...user,
      [name]: trimmedValue,
    });
  };

  const validateForm = ({ email, password }) => {
    const error = {};

    const emailRegex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!email) {
      error.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      error.email = 'Enter a valid email address';
    }

    if (!password) {
      error.password = 'Password is required';
    }

    return error;
  };

  const loginHandler = (e) => {
    e.preventDefault();

    const formErrors = validateForm(user);

    setFormErrors(formErrors);
    setIsSubmit(true);
  };

  useEffect(() => {
    const handleSubmit = async () => {
      try {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
          const response = await axios.post('http://localhost:3002/login', user);
          localStorage.setItem('token', response.data.accessToken);
          navigate('/', { replace: true });
          navigate(0);
        }
      }  catch (error) {
        console.error('Login error:', error);
        alert('An error occurred. Please try again.');
      }
      
    };

    handleSubmit();
  }, [formErrors, isSubmit]);

  return (
    <div className={`container ${loginstyle.container}`}>
      <form >
        <h1 className={`mb-4 ${loginstyle.customh1}`}>Login</h1>
        <div className="mb-3">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email Id"
            className={`form-control ${loginstyle.customInput}`}
            onChange={changeHandler}
            value={user.email}
          />
          <p className={`text-danger ${loginstyle.customError}`}>{formErrors.email}</p>
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className={`form-control ${loginstyle.customInput}`}
            onChange={changeHandler}
            value={user.password}
          />
          <p className={`text-danger ${loginstyle.customError}`}>{formErrors.password}</p>
        </div>
        <button
          type="button"
          className={`btn btn-primary ${loginstyle.customButton}`}
          onClick={loginHandler}
        >
          Login
        </button>
      </form>
      <Link to="/signup" className={`nav-link ${loginstyle.customNavLink}`}>
        New User? Register Now
      </Link>
    </div>
  );
};

export default Login;
