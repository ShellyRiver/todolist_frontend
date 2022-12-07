import {Navigate} from "react-router-dom";
import React, { useEffect, useState } from 'react';
import Unknown from '../imgs/unknown.png';
import './Profile.css';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from "axios";
import GroupInfoModal from "../components/GroupInfoModal";
import ChangeProfileModal from "../components/ChangeProfileModal";
import ChangeImageModal from "../components/ChangeImageModal";
import Form from "react-bootstrap/Form";

const homeurl = 'https://grouptodos.herokuapp.com/api'

function Profile() {
  const email = localStorage.getItem("email");
  var userString = localStorage.getItem("user");
  var userJSON = JSON.parse(userString || "");
  const [group, setGroup] = useState([]);
  const [leadingGroup, setLeadingGroup] = useState([]);
  const [clickedGroup, setClickedGroup] = useState({});
  const [clickedLeadingGroup, setClickedLeadingGroup] = useState({});
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showLeadingGroupInfo, setShowLeadingGroupInfo] = useState(false);
  const [showChangeProfile, setShowChangeProfile] = useState(false);
  const [showChangeImage, setShowChangeImage] = useState(false);
  const [reloadUser, setReloadUser] = useState(0);
  const handleCloseGroupInfo = () => setShowGroupInfo(false);
  const handleCloseLeadingGroupInfo = () => setShowLeadingGroupInfo(false);
  var imageURL;

  useEffect(()=>{
      userString = localStorage.getItem("user");
      userJSON = JSON.parse(userString || "");
      if (userJSON.image) {
          imageURL = `data:image/jpeg;base64,${userJSON.image}`
          const img = document.getElementById('profile-image');
          // @ts-ignore
          img.setAttribute('src', imageURL);
      }
      else {
          const img = document.getElementById('profile-image');
          // @ts-ignore
          img.setAttribute('src', Unknown)
      }
      if (userJSON.belongingGroups && userJSON.belongingGroups.length > 0)
      axios({
          method: "get",
          url: `${homeurl}/groups?where={"_id": {"$in": ${JSON.stringify(userJSON.belongingGroups)}}}`
      }).then(r => {
          setGroup(r.data.data);
      });
      if (userJSON.leadingGroups && userJSON.leadingGroups.length > 0)
          axios({
              method: "get",
              url: `${homeurl}/groups?where={"_id": {"$in": ${JSON.stringify(userJSON.leadingGroups)}}}`
          }).then(r => {
              setLeadingGroup(r.data.data);
          });
  },[reloadUser])

  if (email == null || email == ""){
      return <Navigate replace to="/login" />
  }
  // @ts-ignore
    return (
    <>
        <div className="profile-container">
            <div className="figure-container">
                {/*<div><img src={Unknown} onClick={()=>setShowChangeImage(true)}/></div>*/}
                <div><img src="" onClick={()=>setShowChangeImage(true)} id="profile-image"/></div>
                <div><h2>{userJSON.name}</h2></div>
                <div className="profile-email">{userJSON.email}</div>
                <Button variant="secondary" size="lg" onClick={() => setShowChangeProfile(true)}>
                    edit profile
                </Button>
            </div>
            <div className="info-container">
                {leadingGroup.length > 0 &&
                    <>
                        <div><h3>Your Leading Groups</h3></div>
                        <ListGroup>
                            {leadingGroup.map((g:any, index) => <ListGroup.Item action key={index} onClick={() => {
                                setShowLeadingGroupInfo(true);
                                setClickedLeadingGroup(leadingGroup[index]);
                            }}>{g.name}</ListGroup.Item>)}
                        </ListGroup>
                    </>
                }
                {group.length > 0 &&
                    <>
                    <div><h3>Your Belonging Groups</h3></div>
                    <ListGroup>
                        {group.map((g:any, index) => <ListGroup.Item action key={index} onClick={() => {
                            setShowGroupInfo(true);
                            setClickedGroup(group[index]);
                        }}>{g.name}</ListGroup.Item>)}
                    </ListGroup>
                    </>
                }
                <div><h3>Personal Description</h3></div>
                {!userJSON.description &&
                    <div>
                        You have not add any personal description, you can add it by clicking "edit profile" on the left.
                    </div>
                }
                {userJSON.description &&
                    <div>{userJSON.description}</div>
                }
            </div>
        </div>
        <div className="modal">
            <GroupInfoModal show={showGroupInfo} handleClose={handleCloseGroupInfo} data={clickedGroup}/>
            <GroupInfoModal show={showLeadingGroupInfo} handleClose={handleCloseLeadingGroupInfo} data={clickedLeadingGroup} />
            <ChangeProfileModal show={showChangeProfile} handleClose={()=>setShowChangeProfile(false)} data={userJSON}/>
            <ChangeImageModal show={showChangeImage} handleClose={()=>setShowChangeImage(false)} data={userJSON} setReload={()=>setReloadUser((counter)=>{return counter+1;})}/>
        </div>
    </>
  );
};
  
export default Profile;