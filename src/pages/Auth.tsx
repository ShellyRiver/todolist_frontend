import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
import {signUp, signIn, signOutUser} from '../authentication/auth'
import Form from 'react-bootstrap/Form';
import './Auth.css';
import logo from '../imgs/group-todo-logo.png';
import {useAuthContext} from "../context/authContext";
import {useNavigate} from "react-router-dom";
import Alert from 'react-bootstrap/Alert';


export default function Auth() {
    const [showUserName, setShowUserName] = useState(false);
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");


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
            // console.log(response);
            if (response.status === "success") {
                // @ts-ignore
                localStorage.setItem('email', response.message);
                localStorage.setItem('user', JSON.stringify(response.info));
                // console.log(localStorage.getItem('user'));
                // console.log(`Logged in email is: ${response.message}`);
                navigate('/');
                setShowErrorMsg(false);
            }
            else {
                setShowErrorMsg(true);
                setErrorMsg(response.message)
            }
        }
    }

    async function clickSignUpTest() {
        if (showUserName === false) {
            setShowUserName(current => !current);
            // @ts-ignore
            document.getElementById("email").value = "";
            // @ts-ignore
            document.getElementById("password").value = "";
        }
        else {
            const response = await signUp();
            if (response.status === "success") {
                // @ts-ignore
                setShowErrorMsg(false);
                setShowSuccessMsg(true);
                setShowUserName(false);
            }
            else {
                setShowErrorMsg(true);
                setErrorMsg(response.message)
            }
        }
    }
    return (
      <>
          {showErrorMsg && <Alert variant="danger" onClose={() => setShowErrorMsg(false)} dismissible>
              <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
              <p>
                  {errorMsg}
              </p>
          </Alert>}
          {showSuccessMsg && <Alert variant="success" onClose={() => setShowSuccessMsg(false)} dismissible>
              <Alert.Heading>Signed Up Successfully!</Alert.Heading>
              <p>
                  Now you can log in and start Group ToDo!
              </p>
          </Alert>}
          <div className="logo">
              <img src={logo}/>
              <div>Sign in to Group ToDo</div>
          </div>

          <Form className="login-form">
              <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" id="email" />
              </Form.Group>
              {showUserName && <Form.Group className="mb-3" id="userName">
                  <Form.Label>User Name</Form.Label>
                  <Form.Control placeholder="Enter user name" id="name"/>
              </Form.Group>}
              <Form.Group className="mb-3">
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
  


