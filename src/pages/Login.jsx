import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user')) || null;

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Username should contain at least 3 characters")
        .max(25, "Username is too long")
        .required("Username is required"),
      password: Yup.string()
        // .min(8, "Password should contain at least 8 characters")
        // .matches(
          // /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
          // "Password should contain uppercase, lowercase, special characters, and numbers"
        // )
        .required("Please secure your account with a password"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.post("http://127.0.0.1:8000/UserLogin", values, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Save user data and authentication state
        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("isAuthenticated", JSON.stringify(true));

        // navigate(`/${user.user_id}`);
        navigate(`/${res.data.user_id}`);
      } catch (err) {
        console.log(err);
        if (err.response && err.response.status === 403) {
          alert("Your account is blocked!");
        } else {
          alert("Login failed.");
        }
      }
    },
  });

  return (
    <div className="log-wrapper">
      <div className="login-wrapper">
        
        <form onSubmit={formik.handleSubmit}>
          <div>
            <label>Username</label>
          </div>
          <input
            type="text"
            name="username"
            placeholder="Enter your Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username && (
            <p>{formik.errors.username}</p>
          )}

          <div>
            <label>Password</label>
          </div>
          <input
            type="password"
            name="password"
            placeholder="Enter your Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <p>{formik.errors.password}</p>
          )}

          <div className="button-wrapper">
            <button
              type="submit"
              className="button-styling"
              disabled={formik.isSubmitting}
            >
              Login
            </button>
          </div>

          <h4>Don't have an account?</h4>
          <Link to="/signup">Sign Up</Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
