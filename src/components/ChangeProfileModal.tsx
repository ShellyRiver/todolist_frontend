import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import React from "react";
import Button from 'react-bootstrap/Button';


export default function ChangeProfileModal(props: any) {
    const data = props.data;
    async function changeProfile() {
        // @ts-ignore
        var newName = (document.getElementById("new-profile-name") ? document.getElementById("new-profile-name").value : null);
        // @ts-ignore
        var newDescription = (document.getElementById("new-profile-description") ? document.getElementById("new-profile-description").value : null);
        if (newName == props.data.name || newName == "") {
            newName = null;
        }
        if (newDescription == props.data.description || newDescription == "") {
            newDescription = null;
        }
        
    }
    console.log(data);
    // @ts-ignore
    return (
        <>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>User Name</Form.Label>
                            <Form.Control
                                placeholder="User Name"
                                autoFocus
                                defaultValue= {props.data.name || ""}
                                id = "new-profile-name"
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Label>Personal Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                placeholder="Personal Description"
                                defaultValue={props.data.description || ""}
                                id = "new-profile-description"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={changeProfile}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}