import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import React, {useEffect, useState} from "react";
import axios from "axios";
import UserInfoModal from "./UserInfoModal";
const homeurl = 'https://grouptodos.herokuapp.com/api'

export default function GroupInfoModal(props: any) {
    const [leaderNames, setLeaderNames]: any = useState([]);
    const [memberNames, setMemberNames] = useState([]);
    const [pendingLeaderNames, setPendingLeaderNames] = useState([]);
    const [pendingMemberNames, setPendingMemberNames] = useState([]);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [clickedUserId, setClickedUserId] = useState("");
    const data = props.data;
    const [showMySelf, setShowMySelf] = useState(props.show);

    useEffect(() => {
        /* Only run the function is props.show is true */
        setShowMySelf(props.show);
        if (props.show === true) {
            if (data.leaders && data.leaders.length > 0) {
                axios({
                    method: "get",
                    url: `${homeurl}/users?where={"_id": {"$in": ${JSON.stringify(data.leaders)}}}&select={"name": 1, "_id": 1}`
                }).then((r) => {
                    setLeaderNames(r.data.data);
                })
            }
            if (data.members && data.members.length > 0) {
                axios({
                    method: "get",
                    url: `${homeurl}/users?where={"_id": {"$in": ${JSON.stringify(data.members)}}}&select={"name": 1, "_id": 1}`
                }).then((r) => {
                    setMemberNames(r.data.data);
                })
            }
            if (data.pendingLeaders && data.pendingLeaders.length > 0) {
                axios({
                    method: "get",
                    url: `${homeurl}/users?where={"_id": {"$in": ${JSON.stringify(data.pendingLeaders)}}}&select={"name": 1, "_id": 1}`
                }).then((r) => {
                    setPendingLeaderNames(r.data.data);
                })
            }
            if (data.pendingMembers && data.pendingMembers.length > 0) {
                axios({
                    method: "get",
                    url: `${homeurl}/users?where={"_id": {"$in": ${JSON.stringify(data.pendingMembers)}}}&select={"name": 1, "_id": 1}`
                }).then((r) => {
                    setPendingMemberNames(r.data.data);
                })
            }
        }
    }, [props.show])

    return (<>
        <Modal show={showMySelf} onHide={props.handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Group Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Group Name</Form.Label>
                    <ListGroup>
                        <ListGroup.Item>
                            {data.name}
                        </ListGroup.Item>
                    </ListGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Group Description</Form.Label>
                    <ListGroup>
                        <ListGroup.Item>
                            {data.description}
                        </ListGroup.Item>
                    </ListGroup>
                </Form.Group>

                {data.leaders && data.leaders.length > 0 &&
                    <Form.Group className="mb-3">
                        <Form.Label>Group Leader(s)</Form.Label>
                        <ListGroup>
                            {leaderNames.map((leader:any, index:number) =>
                                <ListGroup.Item key={index}
                                   onClick={()=>{
                                        setShowMySelf(false);
                                        setShowUserInfo(true);
                                        setClickedUserId(leader._id);
                                   }}
                                >
                                    {leader.name}
                                </ListGroup.Item>)}
                        </ListGroup>
                    </Form.Group>
                }

                {data.members && data.members.length > 0 &&
                    <Form.Group className="mb-3">
                        <Form.Label>Group Member(s)</Form.Label>
                        <ListGroup>
                            {memberNames.map((member:any, index:number) =>
                                <ListGroup.Item key={index}
                                    onClick={()=>{
                                        setShowMySelf(false);
                                        setShowUserInfo(true);
                                        setClickedUserId(member._id);
                                    }}
                                >
                                    {member.name}
                                </ListGroup.Item>)}
                        </ListGroup>
                    </Form.Group>
                }

                {data.pendingLeaders && data.pendingLeaders.length > 0 &&
                    <Form.Group className="mb-3">
                        <Form.Label>Group Pending Leader(s)</Form.Label>
                        <ListGroup>
                            {pendingLeaderNames.map((leader:any, index:number) =>
                                <ListGroup.Item key={index}
                                    onClick={()=>{
                                        setShowMySelf(false);
                                        setShowUserInfo(true);
                                        setClickedUserId(leader._id);
                                    }}
                                >
                                    {leader.name}
                                </ListGroup.Item>)}
                        </ListGroup>
                    </Form.Group>
                }

                {data.pendingMembers && data.pendingMembers.length > 0 &&
                    <Form.Group className="mb-3">
                        <Form.Label>Group Pending Member(s)</Form.Label>
                        <ListGroup>
                            {pendingMemberNames.map((member:any, index:number) =>
                                <ListGroup.Item key={index}
                                    onClick={()=>{
                                        setShowMySelf(false);
                                        setShowUserInfo(true);
                                        setClickedUserId(member._id);
                                    }}
                                >
                                    {member.name}
                                </ListGroup.Item>)}
                        </ListGroup>
                    </Form.Group>
                }
            </Form>
        </Modal.Body>
    </Modal>
    <UserInfoModal show={showUserInfo} handleClose={()=>{setShowUserInfo(false); setShowMySelf(true)}} id={clickedUserId}/>
    </>
    )
}