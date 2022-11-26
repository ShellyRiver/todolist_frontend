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
import {useAuthContext} from "../context/authContext";
import Auth from './Auth';
import {Navigate} from "react-router-dom";
import AddTaskModal from "../components/AddTaskModal";
import axios from "axios";
import AddTaskModalGroup from "../components/AddTaskModalGroup";
import GroupInfoModal from "../components/GroupInfoModal";

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

const homeurl = 'http://localhost:4000/api'
const groupNames: string[] = ["Personal tasks", "CS 409 Final Project"];

function Home() {
    const email = localStorage.getItem("email");
    if (email == null || email == ""){
        return <Navigate replace to="/login" />
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
                  <GroupList/>
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
    const [group, setGroup]: [any, any] = useState([]);
    const [clickedGroup, setClickedGroup] = useState({});
    const userString = localStorage.getItem("user");
    const userJSON = JSON.parse(userString || "");
    useEffect(()=>{
      axios({
        method: "get",
        url: `${homeurl}/groups?where={"_id": {"$in": ${JSON.stringify(userJSON.belongingGroups)}}}`
      }).then(r => {
        setGroup(r.data.data);
      });
    },[])
  const [componentList, setComponentList] = useState([]);

  const [showAddTask, setShowAddTask] = useState(false);
  const handleCloseAddTask = () => setShowAddTask(false);

  const [showAddTaskGroup, setShowAddTaskGroup] = useState(false);
  const handleCloseAddTaskGroup = () => setShowAddTaskGroup(false);

  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const handleCloseGroupInfo = () => setShowGroupInfo(false);

  const [showInviteGroupMember, setShowInviteGroupMember] = useState(false);
  const handleCloseInviteGroupMember = () => setShowInviteGroupMember(false);

  const [showInviteGroupCollaborator, setShowInviteGroupCollaborator] = useState(false);
  const handleCloseInviteGroupCollaborator = () => setShowInviteGroupCollaborator(false);

  const [showLeaveGroup, setShowLeaveGroup] = useState(false);
  const handleCloseLeaveGroup = () => setShowLeaveGroup(false);

  const [showDeleteGroup, setShowDeleteGroup] = useState(false);
  const handleCloseDeleteGroup = () => setShowDeleteGroup(false);

  const [groupId, setGroupId] = useState(""); /* 0: individual, 1: leader, 2: member */

  useEffect(() => {
    __updateComponent();
  }, [group])  // TODO: add dependency?


  function __updateComponent() {
    let newComponentList: any = [];
    newComponentList.push(
        <div className="groupItem" key={"individual"}>
          <Accordion.Item eventKey={"individual"}>
            <Accordion.Header>Individual Tasks</Accordion.Header>
            <Accordion.Body>
              {Buttons(INDIVIDUAL)}
            </Accordion.Body>
          </Accordion.Item>
        </div>
    );

    for (let i in group) {
      newComponentList.push(
        <div className="groupItem" key={i+"groupItem"}>
          <Accordion.Item eventKey={i}>
            <Accordion.Header>{group[i].name}</Accordion.Header>
            <Accordion.Body>
              {Buttons(2)}
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
          <ListGroup.Item action onClick={() => setShowGroupInfo(true)}>
            Group information
          </ListGroup.Item>
        </ListGroup>
      );
    }
    else if (role === GROUPLEADER) {
      return (
        <ListGroup>
          <ListGroup.Item action onClick={() => {
            setShowAddTaskGroup(true)

          }}>
            Add a task
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => setShowInviteGroupMember(true)}>
            Invite group member
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => setShowInviteGroupCollaborator(true)}>
            Invite collaborator
          </ListGroup.Item>
          <ListGroup.Item action onClick={()=>console.log('button clicked')}>
            Delete group member
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => setShowLeaveGroup(true)}>
            Leave group
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => setShowDeleteGroup(true)}>
            Delete group
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => setShowGroupInfo(true)}>
            Group information
          </ListGroup.Item>
        </ListGroup>
      );
    }
    else {  // collaborator
      return (
        <ListGroup>
          <ListGroup.Item action onClick={() => setShowAddTask(true)}>
            Add a task
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => setShowLeaveGroup(true)}>
            Leave group
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => setShowGroupInfo(true)}>
            Group information
          </ListGroup.Item>
        </ListGroup>
      );
    }
  }

  // TODO: load group tasks, load group members
  // TODO: leave a group, delete a group

  return (
    <>
      <Accordion onSelect={(eventKey:any)=>
      {try {
          setGroupId(group[eventKey]._id);
          setClickedGroup(group[eventKey]);
      }
      catch (e) {}
      }}>
        {componentList}
      </Accordion>
      <div className="modal">
        <AddTaskModal show={showAddTask} handleClose={handleCloseAddTask}/>
        <AddTaskModalGroup show={showAddTaskGroup} handleClose={handleCloseAddTaskGroup} groupId={groupId}/>
        <GroupInfoModal show={showGroupInfo} handleCloseGroupInfo={handleCloseGroupInfo} data={clickedGroup}/>
        {/*<Modal show={showGroupInfo} onHide={handleCloseGroupInfo}>*/}
        {/*  <Modal.Header closeButton>*/}
        {/*    <Modal.Title>Group Information</Modal.Title>*/}
        {/*  </Modal.Header>*/}
        {/*  <Modal.Body>*/}
        {/*    <Form>*/}

        {/*      <Form.Group className="mb-3">*/}
        {/*        <Form.Label>Group Leader</Form.Label>  */}
        {/*        <ListGroup>*/}
        {/*          <ListGroup.Item>*/}
        {/*            Shilan He*/}
        {/*          </ListGroup.Item>*/}
        {/*        </ListGroup>*/}
        {/*      </Form.Group>*/}

        {/*      <Form.Group className="mb-3">*/}
        {/*        <Form.Label>Group Collaborator(s)</Form.Label>  */}
        {/*        <ListGroup>*/}
        {/*          <ListGroup.Item>*/}
        {/*            Zilinghan Li*/}
        {/*          </ListGroup.Item>*/}
        {/*        </ListGroup>*/}
        {/*      </Form.Group>*/}

        {/*      <Form.Group className="mb-3">*/}
        {/*        <Form.Label>Group Members</Form.Label>*/}
        {/*        <ListGroup>*/}
        {/*          <ListGroup.Item action>*/}
        {/*            Member 1*/}
        {/*          </ListGroup.Item>*/}
        {/*          <ListGroup.Item action>*/}
        {/*            Member 2*/}
        {/*          </ListGroup.Item>*/}
        {/*          <ListGroup.Item action>*/}
        {/*            Member 3*/}
        {/*          </ListGroup.Item>*/}
        {/*        </ListGroup>*/}
        {/*      </Form.Group>*/}

        {/*      <Form.Group className="mb-3">*/}
        {/*        <Form.Label>Group Tasks</Form.Label>  */}
        {/*        <ListGroup>*/}
        {/*          <ListGroup.Item action>*/}
        {/*            Task 1*/}
        {/*          </ListGroup.Item>*/}
        {/*          <ListGroup.Item action>*/}
        {/*            Task 2*/}
        {/*          </ListGroup.Item>*/}
        {/*          <ListGroup.Item action>*/}
        {/*            Task 3*/}
        {/*          </ListGroup.Item>*/}
        {/*        </ListGroup>*/}
        {/*      </Form.Group>*/}
        {/*      */}
        {/*    </Form>*/}
        {/*  </Modal.Body>*/}
        {/*</Modal>*/}
        <Modal show={showInviteGroupMember} onHide={handleCloseInviteGroupMember}>
          <Modal.Header closeButton>
            <Modal.Title>Invite Group Member</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="example@email"
                  autoFocus
                />
                <Button variant="primary">
                  Send invitation
                </Button>
              </Form.Group>
              <Form.Group>
                <Form.Label className="mb-3">Group Members</Form.Label>
                <ListGroup>
                  <ListGroup.Item action>
                    Member 1
                  </ListGroup.Item>
                  <ListGroup.Item action>
                    Member 2
                  </ListGroup.Item>
                  <ListGroup.Item action>
                    Member 3
                  </ListGroup.Item>
                </ListGroup>
              </Form.Group>
            </Form>
          </Modal.Body>
        </Modal>
        <Modal show={showInviteGroupCollaborator} onHide={handleCloseInviteGroupCollaborator}>
          <Modal.Header closeButton>
            <Modal.Title>Invite Group Collaborator</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="example@email"
                  autoFocus
                />
                <Button variant="primary">
                  Send invitation
                </Button>
              </Form.Group>
              <Form.Group>
                <Form.Label className="mb-3">Group Collaborators</Form.Label>
                <ListGroup>
                  <ListGroup.Item action>
                    Member 1
                  </ListGroup.Item>
                </ListGroup>
              </Form.Group>
            </Form>
          </Modal.Body>
        </Modal>
        <Modal show={showLeaveGroup} onHide={handleCloseLeaveGroup}>
          <Modal.Header closeButton>
            <Modal.Title>Leave Group</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure to leave this group?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseLeaveGroup}>
              Cancel
            </Button>
            <Button variant="primary">
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showDeleteGroup} onHide={handleCloseDeleteGroup}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Group</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure to delete this group?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteGroup}>
              Cancel
            </Button>
            <Button variant="primary">
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    </>
  )
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