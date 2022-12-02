import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import React from "react";
import Button from 'react-bootstrap/Button';
import {updateUser} from "./updateUser";

const homeurl = 'http://localhost:4000/api'

export default function ChangeGroupModal(props: any) {
    const data = props.data;
    async function changeGroup() {
        // @ts-ignore
        var newName = (document.getElementById("new-group-name") ? document.getElementById("new-group-name").value : null);
        // @ts-ignore
        var newDescription = (document.getElementById("new-group-description") ? document.getElementById("new-group-description").value : null);
        var requestBody = {
            'name': newName,
            'description': newDescription
        };
        if (newName == props.data.name || newName == "") {
            delete requestBody.name;
        }
        if (newDescription == props.data.description || newDescription == "") {
            newDescription = null;
            delete requestBody.description;
        }
        /* Update the group information to the backend database */
        try {
            await axios({
                method: "put",
                url: `${homeurl}/groups/${props.data._id}`,
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
    // @ts-ignore
    return (
        <>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Group Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Group Name</Form.Label>
                            <Form.Control
                                placeholder="Group Name"
                                autoFocus
                                defaultValue= {props.data.name || ""}
                                id = "new-group-name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Group Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                placeholder="Group Description"
                                defaultValue={props.data.description || ""}
                                id = "new-group-description"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={changeGroup}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}