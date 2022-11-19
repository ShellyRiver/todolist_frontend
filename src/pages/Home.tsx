import { Outlet, Link } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import React, { useEffect } from 'react';
import { useState, createContext, useContext } from 'react';
import './Home.css'
import { Alert } from "react-bootstrap";

// different methods to manipulate a group based on the role
// 4 roles in a group:
// 0 - individual: the individual tasks group, this is the default group where there is only the user him/herself
// 1 - gourp member: can leave a group
// 2 - group leader: can create and assign tasks, delete a group, leave a group and assign new leader/collaborator
// 3 - group collaborator: can create and assign tasks, leave a group
const INDIVIDUAL: number = 0;
const GROUPMEMBER: number = 1;
const GROUPLEADER: number = 2;
const GROUPCOLLABORATOR: number = 3;

const groupNames: string[] = ["Personal tasks", "CS 409 Final Project"];

function Home() {
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
  };
  
  
// the group list on the left
function GroupList() {
  const [componentList, setComponentList] = useState([]);

  const [showAddTask, setShowAddTask] = useState(false);

  const handleCloseAddTask = () => setShowAddTask(false);
  const handleShowAddTask = () => {
    setShowAddTask(true);
    console.log(showAddTask);
  }
  let change = 0;
  function toggleAddTask() {
    setShowAddTask(true);
  }

  useEffect(() => {
    console.log(change)
    toggleAddTask();
  }, [change])

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
              {Buttons(0)}
            </Accordion.Body>
          </Accordion.Item>
        </div>
      );
    }
    setComponentList(newComponentList);
  }

  function Buttons(role: number) {
  
    if (role === INDIVIDUAL) {
      return (
        <>
          <ListGroup>
            <ListGroup.Item action onClick={() => setShowAddTask(true)}>
              Add a task
            </ListGroup.Item>
            
            <ListGroup.Item action onClick={()=>console.log('button clicked')}>
              Group information
            </ListGroup.Item>
          </ListGroup>
          
        </>
      );
    }
    else if (role === GROUPMEMBER) {
      return (
        <ListGroup>
          <ListGroup.Item action>
            Leave group
          </ListGroup.Item>
          <ListGroup.Item action onClick={()=>console.log('button clicked')}>
            Group information
          </ListGroup.Item>
        </ListGroup>
      );
    }
    else if (role === GROUPLEADER) {
      return (
        <ListGroup>
          <ListGroup.Item action onClick={()=>console.log()}>
            Add a task
          </ListGroup.Item>
          <ListGroup.Item action>
            Invite group member
          </ListGroup.Item>
          <ListGroup.Item action onClick={()=>console.log('button clicked')}>
            Invite collaborator
          </ListGroup.Item>
          <ListGroup.Item action onClick={()=>console.log('button clicked')}>
            Delete group member
          </ListGroup.Item>
          <ListGroup.Item action onClick={()=>console.log('button clicked')}>
            Leave group
          </ListGroup.Item>
          <ListGroup.Item action onClick={()=>console.log('button clicked')}>
            Delete group
          </ListGroup.Item>
          <ListGroup.Item action onClick={()=>console.log('button clicked')}>
            Group information
          </ListGroup.Item>
        </ListGroup>
      );
    }
    else {  // collaborator
      return (
        <ListGroup>
          <ListGroup.Item action>
            Add a task
          </ListGroup.Item>
          <ListGroup.Item action>
            Leave group
          </ListGroup.Item>
          <ListGroup.Item action onClick={()=>console.log('button clicked')}>
            Group information
          </ListGroup.Item>
        </ListGroup>
      );
    }
  }

  return (
    <>
      <Accordion>
        {componentList}
      </Accordion>
      <div className="modal">
        <Modal show={showAddTask} onHide={handleCloseAddTask}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  autoFocus
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Example textarea</Form.Label>
                <Form.Control as="textarea" rows={3} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddTask}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCloseAddTask}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
}

// the control buttons of the group list
// different methods based on role: 1) group member; 2) group leader; 3) collaborator


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