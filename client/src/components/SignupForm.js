import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

export const SignupForm = () => {
    const [users, setUsers] = useState([{}]);
    const [refreshPage, setRefreshPage] = useState(false);

    // useEffect(() => {
    //     console.log("FETCH! ");
    //     fetch("/users")
    //     .then((res) => res.json())
    //     .then((data) => {
    //         setUsers(data);
    //         console.log(data);
    //     });
    // }, [refreshPage]);

    const formSchema = yup.object().shape({
        username: yup.string().required("Invalid username").required("Must enter username"),
        password: yup.string().required("Must enter a password").max(15)
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch("/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values, null, 2),
            }).then((res) => {
                if (res.ok) {
                    setRefreshPage(!refreshPage);
                } else {
                    res.json().then((data) => {
                        alert(data.errors[0]);
                    });
                }
            });
        },
    });

    return (
        <div>
            <h1>Signup</h1>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="username">Usesrname</label>
                <br />
                <input 
                    id="username"
                    name="username"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                />
                <p style={{ color: "red" }}> {formik.errors.username}</p>
                
                <label htmlFor="password">Password</label>
                <br />

                <input
                id="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                />
                <p style={{ color: "red" }}> {formik.errors.password}</p>
                <button type="submit">submit</button>
            </form>
        </div>
    )
}