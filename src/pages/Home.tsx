import { Outlet, Link } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';

import React, { useEffect } from 'react';
import { useState } from 'react';
import './Home.css'
import { Alert } from "react-bootstrap";
import {useAuthContext} from "../context/authContext";
import Auth from './Auth';
import {Navigate} from "react-router-dom";

// 3 roles in a group
const GROUPMEMBER: number = 1;
const GROUPLEADER: number = 2;
const GROUPCOLLABORATOR: number = 3;

const groupNames: string[] = ["Personal tasks", "CS 409 Final Project"];

function Home() {
    const email = localStorage.getItem("email");
    if (email == null || email == ""){
        return <Navigate replace to="/auth" />
    }
    else{
        return (
          <>
            <h1>Home</h1>
            <div className="home">
              <div className="viewChoose">
                <Navigator />
              </div>
              <div className="content">
                <div className="groupList">
                  <GroupList />
                </div>
                <div className="taskBoard">
                  <Outlet />
                </div>
              </div>

            </div>

          </>
        );
    }
  };
  
// the group list on the left
function GroupList() {
  const [componentList, setComponentList] = useState([]);

  useEffect(() => {
    __updateComponent();
  }, [])  // TODO: add dependency?


  function __updateComponent() {
    let newComponentList: any = [];
    for (let i in groupNames) {
      newComponentList.push(
        <div className="groupItem" key={i+"groupItem"}>
          <Accordion.Item eventKey={groupNames[i]}>
            <Accordion.Header>{groupNames[i]}</Accordion.Header>
            <Accordion.Body>
              {Buttons(1)}
            </Accordion.Body>
          </Accordion.Item>
        </div>
      );
    }
    setComponentList(newComponentList);
  }

  return (
    <>
      <Accordion>
        {componentList}
      </Accordion>
    </>
  )
}

// the control buttons of the group list
// different methods based on role: 1) group member; 2) group leader; 3) collaborator
function Buttons(role: number) {
  if (role === GROUPMEMBER) {
    return (
      <ListGroup>
        <ListGroup.Item action>
          button
        </ListGroup.Item>
        <ListGroup.Item action>
          button
        </ListGroup.Item>
        <ListGroup.Item action onClick={()=>console.log('button clicked')}>
          This one is a button
        </ListGroup.Item>
      </ListGroup>
    );
  }
  else if (role === GROUPLEADER) {
    return (
      <ListGroup>
        <ListGroup.Item action>
          button
        </ListGroup.Item>
        <ListGroup.Item action>
          button
        </ListGroup.Item>
        <ListGroup.Item action onClick={()=>console.log('button clicked')}>
          This one is a button
        </ListGroup.Item>
      </ListGroup>
    );
  }
  else {  // collaborator
    return (
      <ListGroup>
        <ListGroup.Item action>
          button
        </ListGroup.Item>
        <ListGroup.Item action>
          button
        </ListGroup.Item>
        <ListGroup.Item action onClick={()=>console.log('button clicked')}>
          This one is a button
        </ListGroup.Item>
      </ListGroup>
    );
  }
}


// navigate to monthly view or daily view
function Navigator() {
  return (
    <>
      <Navbar bg="light" variant="light">
        <Container className="navContainer">
          <Nav className="me-auto">
            <Nav.Link href="/monthly">Monthly</Nav.Link>
            <Nav.Link href="/daily">Daily</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  )
}


export default Home;