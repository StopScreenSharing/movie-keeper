import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useHistory } from "react-router-dom";

export const SignupForm = () => {
    const [error, setError] = useState(null);
    const history = useHistory();

    const formSchema = yup.object().shape({
        username: yup
            .string()
            .required("Must enter username"),
        password: yup
            .string()
            .required("Must enter a password")
            .max(15, "Password must be 15 characters or less"),
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            setError(null);

            fetch("/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            }).then((res) => {
                if (res.ok) {
                    history.push("/login");
                } else {
                    res.json().then((data) => {
                        setError(data.errors?.[0] || "Username already exists");
                    });
                }
            });
        },
    });

    return (
        <div>
            <h1>Signup</h1>

            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="username">Username</label>
                <br />
                <input
                    id="username"
                    name="username"
                    onChange={(e) => {
                        formik.handleChange(e);
                        setError(null);
                    }}
                    value={formik.values.username}
                />
                {formik.errors.username && (
                    <p style={{ color: "red" }}>{formik.errors.username}</p>
                )}

                <label htmlFor="password">Password</label>
                <br />
                <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={(e) => {
                        formik.handleChange(e);
                        setError(null);
                    }}
                    value={formik.values.password}
                />
                {formik.errors.password && (
                    <p style={{ color: "red" }}>{formik.errors.password}</p>
                )}

                {error && (
                    <p style={{ color: "red", marginTop: "10px" }}>
                        {error}
                    </p>
                )}

                <button type="submit">Submit</button>
                <button type="button" onClick={() => history.push("/login")}>
                    Login
                </button>
            </form>
        </div>
    );
};