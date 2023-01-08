import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Button from 'react-bootstrap/Button';

const homeurl = 'https://grouptodos.herokuapp.com/api'

export default function ChangeProfileModal(props: any) {
    async function changeProfile() {

        // @ts-ignore
        var newName = (document.getElementById("new-profile-name") ? document.getElementById("new-profile-name").value : null);
        // @ts-ignore
        var newDescription = (document.getElementById("new-profile-description") ? document.getElementById("new-profile-description").value : null);
        var requestBody = {
            'name': newName,
            'description': newDescription
        };
        if (newName === props.data.name || newName === "") {
            delete requestBody.name;
        }
        if (newDescription === props.data.description || newDescription === "") {
            newDescription = null;
            delete requestBody.description;
        }
        /* Update the profile to the backend database */
        try {
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
            props.handleClose();
        }
        catch (e) {
            // console.log(e);
            props.handleClose();
        }


    }
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