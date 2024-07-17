import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import commonStyles from './Register.module.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 


const Register = () => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
    cpassword: '',
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...user,
      [name]: value,
    });
  };

  // Validation logic for the form fields
  const validateForm = () => {
    const errors = {};

    if (!user.fname) {
      errors.fname = 'First Name is required';
    }

    if (!user.lname) {
      errors.lname = 'Last Name is required';
    }

    if (!user.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i.test(user.email)) {
      errors.email = 'This is not a valid email format!';
    }

    if (!user.password) {
      errors.password = 'Password is required';
    } else if (user.password.length < 4) {
      errors.password = 'Password must be more than 4 characters';
    } else if (user.password.length > 10) {
      errors.password = 'Password cannot exceed more than 10 characters';
    }

    if (!user.cpassword) {
      errors.cpassword = 'Confirm Password is required';
    } else if (user.cpassword !== user.password) {
      errors.cpassword = 'Confirm password and password should be the same';
    }

    return errors;
  };

  const signupHandler = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    setIsSubmit(true);

    if (Object.keys(errors).length === 0 && isSubmit) {
      axios
        .post('http://localhost:3002/signup/', user)
        .then((res) => {
          localStorage.setItem('token', res.data.accessToken);
          navigate('/', { replace: true });
        })
        .catch((res) => {
          console.log(res);
          alert(res.response.data);
        });
    }
  };

  return (
    <>
      <div className={`container ${commonStyles.container}`}>
        <form>
          <h1>Create your account</h1>
          <div className="mb-3">
            <input
              type="text"
              name="fname"
              id="fname"
              placeholder="First Name"
              onChange={changeHandler}
              value={user.fname}
              className={`form-control ${commonStyles.customInput}`}
            />
            <p className={commonStyles.error}>{formErrors.fname}</p>
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="lname"
              id="lname"
              placeholder="Last Name"
              onChange={changeHandler}
              value={user.lname}
              className={`form-control ${commonStyles.customInput}`}
            />
            <p className={commonStyles.error}>{formErrors.lname}</p>
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              onChange={changeHandler}
              value={user.email}
              className={`form-control ${commonStyles.customInput}`}
            />
            <p className={commonStyles.error}>{formErrors.email}</p>
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={changeHandler}
              value={user.password}
              className={`form-control ${commonStyles.customInput}`}
            />
            <p className={commonStyles.error}>{formErrors.password}</p>
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="cpassword"
              id="cpassword"
              placeholder="Confirm Password"
              onChange={changeHandler}
              value={user.cpassword}
              className={`form-control ${commonStyles.customInput}`}
            />
            <p className={commonStyles.error}>{formErrors.cpassword}</p>
          </div>
          <button
            className={`btn btn-primary ${commonStyles.customButton}`}
            onClick={signupHandler}
          >
            Register
          </button>
        </form>
        <Link to="/" className={`nav-link ${commonStyles.customNavLink}`}>
          Already registered? Login
        </Link>
      </div>

    </>
  );
};

export default Register;
