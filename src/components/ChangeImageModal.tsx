import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import React from "react";
import Button from 'react-bootstrap/Button';

const homeurl = 'http://localhost:4000/api'

export default function ChangeImageModal(props: any) {
    const data = props.data;
    async function changeProfile() {

        // @ts-ignore
        var newName = (document.getElementById("new-profile-name") ? document.getElementById("new-profile-name").value : null);
        // @ts-ignore
        var newDescription = (document.getElementById("new-profile-description") ? document.getElementById("new-profile-description").value : null);
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
        /* Update the profile to the backend database */
        try {
            // console.log(`${homeurl}/users/${props.data._id}`);
            await axios({
                method: "put",
                url: `${homeurl}/users/${props.data._id}`,
                data: requestBody
            });
        }
        catch (e) {
            // console.log(e);
            props.handleClose();
        }
        try {
            const response = await axios({
                method: "get",
                url: `${homeurl}/users/${props.data._id}`
            });
            localStorage.setItem('user', JSON.stringify(response.data.data[0]));
            // console.log(response.data.data[0]);
            props.handleClose();
        }
        catch (e) {
            // console.log(e);
            props.handleClose();
        }


    }
    // console.log(data);
    // @ts-ignore
    return (
        <>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Profile Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Label>Profile Image</Form.Label>
                            <Form.Control
                                type="file"
                                id = "new-profile-description"
                                accept="image/*"
                                name="images[]"
                            />
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