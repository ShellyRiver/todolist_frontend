import { Outlet, Link, useNavigate} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import {signOutUser} from '../authentication/auth'
import logo from "../imgs/group-todo-logo.png";
import home from "../imgs/home.png";
import React, {useEffect} from "react";
import './Navigator.css';
import Badge from 'react-bootstrap/Badge';
import Unknown from "../imgs/unknown.png";


function Navigator() {
  const navigate = useNavigate();
  // var userName = localStorage.getItem("user");
  // var userJSON = JSON.parse(userName || "");
  // const userName = localStorage.getItem("user") || "";
  // const userJSON = JSON.parse(userName);
  // console.log(userJSON);
  var userName;
  var userJSON: any;
  var imageURL;
  if (localStorage.getItem('user')) {
    userName = localStorage.getItem("user") || "";
    userJSON = JSON.parse(userName);
  }
  else {
    userName = "";
    userJSON = {};
  }

  useEffect(()=>{
    // userName = localStorage.getItem("user");
    // userJSON = JSON.parse(userName || "");
    if (userJSON) {
      if (localStorage.getItem("email") && localStorage.getItem("email") !== "") {
        // console.log(userJSON)
        if (userJSON.image) {
          imageURL = `data:image/jpeg;base64,${userJSON.image}`
          const img = document.getElementById('nav-profile-image');
          // @ts-ignore
          img.setAttribute('src', imageURL);
        } else {
          const img = document.getElementById('nav-profile-image');
          // @ts-ignore
          img.setAttribute('src', Unknown)
        }
      }
    }
  },[localStorage.getItem("email"), localStorage.getItem('refreshImg')])

  // useEffect(() => {
  //   userName = localStorage.getItem("user") || "";
  //   userJSON = JSON.parse(userName);
  //   console.log("Inside UUUUUUUUUUUu");
  //   console.log(userJSON);
  // }, [localStorage.getItem("refreshNav")])

  async function clickSignOut(){
    const response = await signOutUser();
    if (response === true) {
      localStorage.setItem('email', "");
      // @ts-ignore
      localStorage.setItem('user', null);
      navigate('/login')
    }
  }

  return (
    <>
      <Navbar bg="light" expand="lg">
        <div className='nav-outer-container'>
          <div className='nav-left-container'>
          <Navbar.Brand onClick={()=>navigate('/')} className="navigator-logo"><img src={logo} /></Navbar.Brand>
          <Navbar.Brand onClick={()=>navigate('/')} className="navigator-home"><img src={home} /></Navbar.Brand>
          {/*<Navbar.Toggle aria-controls="basic-navbar-nav" />*/}
          { localStorage.getItem("email") && localStorage.getItem("email") != "" && userJSON && (userJSON.invitingGroups.length > 0 || userJSON.unreadTasks.length > 0 || userJSON.invitingLeadingGroups.length > 0) &&
            // <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                {/*<Nav.Link href="/">Home</Nav.Link>*/}
                <Nav.Link onClick={()=>navigate('/message')}>Message&nbsp;
                  {(userJSON.invitingGroups.length > 0 || userJSON.unreadTasks.length > 0 || userJSON.invitingLeadingGroups.length > 0) && <Badge bg="secondary">New</Badge>}
                  {/*{(JSON.parse(localStorage.getItem('user')||'').invitingGroups.length > 0 || JSON.parse(localStorage.getItem('user')||'').unreadTasks.length > 0 || JSON.parse(localStorage.getItem('user')||'').invitingLeadingGroups.length > 0) && <Badge bg="secondary">New</Badge>}*/}
                </Nav.Link>
              </Nav>
            // </Navbar.Collapse>
          }
        </div>
          <div className="nav-right-container">
        {localStorage.getItem("email") && localStorage.getItem("email") != "" && userJSON &&
          <div id='nav-greeting'>Welcome {userJSON.name}! </div>
        }
        {localStorage.getItem("email") && localStorage.getItem("email") != "" && userJSON &&
            <Nav>
              <Nav.Link onClick={()=>navigate('profile')}>
              <div className='nav-image-container'><img src="" id='nav-profile-image'/></div>
              </Nav.Link>
            </Nav>
        }
        { localStorage.getItem("email") && localStorage.getItem("email") != "" && userJSON && 
          <Button variant="outline-primary" onClick={clickSignOut}>Sign Out</Button>
        }
        </div>
        </div>
      </Navbar>
      <Outlet />
    </>
  )
}
  
export default Navigator;