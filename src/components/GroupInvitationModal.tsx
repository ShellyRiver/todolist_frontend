import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import React, {useEffect, useState} from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import ConfirmationModal from "./ConfirmationModal";
import {updateUser} from "./updateUser";
const homeurl = 'https://grouptodos.herokuapp.com/api'

export default function GroupInvitationModal(props: any) {
    const [leaderNames, setLeaderNames]: any = useState([]);
    const [memberNames, setMemberNames] = useState([]);
    const [showDecline, setShowDecline] = useState(false);
    const [showAccept, setShowAccept] = useState(false);
    const [showMySelf, setShowMySelf] = useState(props.show);
    const closeDeclineConfirm = () => {setShowDecline(false); setShowMySelf(true)};
    const closeAcceptConfirm = () => {setShowAccept(false); setShowMySelf(true)};
    const openDeclineConfirm = () => {setShowDecline(true); setShowMySelf(false)};
    const openAcceptConfirm = () => {setShowAccept(true); setShowMySelf(false)};
    const userString = localStorage.getItem("user");
    const userJSON = JSON.parse(userString || "");
    const data = props.data;

    async function declineConfirmation() {
        console.log(props.role);
        try {
            var requestBody;
            if (props.role === 'member') {
                requestBody = {
                    'invitingGroups': data._id,
                    'operation': 'remove',
                }
            }
            else {
                requestBody = {
                    'invitingLeadingGroups': data._id,
                    'operation': 'remove',
                }
            }
            await axios({
                method: "patch",
                url: `${homeurl}/users/${userJSON._id}`,
                data: requestBody
            })
            await updateUser(props.handleReload);
            closeDeclineConfirm();
            props.handleClose();
        }
        catch (e) {
            console.log(e);
        }
    }

    async function acceptConfirmation() {
        console.log(props.role);
        try {
            var requestBody;
            if (props.role === 'member') {
                requestBody = {
                    'invitingGroups': data._id,
                    'operation': 'remove',
                }
            }
            else {
                requestBody = {
                    'invitingLeadingGroups': data._id,
                    'operation': 'remove',
                }
            }
            await axios({
                method: "patch",
                url: `${homeurl}/users/${userJSON._id}`,
                data: requestBody
            });
        }
        catch (e) {
            console.log(e);
        }
        try {
            var requestBody_2;
            if (props.role === 'member') {
                requestBody_2 = {
                    'belongingGroups': data._id,
                    'operation': 'add',
                }
            }
            else {
                requestBody_2 = {
                    'leadingGroups': data._id,
                    'operation': 'add',
                }
            }
            await axios({
                method: "patch",
                url: `${homeurl}/users/${userJSON._id}`,
                data: requestBody_2
            })
            await updateUser(props.handleReload);
            closeAcceptConfirm();
            props.handleClose();
        }
        catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        /* Only run the function is props.show is true */
        setShowMySelf(props.show);
        if (props.show === true) {
            if (data.leaders && data.leaders.length > 0) {
                axios({
                    method: "get",
                    url: `${homeurl}/users?where={"_id": {"$in": ${JSON.stringify(data.leaders)}}}&select={"name": 1, "_id": 0}`
                }).then((r) => {
                    setLeaderNames(r.data.data);
                })
            }
            if (data.members && data.members.length > 0) {
                axios({
                    method: "get",
                    url: `${homeurl}/users?where={"_id": {"$in": ${JSON.stringify(data.members)}}}&select={"name": 1, "_id": 0}`
                }).then((r) => {
                    setMemberNames(r.data.data);
                })
            }
        }
    }, [props.show])


    return (<>
    <Modal show={showMySelf} onHide={props.handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Group Invitation</Modal.Title>
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
                            {leaderNames.map((leader:any, index:number) => <ListGroup.Item key={index}>{leader.name}</ListGroup.Item>)}
                        </ListGroup>
                    </Form.Group>
                }

                {data.members && data.members.length > 0 &&
                    <Form.Group className="mb-3">
                        <Form.Label>Group Member(s)</Form.Label>
                        <ListGroup>
                            {memberNames.map((member:any, index:number) => <ListGroup.Item key={index}>{member.name}</ListGroup.Item>)}
                        </ListGroup>
                    </Form.Group>
                }
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={openDeclineConfirm}>
                Decline
            </Button>
            <Button variant="primary" onClick={openAcceptConfirm}>
                Accept
            </Button>
        </Modal.Footer>
    </Modal>
    <ConfirmationModal title="Decline Invitation" body="Are you sure to decline the invitation?" show={showDecline} handleClose={closeDeclineConfirm} handleConfirm={declineConfirmation}></ConfirmationModal>
    <ConfirmationModal title="Accept Invitation" body="Are you sure to accept the invitation?" show={showAccept} handleClose={closeAcceptConfirm} handleConfirm={acceptConfirmation}></ConfirmationModal>
    </>
    )
}