import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import React, {useEffect, useState} from "react";
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import home from "../pages/Home";

const homeurl = 'https://grouptodos.herokuapp.com/api'

export default function DeleteGroupMemberModal(props: any) {
    const [errorMsg, setErrorMsg] = useState("");
    const [groupInfo, setGroupInfo] = useState({
        leaders: undefined,
        members: undefined
    });
    const [groupMemberInfo, setGroupMemberInfo] = useState([]);
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    async function deleteMember() {
        // @ts-ignore
        var taskName = (document.getElementById("task-name-new-group") ? document.getElementById("task-name-new-group").value : "");
        // @ts-ignore
        var taskDescription = (document.getElementById("task-description-new-group") ? document.getElementById("task-description-new-group").value : "");
        // @ts-ignore
        var taskDeadline = (document.getElementById("task-deadline-new-group") ? document.getElementById("task-deadline-new-group").value : "");
        // @ts-ignore
        var taskMember = (document.getElementById("task-member-new-group") ? document.getElementById("task-member-new-group").value : "");
        if (taskName == "") {
            setErrorMsg("Task name cannot be empty!")
            setShowErrorMsg(true);
            return;
        }
        else if (taskDeadline == "") {
            setErrorMsg("Task deadline cannot be empty!")
            setShowErrorMsg(true);
            return;
        }
        else {
            setShowErrorMsg(false);
        }
        var requestBody = {
            'name': taskName,
            'description': taskDescription,
            'endTime': taskDeadline,
        };
        if (taskDescription == "") {
            delete requestBody.description;
        }
        /* Post the task information to the backend database */
        var resp;
        try {
            resp = await axios({
                method: "post",
                url: `${homeurl}/tasks`,
                data: requestBody
            });
        }
        catch (e: any) {
            // @ts-ignore
            setErrorMsg({e});
            setShowErrorMsg(true);
            return;
        }
        /* Add assigned group */
        try {
            await axios({
                method: "put",
                // @ts-ignore
                url: `${homeurl}/tasks/${resp.data.data._id}`,
                data: {
                    'assignedGroup': props.groupId
                }
            })
        }
        catch (e) {
            // @ts-ignore
            setErrorMsg({e});
            setShowErrorMsg(true);
            return;
        }
        /* Add assigned user */
        try {
            await axios({
                method: "patch",
                // @ts-ignore
                url: `${homeurl}/tasks/${resp.data.data._id}`,
                data: {
                    'assignedUsers': taskMember,
                    'operation': "add"
                }
            })
            props.handleClose();
        }
        catch (e) {
            // @ts-ignore
            setErrorMsg({e});
            setShowErrorMsg(true);
            return;
        }
    }
    useEffect(()=>{
        /* Get the information of all members and pendingMembers*/
        if (props.show == true) {
            const members = props.data.members;
            const pendingMembers = props.data.pendingMembers;
            const allMembers = members.concat(pendingMembers);
            axios({
                method: "get",
                url: `${homeurl}/users?where={"_id": {"$in": ${JSON.stringify(allMembers)}}}`
            }).then(response => {
                setGroupMemberInfo(response.data.data);
            }).catch(e => console.log(e))
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
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Deleted Member</Form.Label>
                            <Form.Select aria-label="Default select example" id="deleted-member">
                                {groupMemberInfo.map((member: any, index: any)=>{
                                    return <option key={member._id} value={member._id}>{member.name}</option>
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary">
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}