import {Navigate} from "react-router-dom";
import React from "react";

function Profile() {
  const email = localStorage.getItem("email");
  if (email == null || email == ""){
      return <Navigate replace to="/login" />
  }
  return (
    <>
      <h1>User Profile</h1>
      <span>Email: </span><span>{email}</span>
    </>
  );
};
  
export default Profile;