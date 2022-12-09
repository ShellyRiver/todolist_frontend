import React, { useEffect, useState } from 'react';
import {Navigate} from "react-router-dom";
import ListGroup from 'react-bootstrap/ListGroup';
import axios from "axios";
import GroupInvitationModal from "../components/GroupInvitationModal";
import TaskInfoModal from "../components/TaskInfoModal";
import './Message.css';
import MessageBox from '../imgs/inbox.png';
const homeurl = 'https://grouptodos.herokuapp.com/api'

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
    const userName = localStorage.getItem("user") || "";
    const userJSON = JSON.parse(userName);
    if (userJSON) {
      if (userJSON.invitingGroups.length > 0) {
        axios({
          method: "get",
          url: `${homeurl}/groups?where={"_id": {"$in": ${JSON.stringify(userJSON.invitingGroups)}}}`
        }).then((response) => {
          setInvitingGroupInfo(response.data.data);
        })
      } else {
        setInvitingGroupInfo([]);
      }
      if (userJSON.invitingLeadingGroups && userJSON.invitingLeadingGroups.length > 0) {
        axios({
          method: "get",
          url: `${homeurl}/groups?where={"_id": {"$in": ${JSON.stringify(userJSON.invitingLeadingGroups)}}}`
        }).then((response) => {
          setInvitingLeadingGroupInfo(response.data.data);
        })
      } else {
        setInvitingLeadingGroupInfo([]);
      }
      if (userJSON.unreadTasks.length > 0) {
        axios({
          method: "get",
          url: `${homeurl}/tasks?where={"_id": {"$in": ${JSON.stringify(userJSON.unreadTasks)}}}`
        }).then((response) => {
          setUnreadTaskInfo(response.data.data);
        })
      } else {
        setUnreadTaskInfo([]);
      }
    }
  }, [reloadUser])  // TODO: add dependency?


  if (email == null || email == ""){
      return <Navigate replace to="/login" />
  }

  return (
    <>
      <div className='page-title'><img src={MessageBox}/>Incoming Messages</div>
      <div className='message-box'>
        {unreadTaskInfo.length > 0 &&
            <ListGroup>
              {unreadTaskInfo.map((t:any, index) => <ListGroup.Item className="d-flex justify-content-between align-items-start" action key={index} onClick={() => {
                setShowTaskInfo(true);
                setClickedTask(unreadTaskInfo[index]);
              }}>
                <div className="ms-2 me-auto messages">
                  <div className="fw-bold">New Group Task</div>
                  {t.name}: {t.description}
                </div>
              </ListGroup.Item>)}
            </ListGroup>
        }
        {invitingGroupInfo.length > 0 &&
            <ListGroup>
              {invitingGroupInfo.map((g:any, index) => <ListGroup.Item action key={index} onClick={() => {
                setShowGroupInfo(true);
                setClickedGroup(invitingGroupInfo[index]);
                setGroupRole('member');
              }}>
                <div className="ms-2 me-auto messages">
                  <div className="fw-bold">New group invitation (Member)</div>
                  {g.name}: {g.description}
                </div>
              </ListGroup.Item>)}
            </ListGroup>
        }
        {invitingLeadingGroupInfo.length > 0 &&
            <ListGroup>
              {invitingLeadingGroupInfo.map((g:any, index) => <ListGroup.Item action key={index} onClick={() => {
                setShowGroupInfo(true);
                setClickedGroup(invitingLeadingGroupInfo[index]);
                setGroupRole('leader');
              }}>
                <div className="ms-2 me-auto messages">
                  <div className="fw-bold">New group invitation (Leader)</div>
                  {g.name}: {g.description}
                </div>
              </ListGroup.Item>)}
            </ListGroup>
        }
      </div>
      <GroupInvitationModal show={showGroupInfo} handleClose={handleCloseGroupInfo} data={clickedGroup} role={groupRole} handleReload={()=>setReloadUser((user)=>{return user+1;})}/>
      <TaskInfoModal show={showTaskInfo} handleClose={handleCloseTaskInfo} data={clickedTask} handleReload={()=>setReloadUser((user)=>{return user+1;})}/>
    </>
  );
};
  
export default Message;