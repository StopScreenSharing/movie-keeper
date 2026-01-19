import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useHistory } from "react-router-dom";

import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const LoginForm = () => {
  const history = useHistory();
  const { setUser } = useContext(UserContext);

  const formSchema = yup.object().shape({
    username: yup.string().required("Must enter a username"),
    password: yup.string().required("Must enter a password"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
        .then((res) => {
          if (res.ok) return res.json();
          else throw new Error("Invalid username or password");
        })
        .then((userData) => {
          setUser(userData);
          console.log(userData)
          history.push("/");
        })
        .catch((err) => {
          alert(err.message);
        });
    },
  });

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="username">Username</label>
        <br />
        <input
          id="username"
          name="username"
          onChange={formik.handleChange}
          value={formik.values.username}
        />
        <p style={{ color: "red" }}>{formik.errors.username}</p>

        <label htmlFor="password">Password</label>
        <br />
        <input
          type="password"
          id="password"
          name="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        <p style={{ color: "red" }}>{formik.errors.password}</p>

        <button type="submit">Login</button>
        <button type="button" onClick={() => history.push("/signup")}>
          Sign Up
        </button>
      </form>
    </div>
  );
};
