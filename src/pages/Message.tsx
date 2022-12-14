import {useEffect, useState} from 'react';
import {Navigate} from "react-router-dom";
import ListGroup from 'react-bootstrap/ListGroup';
import axios from "axios";
import GroupInvitationModal from "../components/GroupInvitationModal";
import TaskInfoModal from "../components/TaskInfoModal";
import './Message.css';
import chatbot from '../imgs/chatbot.png';
import a from '../imgs/a.png';
import b from '../imgs/b.png';
import c from '../imgs/c.png';
import d from '../imgs/d.png';
import e from '../imgs/e.png';
import f from '../imgs/f.png';
import g from '../imgs/g.png';
import h from '../imgs/h.png';
import i from '../imgs/i.png';
import j from '../imgs/j.png';
import k from '../imgs/k.png';
import l from '../imgs/l.png';
import m from '../imgs/m.png';
import n from '../imgs/n.png';
import o from '../imgs/o.png';
import p from '../imgs/p.png';
import q from '../imgs/q.png';
import r from '../imgs/r.png';
import s from '../imgs/s.png';
import t from '../imgs/t.png';
import u from '../imgs/u.png';
import v from '../imgs/v.png';
import w from '../imgs/w.png';
import x from '../imgs/x.png';
import y from '../imgs/y.png';
import z from '../imgs/z.png';
const homeurl = 'https://grouptodos.herokuapp.com/api'
const imgs = [a, b, c, d, e, f, g ,h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z];
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

  useEffect(() => {
    for (let i = 0; i < invitingGroupInfo.length; i++) {
      // @ts-ignore
      const memberId = invitingGroupInfo[i].leaders[0];
      if (memberId) {
        axios({
          method: "get",
          url: `${homeurl}/users/${memberId}`
        }).then((r) => {
          if (r.data.data[0].image) {
            const img = document.getElementById(`invite-group-member-${i}`);
            if (img) {
              img.setAttribute('src', `data:image/jpeg;base64,${r.data.data[0].image}`)
            }
          }
        })
      }
    }
  }, [invitingGroupInfo]);

  useEffect(() => {
    for (let i = 0; i < invitingLeadingGroupInfo.length; i++) {
      // @ts-ignore
      const leaderId = invitingLeadingGroupInfo[i].leaders[0];
      if (leaderId) {
        axios({
          method: "get",
          url: `${homeurl}/users/${leaderId}`
        }).then((r) => {
          if (r.data.data[0].image) {
            const img = document.getElementById(`invite-group-leader-${i}`);
            if (img) {
              img.setAttribute('src', `data:image/jpeg;base64,${r.data.data[0].image}`)
            }
          }
        })
      }
    }
  }, [invitingLeadingGroupInfo]);

  useEffect(() => {
    for (let i = 0; i < unreadTaskInfo.length; i++) {
      // @ts-ignore
      const charIndex = unreadTaskInfo[i].name.toLowerCase().charCodeAt(0)-'a'.charCodeAt(0);
      if (charIndex >= 0 && charIndex < 26) {
        const img = document.getElementById(`unread-task-${i}`);
        if (img) {
          img.setAttribute('src', imgs[charIndex])
        }
      }
    }
  }, [unreadTaskInfo])

  if (email == null || email === ""){
      return <Navigate replace to="/login" />
  }

  return (
    <>
      {/*<div className='page-title'><img src={MessageBox}/>Incoming Messages</div>*/}
      <div className='message-box'>
        {unreadTaskInfo.length > 0 &&
            <ListGroup>
              {unreadTaskInfo.map((t:any, index) => <ListGroup.Item className="d-flex justify-content-between align-items-start" action key={index} onClick={() => {
                setShowTaskInfo(true);
                setClickedTask(unreadTaskInfo[index]);
              }}>
                <div className="ms-2 me-auto messages">
                  <div className='chatbot-container'>
                    <img src={chatbot} id={`unread-task-${index}`}/>
                  </div>
                  <div>
                    <div className="fw-bold message-title">Group Task - {t.name}</div>
                    <div className="message-contents">{t.description}</div>
                  </div>
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
                  <div className='chatbot-container'>
                    <img src={chatbot} id={`invite-group-member-${index}`}/>
                  </div>
                  <div>
                    <div className="fw-bold message-title">Invitation (Member) - {g.name}</div>
                    <div className="message-contents">{g.description}</div>
                  </div>
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
                  <div className='chatbot-container'>
                    <img src={chatbot} id={`invite-group-leader-${index}`}/>
                  </div>
                  <div>
                    <div className="fw-bold message-title">Invitation (Leader) - {g.name}</div>
                    <div className="message-contents">{g.description}</div>
                  </div>
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