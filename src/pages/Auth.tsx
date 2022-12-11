import Button from 'react-bootstrap/Button';
import React, {useState } from 'react';
import {signUp, signIn, signOutUser, changeToRegister} from '../authentication/auth'
import Form from 'react-bootstrap/Form';
import './Auth.css';
import logo from '../imgs/group-todo-logo.png';
import {Navigate, useNavigate} from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export default function Auth() {
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const email = localStorage.getItem("email");
    if (email !== null && email !== ""){
        return <Navigate replace to="/grouptodo" />
    }

    async function clickSignIn() {
        const response = await signIn();
        if (response.status === "success") {
            // @ts-ignore
            localStorage.setItem('email', response.message);
            localStorage.setItem('user', JSON.stringify(response.info));
            navigate('/');
            setShowErrorMsg(false);
        }
        else {
            setShowErrorMsg(true);
            setErrorMsg(response.message)
        }
    }

    async function clickSignUp() {
        const response = await signUp();
        if (response.status === "success") {
            // @ts-ignore
            setShowErrorMsg(false);
            setShowSuccessMsg(true);
            // @ts-ignore
            document.getElementById('login-tab-tab-login').click();
        }
        else {
            setShowErrorMsg(true);
            setErrorMsg(response.message)
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
                  Now you can log in and start using Group ToDo!
              </p>
          </Alert>}
          <div className="logo">
              <img src={logo}/>
              <div>Sign in to Group ToDo</div>
          </div>
          <Form className="login-form">
              <Tabs defaultActiveKey="login" id='login-tab' className="mb-3 login-tab" fill>
                  <Tab eventKey="login" title="LOGIN" id='sign-in-tab'>
                      <Form.Group className="mb-3">
                          <Form.Label>Email address</Form.Label>
                          <Form.Control type="email" placeholder="Enter email" id="email-sign-in" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                          <Form.Label>Password</Form.Label>
                          <Form.Control type="password" placeholder="Password" id="password-sign-in"/>
                      </Form.Group>
                      <Button variant="primary" onClick={clickSignIn} className='sign-in-button'>
                          SIGN IN
                      </Button>
                      <div className='register-prompt'>Not a member?&nbsp; <p className='register-link' onClick={changeToRegister} >Register</p></div>
                  </Tab>
                  <Tab eventKey="register" title="REGISTER" id='sign-up-tab'>
                      <Form.Group className="mb-3">
                          <Form.Label>Email address</Form.Label>
                          <Form.Control type="email" placeholder="Enter email" id="email-sign-up" />
                      </Form.Group>
                      <Form.Group className="mb-3" id="userName">
                          <Form.Label>User Name</Form.Label>
                          <Form.Control placeholder="Enter user name" id="name-sign-up"/>
                      </Form.Group>
                      <Form.Group className="mb-3">
                          <Form.Label>Password</Form.Label>
                          <Form.Control type="password" placeholder="Password" id="password-sign-up"/>
                      </Form.Group>
                      <Form.Group className="mb-3">
                          <Form.Label>Repeat Password</Form.Label>
                          <Form.Control type="password" placeholder="Repeat Password" id="repeat-password-sign-up"/>
                      </Form.Group>
                      <Button variant="primary" onClick={clickSignUp} className='sign-in-button'>
                          SIGN UP
                      </Button>
                  </Tab>
              </Tabs>
          </Form>
      </>
    );
  };
  


