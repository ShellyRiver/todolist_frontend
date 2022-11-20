import { Outlet, Link, useNavigate} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import {signOutUser} from '../authentication/auth'
import logo from "../imgs/group-todo-logo.png";
import React from "react";
import './Navigator.css';




function Navigator() {
  const navigate = useNavigate();
  async function clickSignOut(){
    const response = await signOutUser();
    if (response === true) {
      localStorage.setItem('email', "");
      navigate('/login')
    }
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
                <Nav.Link href="message">Message</Nav.Link>
                <Nav.Link href="profile">Profile</Nav.Link>
                {/*<Nav.Link href="auth">SignIn</Nav.Link>*/}
              </Nav>
            </Navbar.Collapse>
          }
        </Container>
        { localStorage.getItem("email") && localStorage.getItem("email") != "" &&
          <Button variant="outline-primary" onClick={clickSignOut}>Sign Out</Button>
        }
      </Navbar>
      <Outlet />
    </>
  )
}
  
export default Navigator;