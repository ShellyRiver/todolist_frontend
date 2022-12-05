import { Outlet, Link, useNavigate} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import {signOutUser} from '../authentication/auth'
import logo from "../imgs/group-todo-logo.png";
import React from "react";
import './Navigator.css';

import Badge from 'react-bootstrap/Badge';



function Navigator() {
  const navigate = useNavigate();
  async function clickSignOut(){
    const response = await signOutUser();
    if (response === true) {
      localStorage.setItem('email', "");
      // @ts-ignore
      localStorage.setItem('user', null);
      navigate('/login')
    }
  }
  var userName, userJSON;
  if (localStorage.getItem("user")) {
    userName = localStorage.getItem("user") || "";
    console.log(userName);
    userJSON = JSON.parse(userName);
    console.log(userJSON);
  }
  else {
    userName = "";
    userJSON = {};
  }
  

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/" className="navigator-logo"><img src={logo} /></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          { localStorage.getItem("email") && localStorage.getItem("email") != "" &&
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="message">Message
                  {(userJSON.invitingGroups.length > 0 || userJSON.unreadTasks.length > 0 || userJSON.invitingLeadingGroups.length > 0) && <Badge bg="secondary">New</Badge>}
                  {/*{(JSON.parse(localStorage.getItem('user')||'').invitingGroups.length > 0 || JSON.parse(localStorage.getItem('user')||'').unreadTasks.length > 0 || JSON.parse(localStorage.getItem('user')||'').invitingLeadingGroups.length > 0) && <Badge bg="secondary">New</Badge>}*/}
                </Nav.Link>
                <Nav.Link href="profile">Profile</Nav.Link>
                {/*<Nav.Link href="auth">SignIn</Nav.Link>*/}
              </Nav>
            </Navbar.Collapse>
          }
        </Container>
        {localStorage.getItem("email") && localStorage.getItem("email") != "" &&
          <p>Welcome {JSON.parse(userName).name}! </p>
        }
        { localStorage.getItem("email") && localStorage.getItem("email") != "" &&
          <Button variant="outline-primary" onClick={clickSignOut}>Sign Out</Button>
        }
      </Navbar>
      <Outlet />
    </>
  )
}
  
export default Navigator;