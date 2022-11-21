import {Navigate} from "react-router-dom";
import React, { useEffect, useState } from 'react';
import Unknown from '../imgs/unknown.png';
import './Profile.css';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from "axios";
import GroupInfoModal from "../components/GroupInfoModal";
import ChangeProfileModal from "../components/ChangeProfileModal";

const homeurl = 'http://localhost:4000/api'

function Profile() {
  const email = localStorage.getItem("email");
  const userString = localStorage.getItem("user");
  const userJSON = JSON.parse(userString || "");
  const [group, setGroup] = useState([]);
  const [clickedGroup, setClickedGroup] = useState({});
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showChangeProfile, setShowChangeProfile] = useState(false);
  const handleCloseGroupInfo = () => setShowGroupInfo(false);
  useEffect(()=>{
      axios({
          method: "get",
          url: `${homeurl}/groups?where={"_id": {"$in": ${JSON.stringify(userJSON.belongingGroups)}}}`
      }).then(r => {
          setGroup(r.data.data);
      });
  },[])

  if (email == null || email == ""){
      return <Navigate replace to="/login" />
  }
  return (
    <>
        <div className="profile-container">
            <div className="figure-container">
                <div><img src={Unknown}/></div>
                <div><h2>{userJSON.name}</h2></div>
                <div className="profile-email">{userJSON.email}</div>
                <Button variant="secondary" size="lg" onClick={() => setShowChangeProfile(true)}>
                    edit profile
                </Button>
            </div>
            <div className="info-container">
                <div><h3>Your Groups</h3></div>
                {group.length > 0 &&
                    <ListGroup>
                        {group.map((g:any, index) => <ListGroup.Item action key={index} onClick={() => {
                            setShowGroupInfo(true);
                            setClickedGroup(group[index]);
                            console.log(group[index]);
                        }}>{g.name}</ListGroup.Item>)}
                    </ListGroup>
                }
                <div><h3>Personal Description</h3></div>
                {!userJSON.description &&
                    <div>
                        You have not add any personal description, you can add it by clicking "edit profile" on the left.
                    </div>
                }
            </div>
        </div>
        <div className="modal">
            <GroupInfoModal show={showGroupInfo} handleCloseGroupInfo={handleCloseGroupInfo} data={clickedGroup}/>
            <ChangeProfileModal show={showChangeProfile} handleClose={()=>setShowChangeProfile(false)} data={userJSON}/>
        </div>
    </>
  );
};
  
export default Profile;