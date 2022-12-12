import './Home.css'
import axios from "axios";
import add from '../imgs/add.png';
import { Outlet, Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import React, { useEffect } from 'react';
import {useState} from 'react';
import {Offcanvas} from "react-bootstrap";
import {Navigate} from "react-router-dom";
import AddTaskModal from "../components/AddTaskModal";
import AddTaskModalGroup from "../components/AddTaskModalGroup";
import GroupInfoModal from "../components/GroupInfoModal";
import InviteCollaboratorModal from "../components/InviteCollaboratorModal";
import ConfirmationModal from "../components/ConfirmationModal";
import AddGroupModal from "../components/AddGroupModal";
import ChangeGroupModal from "../components/ChangeGroupModal";
import HandleDeleteGroup from "../methods/HandleDeleteGroup";
import HandleMemberLeaveGroup from "../methods/HandleMemberLeaveGroup";
import HandleLeaderLeaveGroup from "../methods/HandleLeaderLeaveGroup";
import DeleteGroupMemberModal from "../components/DeleteGroupMemberModal";
import Monthly from './home/Monthly';

// different methods to manipulate a group based on the role
// 4 roles in a group:
// 0 - individual: the individual tasks group, this is the default group where there is only the user him/herself
// 1 - gourp member: can leave a group
// 2 - group leader: can create and assign tasks, delete a group, leave a group and assign new leader/collaborator
const INDIVIDUAL: number = 0;
const GROUPMEMBER: number = 1;
const GROUPLEADER: number = 2;

const homeurl = 'https://grouptodos.herokuapp.com/api'

function Home() {
    const email = localStorage.getItem("email");
    const [showCanvas, setShowCanvas] = useState(false);
    const [refreshCalendar, setRefreshCalendar] = useState(false);
    if (email == null || email == ""){
        return <Navigate replace to="/login" />
    }
    else{
        return (
            <>
                {/*<h1>Home</h1>*/}
                <div className="home">
                      <div className="show-my-group-container">
                            {/*<Navigator />*/}
                              <Container className="navContainer my-groups-container">
                                  <Nav className="me-auto my-groups">
                                      <Nav.Link onClick={()=>setShowCanvas(true)}> My Groups</Nav.Link>
                                  </Nav>
                              </Container>
                      </div>
                      <div className="content">
                            <div className="groupList">
                                <GroupList setRefreshCalender={()=>setRefreshCalendar((val)=>{return !val;})}/>
                            </div>
                            <div className="taskBoard">
                                <Monthly refresh={refreshCalendar}/>
                            </div>
                      </div>
                </div>
                <Offcanvas show={showCanvas} onHide={()=>setShowCanvas(false)}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>My Groups</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <GroupList setRefreshCalender={()=>setRefreshCalendar((val)=>{return !val;})}/>
                    </Offcanvas.Body>
                </Offcanvas>
            </>
        );
    }
};

// the group list on the left
function GroupList(props: any) {
    const [group, setGroup]: [any, any] = useState([]);
    const [clickedGroup, setClickedGroup] = useState({});
    const [leadingGroup, setLeadingGroup]: [any, any] = useState([]);
    const [clickedLeadingGroup, setClickedLeadingGroup] = useState({});

    const [componentList, setComponentList] = useState([]);

    const [showAddTask, setShowAddTask] = useState(false);
    const handleCloseAddTask = () => {setShowAddTask(false); props.setRefreshCalender();}

    const [showAddGroup, setShowAddGroup] = useState(false);
    const handleCloseAddGroup = () => setShowAddGroup(false);

    const [showAddTaskGroup, setShowAddTaskGroup] = useState(false);
    const handleCloseAddTaskGroup = () => {setShowAddTaskGroup(false); props.setRefreshCalender();}

    const [showGroupInfo, setShowGroupInfo] = useState(false);
    const handleCloseGroupInfo = () => setShowGroupInfo(false);

    const [showLeadingGroupInfo, setShowLeadingGroupInfo] = useState(false);
    const handleCloseLeadingGroupInfo = () => setShowLeadingGroupInfo(false);

    const [showEditGroupInfo, setShowEditGroupInfo] = useState(false);
    const handleCloseEditGroupInfo = () => setShowEditGroupInfo(false);

    const [showInviteCollaborator, setShowInviteCollaborator] = useState(false);
    const handleCloseInviteCollaborator = () => setShowInviteCollaborator(false);

    const [showLeaveGroup, setShowLeaveGroup] = useState(false);
    const handleCloseLeaveGroup = () => {setShowLeaveGroup(false); props.setRefreshCalender();};

    const [showLeaderLeaveGroup, setShowLeaderLeaveGroup] = useState(false);
    const handleCloseLeaderLeaveGroup = () => {setShowLeaderLeaveGroup(false); props.setRefreshCalender();}

    const [showDeleteGroup, setShowDeleteGroup] = useState(false);
    const handleCloseDeleteGroup = () => {setShowDeleteGroup(false); props.setRefreshCalender();}

    const [showDeleteMember, setShowDeleteMember] = useState(false);
    const handleCloseDeleteMember = () => setShowDeleteMember(false);

    const [groupId, setGroupId] = useState("");

    const [leadingGroupId, setLeadingGroupId] = useState("");

    const [reloadGroup, setReloadGroup] = useState(0);

    const [groupIndex, setGroupIndex] = useState(-1);

    const [leadingGroupIndex, setLeadingGroupIndex] = useState(-1);

    useEffect(()=>{
        // console.log(`Inside useEffect: ${reloadGroup}`)
        const userString = localStorage.getItem("user");
        // console.log(userString);
        const userJSON = JSON.parse(userString || "");
        if (userJSON.belongingGroups && userJSON.belongingGroups.length > 0) {
            axios({
                method: "get",
                url: `${homeurl}/groups?where={"_id": {"$in": ${JSON.stringify(userJSON.belongingGroups)}}}`
            }).then(r => {
                setGroup(r.data.data);
                if (groupIndex >= 0) {
                    setClickedGroup(r.data.data[groupIndex]);
                    setGroupId(r.data.data[groupIndex]._id);
                }
            });
        }
        else {
            setGroup([]);
            setClickedGroup({});
        }
        if (userJSON.leadingGroups && userJSON.leadingGroups.length > 0) {
            axios({
                method: "get",
                url: `${homeurl}/groups?where={"_id": {"$in": ${JSON.stringify(userJSON.leadingGroups)}}}`
            }).then(r => {
                // console.log(r);
                setLeadingGroup(r.data.data);
                // console.log(r.data.data);
                if (leadingGroupIndex >= 0 && leadingGroupIndex < r.data.data.length) {
                    // console.log(leadingGroupIndex);
                    if (leadingGroupIndex === r.data.data.length) {
                        setGroupIndex(0);
                        setClickedGroup(group[0]);
                        setGroupId(group[0]._id);
                        setLeadingGroupIndex(-1);
                        setClickedLeadingGroup({});
                        setLeadingGroupId("");
                    }
                    else {
                        setClickedLeadingGroup(r.data.data[leadingGroupIndex]);
                        setLeadingGroupId(r.data.data[leadingGroupIndex]._id);
                    }
                }
                else {
                    setClickedLeadingGroup({});
                    setLeadingGroupIndex(-1);
                    setLeadingGroupId("");
                }
            });
        }
        else {
            setLeadingGroup([]);
            setClickedLeadingGroup({});
            setLeadingGroupId("");
        }
    },[reloadGroup])

    useEffect(() => {
        __updateComponent();
    }, [group, leadingGroup])  // TODO: add dependency?

    function __updateComponent() {
        let newComponentList: any = [];
        /* Individual tasks */
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
        /* User Leading Groups */
        for (let i in leadingGroup) {
            newComponentList.push(
                <div className="groupItem" key={i+"leadingGroupItem"}>
                    <Accordion.Item eventKey={i}>
                        <Accordion.Header>{leadingGroup[i].name}</Accordion.Header>
                        <Accordion.Body>
                            {Buttons(GROUPLEADER)}
                        </Accordion.Body>
                    </Accordion.Item>
                </div>
            );
        }
        /* User Belonging Groups */
        for (let i in group) {
            newComponentList.push(
                <div className="groupItem" key={i+"groupItem"}>
                    <Accordion.Item eventKey={String(Number(i)+Number(leadingGroup.length))}>
                        <Accordion.Header>{group[i].name}</Accordion.Header>
                        <Accordion.Body>
                            {Buttons(GROUPMEMBER)}
                        </Accordion.Body>
                    </Accordion.Item>
                </div>
            );
        }
        // /* Test check box */
        // newComponentList.push(
        //     <div className="groupItem">
        //     <div className="groupItemTest">
        //         <Form.Check type="checkbox" label="Check me out" />
        //         <Accordion.Item eventKey={String(Number(100)+Number(leadingGroup.length))}>
        //             <Accordion.Header>ddd</Accordion.Header>
        //             <Accordion.Body>
        //                 fff
        //             </Accordion.Body>
        //         </Accordion.Item>
        //     </div>
        //     </div>
        // )

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
                    <ListGroup.Item action onClick={() => setShowLeaveGroup(true)}>
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
                    <ListGroup.Item action onClick={() => {setShowAddTaskGroup(true)}}>
                        Add a task
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => setShowInviteCollaborator(true)}>
                        Invite collaborator
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={()=> setShowDeleteMember(true)}>
                        Delete member
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => setShowLeaderLeaveGroup(true)}>
                        Leave group
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => setShowDeleteGroup(true)}>
                        Delete group
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => setShowLeadingGroupInfo(true)}>
                        Group information
                    </ListGroup.Item>
                    <ListGroup.Item action onClick={() => setShowEditGroupInfo(true)}>
                        Edit group
                    </ListGroup.Item>
                </ListGroup>
            );
        }
    }

    return (
        <>
            <Accordion onSelect={(eventKey:any)=>{
                try {
                    if (Number(eventKey) >= leadingGroup.length) {
                        setGroupId(group[Number(eventKey)-leadingGroup.length]._id);
                        setClickedGroup(group[Number(eventKey)-leadingGroup.length]);
                        setGroupIndex(Number(eventKey)-leadingGroup.length);
                        // console.log("Clicking the membership group");
                        // console.log(eventKey);
                    }
                    else {
                        setLeadingGroupId(leadingGroup[eventKey]._id);
                        setClickedLeadingGroup(leadingGroup[eventKey]);
                        setLeadingGroupIndex(eventKey);
                        // console.log("Clicking the leading group");
                    }
                }
                catch (e) {}
            }}>
                {componentList}
                <div className="groupItem" key={"addNewGroup"}>
                    <Card>
                        <Card.Header onClick={()=>setShowAddGroup(true)} style={{cursor: 'pointer'}}>
                            <img src={add}/>&nbsp;Create Group
                        </Card.Header>
                    </Card>
                </div>
            </Accordion>
            <div className="modal">
                <AddTaskModal show={showAddTask} handleClose={handleCloseAddTask}/>
                <AddGroupModal show={showAddGroup} handleClose={handleCloseAddGroup} setReload={()=>setReloadGroup((counter)=>{return counter+1;})}/>
                <AddTaskModalGroup show={showAddTaskGroup} handleClose={handleCloseAddTaskGroup} groupId={leadingGroupId} setReload={()=>setReloadGroup((counter)=>{return counter+1;})}/>
                <GroupInfoModal show={showGroupInfo} handleClose={handleCloseGroupInfo} data={clickedGroup}/>
                <GroupInfoModal show={showLeadingGroupInfo} handleClose={handleCloseLeadingGroupInfo} data={clickedLeadingGroup}/>
                <InviteCollaboratorModal show={showInviteCollaborator} handleClose={handleCloseInviteCollaborator} data={clickedLeadingGroup} groupId={leadingGroupId} setReload={()=>setReloadGroup((counter)=>{return counter+1;})}/>
                <ChangeGroupModal show={showEditGroupInfo} handleClose={handleCloseEditGroupInfo} data={clickedLeadingGroup} setReload={()=>setReloadGroup((counter)=>{return counter+1;})}/>
                <ConfirmationModal show={showDeleteGroup} title="Delete Group" body="Are you sure to delete this group?" handleClose={handleCloseDeleteGroup} handleConfirm={()=>HandleDeleteGroup(leadingGroupId)} setReload={()=>setReloadGroup((counter)=>{return counter+1;})}/>
                <ConfirmationModal show={showLeaveGroup} title="Leave Group (Member)" body="Are you sure to leave this group?" handleClose={handleCloseLeaveGroup} handleConfirm={()=>HandleMemberLeaveGroup(groupId)} setReload={()=>setReloadGroup((counter)=>{return counter+1;})}/>
                <ConfirmationModal show={showLeaderLeaveGroup} title="Leave Group (Leader)" body={"Are you sure to leave this group? If you are the only leader of the group, the whole group will be delete!"} handleClose={handleCloseLeaderLeaveGroup} handleConfirm={()=>HandleLeaderLeaveGroup(leadingGroupId, clickedLeadingGroup)} setReload={()=>setReloadGroup((counter)=>{return counter+1;})}/>
                <DeleteGroupMemberModal show={showDeleteMember} handleClose={handleCloseDeleteMember} groupId={leadingGroupId} data={clickedLeadingGroup} setReload={()=>setReloadGroup((counter)=>{return counter+1;})}/>
            </div>
        </>
    )
}

export default Home;