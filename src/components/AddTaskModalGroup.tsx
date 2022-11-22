import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import React, {useEffect, useState} from "react";
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import home from "../pages/Home";

const homeurl = 'http://localhost:4000/api'

export default function AddTaskModalGroup(props: any) {
    const [errorMsg, setErrorMsg] = useState("");
    const [groupInfo, setGroupInfo] = useState({
        leaders: undefined,
        members: undefined
    });
    const [groupMemberInfo, setGroupMemberInfo] = useState([]);
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    async function postTask() {
        // @ts-ignore
        var taskName = (document.getElementById("task-name-new-group") ? document.getElementById("task-name-new-group").value : "");
        // @ts-ignore
        var taskDescription = (document.getElementById("task-description-new-group") ? document.getElementById("task-description-new-group").value : "");
        // @ts-ignore
        var taskDeadline = (document.getElementById("task-deadline-new-group") ? document.getElementById("task-deadline-new-group").value : "");
        if (taskName == "") {
            setErrorMsg("Task name cannot be empty!")
            setShowErrorMsg(true);
        }
        else if (taskDeadline == "") {
            setErrorMsg("Task deadline cannot be empty!")
            setShowErrorMsg(true);
        }
        else {
            setShowErrorMsg(false);
        }
        // @ts-ignore
        const user = localStorage.getItem("user") || "";

        console.log('assignedUsers', JSON.parse(user)._id);
        var requestBody = {
            'name': taskName,
            'description': taskDescription,
            'endTime': taskDeadline,
        };
        if (taskDescription == "") {
            delete requestBody.description;
        }
        console.log(requestBody);
        /* Post the user information to the backend database */
        var resp;
        try {
            resp = await axios({
                method: "post",
                url: `${homeurl}/tasks`,
                data: requestBody
            });
        }
        catch (e: any) {
            // console.log(e);
            // props.handleClose();
            // @ts-ignore
            setErrorMsg({e});
            setShowErrorMsg(true);
        }
        try {
            console.log(resp)
            await axios({
                method: "patch",
                // @ts-ignore
                url: `${homeurl}/tasks/${resp.data.data._id}`,
                data: {
                    'assignedUsers': JSON.parse(user)._id,
                    'operation': "add"
                }
            })
            props.handleClose();
        }
        catch (e) {
            console.log(e);
            props.handleClose();
        }
    }
    useEffect(()=>{
        if (props.show == true) {
            console.log(props.groupId);
            axios({
                method: "get",
                url: `${homeurl}/groups/${props.groupId}`
            }).then(r => {
                setGroupInfo(r.data.data[0]);
                console.log(r.data.data[0]);
                const members = r.data.data[0].members;
                const leaders = r.data.data[0].leaders;
                const allUsers = members.concat(leaders);
                console.log(JSON.stringify(allUsers))
                axios({
                    method: "get",
                    url: `${homeurl}/users?where={"_id": {"$in": ${JSON.stringify(allUsers)}}}`
                }).then(response => {
                    console.log(response);
                    setGroupMemberInfo(response.data.data);
                }).catch(e => console.log(e))
            }).catch(e => {
                console.log(e);
            });
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
                    <Modal.Title>Add a Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Task name</Form.Label>
                            <Form.Control type="input" placeholder="Task Name" autoFocus id="task-name-new-group"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Assigned Members</Form.Label>
                            <Form.Select aria-label="Default select example" onChange={(event)=>console.log(event.target.value)}>
                                {groupMemberInfo.map((member: any, index: any)=>{
                                    return <option key={member._id} value={member._id}>{member.name}</option>
                                })}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Task deadline</Form.Label>
                            <Form.Control type="date" id='task-deadline-new-group'/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Task description</Form.Label>
                            <Form.Control as="textarea" rows={5} id='task-description-new-group'/>
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