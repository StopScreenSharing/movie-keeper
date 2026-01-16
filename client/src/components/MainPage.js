import { useOutletContext } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import React, { useContext } from "react";



function MainPage() {
    const { user, setUser } = useContext(UserContext);
   return <h1>Welcome, {user.username}</h1>
}

export default MainPage;