import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
import {signUp, signIn, signOutUser} from '../authentication/auth'
import Form from 'react-bootstrap/Form';
import './Auth.css';
import logo from '../imgs/group-todo-logo.png';
import {useAuthContext} from "../context/authContext";
import {useNavigate} from "react-router-dom";

export default function Auth() {
    const [showUserName, setShowUserName] = useState(false);
    const [email, setEmail] = useState(localStorage.getItem("email") || "");
    const navigate = useNavigate();
    async function clickSignInTest() {
        if (showUserName === true) {
            setShowUserName(false);
            // @ts-ignore
            document.getElementById("email").value = "";
            // @ts-ignore
            document.getElementById("password").value = "";
        }
        else {
            const response = await signIn();
            console.log(response);
            if (response) {
                // @ts-ignore
                localStorage.setItem('email', response);
                console.log(`Logged in email is: ${response}`);
                navigate('/');
            }
        }
    }

    const clickSignUpTest = () => {
        if (showUserName === false) {
            setShowUserName(current => !current);
            // @ts-ignore
            document.getElementById("email").value = "";
            // @ts-ignore
            document.getElementById("password").value = "";
        }
        else {
            signUp();
        }
    }
    return (
      <>
          <div className="logo">
              <img src={logo}/>
              <div>Sign in to Group ToDo</div>
          </div>
          <Form className="login-form">
              <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" id="email" />
              </Form.Group>
              {showUserName && <Form.Group className="mb-3" controlId="formBasicEmail" id="userName">
                  <Form.Label>User Name</Form.Label>
                  <Form.Control placeholder="Enter user name" id="name"/>
              </Form.Group>}
              <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" id="password"/>
              </Form.Group>
              <div className="button-container">
                  <Button variant="primary" onClick={clickSignInTest}>
                      Sign In
                  </Button>
                  <Button variant="primary" onClick={clickSignUpTest}>
                      Sign Up
                  </Button>
              </div>
          </Form>

          {/*<div id="container">*/}
          {/*    <input placeholder="name" id="name"/>*/}
          {/*    <input type="email" placeholder="email" id="email"/>*/}
          {/*    <input type="password" placeholder="password" id="password"/>*/}
          {/*    <Button variant="outline-primary" onClick={clickSignUp}>Sign Up</Button>*/}
          {/*    <Button variant="outline-primary" onClick={clickSignIn}>Sign In</Button>*/}
          {/*    <Button variant="outline-primary" onClick={clickSignOut}>Sign Out</Button>*/}
          {/*</div>*/}
      </>
    );
  };
  


