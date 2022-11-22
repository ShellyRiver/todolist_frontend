import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

const homeurl = 'http://localhost:4000/api'

export default function AddTaskModal(props: any) {
    const [errorMsg, setErrorMsg] = useState("");
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    async function postTask() {
        // @ts-ignore
        var taskName = (document.getElementById("task-name-new") ? document.getElementById("task-name-new").value : "");
        // @ts-ignore
        var taskDescription = (document.getElementById("task-description-new") ? document.getElementById("task-description-new").value : "");
        // @ts-ignore
        var taskDeadline = (document.getElementById("task-deadline-new") ? document.getElementById("task-deadline-new").value : "");
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
    return (
        <>
            <Modal show={props.show} onHide={props.handleClose}>
                {showErrorMsg && <Alert variant="danger" onClose={() => setShowErrorMsg(false)} dismissible>
                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                    <p>{errorMsg}</p>
                </Alert>}
                <Modal.Header closeButton>
                    <Modal.Title>Add a Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Task name</Form.Label>
                            <Form.Control type="input" placeholder="Task Name" autoFocus id="task-name-new"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Task deadline</Form.Label>
                            <Form.Control type="date" id='task-deadline-new'/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Task description</Form.Label>
                            <Form.Control as="textarea" rows={5} id='task-description-new'/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={postTask}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}