import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import {useState} from "react";
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import {updateUser} from "./updateUser";

const homeurl = 'https://grouptodos.herokuapp.com/api'

export default function AddGroupModal(props: any) {
    const [errorMsg, setErrorMsg] = useState("");
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    async function postGroup() {
        // @ts-ignore
        var groupName = (document.getElementById("group-name-new") ? document.getElementById("group-name-new").value : "");
        // @ts-ignore
        var groupDescription = (document.getElementById("group-description-new") ? document.getElementById("group-description-new").value : "");
        if (groupName === "") {
            setErrorMsg("Group name cannot be empty!")
            setShowErrorMsg(true);
            return;
        }
        else {
            setShowErrorMsg(false);
        }
        // @ts-ignore
        const user = localStorage.getItem("user") || "";
        var requestBody = {
            'name': groupName,
            'description': groupDescription
        };
        if (groupDescription === "") {
            delete requestBody.description;
        }
        /* Post the group information to the backend database */
        var resp;
        try {
            resp = await axios({
                method: "post",
                url: `${homeurl}/groups`,
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
                url: `${homeurl}/groups/${resp.data.data._id}`,
                data: {
                    'leaders': JSON.parse(user)._id,
                    'operation': "add"
                }
            })
            await updateUser(props.setReload);
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
                    <Modal.Title>Create a Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Group name</Form.Label>
                            <Form.Control type="input" placeholder="Group Name" autoFocus id="group-name-new"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Group description</Form.Label>
                            <Form.Control as="textarea" rows={5} id='group-description-new'/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={postGroup}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}