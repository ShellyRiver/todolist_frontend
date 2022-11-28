import React, { useEffect, useState } from 'react';
import {Navigate} from "react-router-dom";
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import GroupInvitationModal from "../components/GroupInvitationModal";
import TaskInfoModal from "../components/TaskInfoModal";
const homeurl = 'http://localhost:4000/api'

let messages = ["message1", "message2", "message3"];

function Message() {

  const email = localStorage.getItem("email");
  const [invitingGroupInfo, setInvitingGroupInfo] = useState([]);
  const [invitingLeadingGroupInfo, setInvitingLeadingGroupInfo] = useState([]);
  const [unreadTaskInfo, setUnreadTaskInfo] = useState([]);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showTaskInfo, setShowTaskInfo] = useState(false);
  const handleCloseGroupInfo = () => setShowGroupInfo(false);
  const handleCloseTaskInfo = () => setShowTaskInfo(false);
  const [clickedGroup, setClickedGroup] = useState({});
  const [clickedTask, setClickedTask] = useState({});
  const [groupRole, setGroupRole] = useState('member');
  const [reloadUser, setReloadUser] = useState(0);


  useEffect(() => {
    console.log("Inside use Effect");
    console.log(reloadUser);
    const userName = localStorage.getItem("user") || "";
    const userJSON = JSON.parse(userName);
    if (userJSON.invitingGroups.length > 0) {
      axios({
        method: "get",
        url: `${homeurl}/groups?where={"_id": {"$in": ${JSON.stringify(userJSON.invitingGroups)}}}`
      }).then((response) => {
        setInvitingGroupInfo(response.data.data);
      })
    }
    if (userJSON.invitingLeadingGroups && userJSON.invitingLeadingGroups.length > 0) {
      axios({
        method: "get",
        url: `${homeurl}/groups?where={"_id": {"$in": ${JSON.stringify(userJSON.invitingLeadingGroups)}}}`
      }).then((response) => {
        setInvitingLeadingGroupInfo(response.data.data);
      })
    }
    if (userJSON.unreadTasks.length > 0) {
      axios({
        method: "get",
        url: `${homeurl}/tasks?where={"_id": {"$in": ${JSON.stringify(userJSON.unreadTasks)}}}`
      }).then((response) => {
        setUnreadTaskInfo(response.data.data);
      })
    }
  }, [reloadUser])  // TODO: add dependency?


  if (email == null || email == ""){
      return <Navigate replace to="/login" />
  }

  return (
    <>
      <h1>Incoming Messages</h1>
      {invitingGroupInfo.length > 0 &&
          <ListGroup>
            {invitingGroupInfo.map((g:any, index) => <ListGroup.Item action key={index} onClick={() => {
              setShowGroupInfo(true);
              setClickedGroup(invitingGroupInfo[index]);
              setGroupRole('member');
            }}><strong>New group invitation (Member):</strong> {g.name}</ListGroup.Item>)}
          </ListGroup>
      }
      {invitingLeadingGroupInfo.length > 0 &&
          <ListGroup>
            {invitingLeadingGroupInfo.map((g:any, index) => <ListGroup.Item action key={index} onClick={() => {
              setShowGroupInfo(true);
              setClickedGroup(invitingLeadingGroupInfo[index]);
              setGroupRole('leader');
            }}><strong>New group invitation (Leader):</strong> {g.name}</ListGroup.Item>)}
          </ListGroup>
      }
      {invitingLeadingGroupInfo.length > 0 &&
          <ListGroup>
            {invitingGroupInfo.map((g:any, index) => <ListGroup.Item action key={index} onClick={() => {
              setShowGroupInfo(true);
              setClickedGroup(invitingGroupInfo[index]);
            }}><strong>New group invitation:</strong> {g.name}</ListGroup.Item>)}
          </ListGroup>
      }
      {unreadTaskInfo.length > 0 &&
          <ListGroup>
            {unreadTaskInfo.map((t:any, index) => <ListGroup.Item action key={index} onClick={() => {
              setShowTaskInfo(true);
              setClickedTask(unreadTaskInfo[index]);
            }}><strong>New group task:</strong> {t.name}</ListGroup.Item>)}
          </ListGroup>
      }
      <GroupInvitationModal show={showGroupInfo} handleClose={handleCloseGroupInfo} data={clickedGroup} role={groupRole} handleReload={()=>setReloadUser((user)=>{return user+1;})}/>
      <TaskInfoModal show={showTaskInfo} handleClose={handleCloseTaskInfo} data={clickedTask} handleReload={()=>setReloadUser((user)=>{return user+1;})}/>
    </>
  );
};
  
export default Message;