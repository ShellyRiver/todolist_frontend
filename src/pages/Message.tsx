import {Navigate} from "react-router-dom";
import React from "react";

const Message = () => {
    const email = localStorage.getItem("email");
    if (email == null || email == ""){
        return <Navigate replace to="/login" />
    }
    else {
        return <h1>Message</h1>;
    }
  };
  
  export default Message;