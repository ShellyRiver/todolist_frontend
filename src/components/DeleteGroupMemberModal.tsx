import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import React, {useEffect, useState} from "react";
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import {updateUser} from "./updateUser";

const homeurl = 'https://grouptodos.herokuapp.com/api'

export default function DeleteGroupMemberModal(props: any) {
    const [errorMsg, setErrorMsg] = useState("");
    const [groupMemberInfo, setGroupMemberInfo] = useState([]);
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    async function deleteMember() {
        // @ts-ignore
        var deletedMember = (document.getElementById("deleted-member") ? document.getElementById("deleted-member").value : "");
        if (deletedMember === "") {
            setErrorMsg("No member in the group!");
            setShowErrorMsg(true);
            return;
        }
        var memberType;
        for (let i = 0; i <  props.data.members.length; i++) {
            if ( props.data.members[i] === deletedMember){
                memberType = "member";
                break;
            }
        }
        for (let i = 0; i <  props.data.pendingMembers.length; i++) {
            if ( props.data.pendingMembers[i] === deletedMember){
                memberType = "pendingMember";
                break;
            }
        }
        var requestBody;
        if (memberType === "member") {
            requestBody = {
                'members': deletedMember,
                'operation': 'remove'
            }
        }
        else {
            requestBody = {
                'pendingMembers': deletedMember,
                'operation': 'remove'
            }
        }
        try {
            await axios({
                method: "patch",
                url: `${homeurl}/groups/${props.groupId}`,
                data: requestBody
            });
            await updateUser(props.setReload);
            props.handleClose();
        }
        catch (e) {
            console.log(e);
            props.handleClose();
        }
    }
    useEffect(()=>{
        /* Get the information of all members and pendingMembers*/
        if (props.show === true) {
            const members = props.data.members;
            const pendingMembers = props.data.pendingMembers;
            const allMembers = members.concat(pendingMembers);
            console.log(allMembers);
            if (allMembers.length > 0) {
                axios({
                    method: "get",
                    url: `${homeurl}/users?where={"_id": {"$in": ${JSON.stringify(allMembers)}}}&select={"name": 1, "_id": 1}`
                }).then(response => {
                    setGroupMemberInfo(response.data.data);
                }).catch(e => console.log(e))
            }
            else { // No members in the group
                setGroupMemberInfo([]);
            }
        }
    }, [props.show])

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose}>
                {showErrorMsg && <Alert variant="danger" onClose={() => setShowErrorMsg(false)} dismissible>
                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                    <p>
                        {errorMsg}
                    </p>
                </Alert>}

                <Modal.Header closeButton>
                    <Modal.Title>Delete Group Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {groupMemberInfo.length > 0 &&
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Deleted Member</Form.Label>
                                <Form.Select aria-label="Default select example" id="deleted-member">
                                    {groupMemberInfo.map((member: any, index: any) => {
                                        return <option key={member._id} value={member._id}>{member.name}</option>
                                    })}
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    }
                    {groupMemberInfo.length === 0 &&
                        <Form.Label>Currently, there are no members in the group.</Form.Label>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                    {groupMemberInfo.length > 0 &&
                    <Button variant="primary" onClick={deleteMember}>
                        Confirm
                    </Button>}
                </Modal.Footer>
            </Modal>
        </>
    )
}