import {Navigate} from "react-router-dom";
import React from "react";

const Profile = () => {
    const email = localStorage.getItem("email");
    if (email == null || email == ""){
        return <Navigate replace to="/login" />
    }
    else {
        return <h1>Profile</h1>;
    }
  };
  
  export default Profile;