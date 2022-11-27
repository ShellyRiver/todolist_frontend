import Modal from "react-bootstrap/Modal";
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';import ListGroup from "react-bootstrap/ListGroup";
import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Alert from "react-bootstrap/Alert";

const homeurl = 'http://localhost:4000/api'

export default function InviteCollaboratorModal(props: any) {
    const data = props.data;
    const [leaderNames, setLeaderNames]: any = useState([]);
    const [memberNames, setMemberNames] = useState([]);
    const [pendingLeaderNames, setPendingLeaderNames] = useState([]);
    const [pendingMemberNames, setPendingMemberNames] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [memberEmails, setMemberEmails] = useState([]);
    async function inviteCollaborator() {
        // @ts-ignore
        var invitedCollaborator = document.getElementById('invited-collaborator').value;
        // @ts-ignore
        var invitedRole = document.getElementById('invited-role').value;
        // Check if the given email is already in the group
        for (let i = 0; i < memberEmails.length; i++) {
            if (memberEmails[i] == invitedCollaborator) {
                setShowErrorMsg(true);
                setErrorMsg("The user is already in the group!");
                return;
            }
        }
        // Obtain the user id
        var invitedUserInfo;
        try {
            invitedUserInfo = await axios({
                method: "get",
                url: `${homeurl}/users?where={"email": ${JSON.stringify(invitedCollaborator)}}`
            })
            if (invitedUserInfo.data.data.length === 0) {
                setShowErrorMsg(true);
                setErrorMsg("The user does not exist!");
                return;
            }
        }
        catch (e) {
            setShowErrorMsg(true);
            setErrorMsg("The user does not exist!");
            return;
        }
        // Add the user into the group
        try {
            var requestBody;
            if (invitedRole === 'Member') {
                requestBody = {
                    'pendingMembers': invitedUserInfo.data.data[0]._id,
                    'operation': 'add'
                };
            }
            else if (invitedRole === 'Leader') {
                requestBody = {
                    'pendingLeaders': invitedUserInfo.data.data[0]._id,
                    'operation': 'add'
                };
            }
            await axios({
                method: "patch",
                url: `${homeurl}/groups/${props.groupId}`,
                data: requestBody
            });
            setShowErrorMsg(false);
            props.setReload();
            props.handleClose();
        }
        catch (e) {
            setShowErrorMsg(true);
            setErrorMsg("Sorry! We meet some internal errors!");
            return;
        }
    }

    useEffect(() => {
        /* Only run the function is props.show is true */
        if (props.show === true) {
            setShowErrorMsg(false);
            setMemberEmails([]);
            var peopleIds: any = [];
            if (data.leaders && data.leaders.length > 0) {
                axios({
                    method: "get",
                    url: `${homeurl}/users?where={"_id": {"$in": ${JSON.stringify(data.leaders)}}}&select={"name": 1, "email": 1, "_id": 0}`
                }).then((r) => {
                    setLeaderNames(r.data.data);
                    // @ts-ignore
                    r.data.data.map((leader: any, index: any) => setMemberEmails((emails)=>{
                        // @ts-ignore
                        return [...emails, leader.email];
                    }));
                })
            }
            if (data.members && data.members.length > 0) {
                axios({
                    method: "get",
                    url: `${homeurl}/users?where={"_id": {"$in": ${JSON.stringify(data.members)}}}&select={"name": 1, "email": 1, "_id": 0}`
                }).then((r) => {
                    setMemberNames(r.data.data);
                    // @ts-ignore
                    r.data.data.map((member: any, index: any) => setMemberEmails((emails)=>{
                        // @ts-ignore
                        return [...emails, member.email];
                    }));
                })
            }
            if (data.pendingLeaders && data.pendingLeaders.length > 0) {
                axios({
                    method: "get",
                    url: `${homeurl}/users?where={"_id": {"$in": ${JSON.stringify(data.pendingLeaders)}}}&select={"name": 1, "email": 1, "_id": 0}`
                }).then((r) => {
                    setPendingLeaderNames(r.data.data);
                    // @ts-ignore
                    r.data.data.map((leader: any, index: any) => setMemberEmails((emails)=>{
                        // @ts-ignore
                        return [...emails, leader.email];
                    }));
                })
            }
            if (data.pendingMembers && data.pendingMembers.length > 0) {
                axios({
                    method: "get",
                    url: `${homeurl}/users?where={"_id": {"$in": ${JSON.stringify(data.pendingMembers)}}}&select={"name": 1, "email": 1, "_id": 0}`
                }).then((r) => {
                    setPendingMemberNames(r.data.data);
                    // @ts-ignore
                    r.data.data.map((member: any, index: any) => setMemberEmails((emails)=>{
                        // @ts-ignore
                        return [...emails, member.email];
                    }));
                })
            }
        }
    }, [props.show])

    return (<>
    <Modal show={props.show} onHide={props.handleClose}>
        {showErrorMsg && <Alert variant="danger" onClose={() => setShowErrorMsg(false)} dismissible>
            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
            <p>
                {errorMsg}
            </p>
        </Alert>}
        <Modal.Header closeButton>
            <Modal.Title>Invite Collaborators</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                {data.leaders && data.leaders.length > 0 && leaderNames &&
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

                {data.pendingLeaders && data.pendingLeaders.length > 0 &&
                    <Form.Group className="mb-3">
                        <Form.Label>Group Pending Leader(s)</Form.Label>
                        <ListGroup>
                            {pendingLeaderNames.map((leader:any, index:number) => <ListGroup.Item key={index}>{leader.name}</ListGroup.Item>)}
                        </ListGroup>
                    </Form.Group>
                }

                {data.pendingMembers && data.pendingMembers.length > 0 &&
                    <Form.Group className="mb-3">
                        <Form.Label>Group Pending Member(s)</Form.Label>
                        <ListGroup>
                            {pendingMemberNames.map((member:any, index:number) => <ListGroup.Item key={index}>{member.name}</ListGroup.Item>)}
                        </ListGroup>
                    </Form.Group>
                }

                <Form.Group className="mb-3">
                    <Form.Label>New Collaborator Email</Form.Label>
                    <Form.Control type="email" placeholder="example@email" autoFocus id="invited-collaborator"/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Row>
                        <Col sm={{span: 4}}>
                            <Form.Select id="invited-role">
                                <option>Member</option>
                                <option>Leader</option>
                            </Form.Select>
                        </Col>
                        <Col>
                            <Button variant="primary" onClick={inviteCollaborator}>
                                Send invitation
                            </Button>
                        </Col>
                    </Row>
                </Form.Group>
            </Form>
        </Modal.Body>
    </Modal>
    </>
    )
}